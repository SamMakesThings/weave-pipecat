"""OpenAI Bot Implementation.

This module implements a chatbot using OpenAI's GPT-4 model for natural language
processing. It includes:
- Real-time audio/video interaction through Daily
- Animated robot avatar
- Text-to-speech using ElevenLabs
- Support for both English and Spanish

The bot runs as part of a pipeline that processes audio/video frames and manages
the conversation flow.
"""

import asyncio
import io
import os
import sys
import wave
from typing import Dict, Any, Optional, List

import aiohttp
from dotenv import load_dotenv
from loguru import logger
# from PIL import Image
import weave

from openai.types.chat import ChatCompletionToolParam, ChatCompletionMessageParam
from pipecat.audio.vad.silero import SileroVADAnalyzer
# from pipecat.frames.frames import (
#     BotStartedSpeakingFrame,
#     BotStoppedSpeakingFrame,
#     Frame,
#     OutputImageRawFrame,
#     SpriteFrame,
# )
from pipecat.processors.frameworks.rtvi import RTVIServerMessageFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.openai_llm_context import OpenAILLMContext
# from pipecat.processors.frame_processor import FrameDirection, FrameProcessor
from pipecat.processors.audio.audio_buffer_processor import AudioBufferProcessor
from pipecat.processors.frameworks.rtvi import RTVIConfig, RTVIProcessor, RTVIObserver
# from pipecat.services.elevenlabs import ElevenLabsTTSService
from pipecat.services.cartesia import CartesiaTTSService
from pipecat.services.openai import OpenAILLMService
from pipecat.transports.services.daily import DailyParams, DailyTransport
from pipecatcloud.agent import DailySessionArguments

# Use relative import to avoid issues when deploying
from levels import get_level_config

load_dotenv(override=True)
# logger.remove(0)
logger.add(sys.stderr, level="DEBUG")

sprites = []
script_dir = os.path.dirname(__file__)
print("SCRIPT_DIR:", script_dir)

# Global variables
rtvi_processor = None
current_level_config = None


@weave.op()
async def save_audio(audio: bytes, sample_rate: int, num_channels: int, name: str):
    if len(audio) > 0:
        # filename = f"conversation_recording{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.wav"
        with io.BytesIO() as buffer:
            with wave.open(buffer, "wb") as wf:
                wf.setsampwidth(2)
                wf.setnchannels(num_channels)
                wf.setframerate(sample_rate)
                wf.writeframes(audio)
            print("saving file")
            buffer.seek(0)
            return wave.open(io.BytesIO(buffer.getvalue()), "rb")
    else:
        print("No audio data to save")


# Handle function calls and send challenge completion events
async def handle_function_call(function_name, tool_call_id, args, llm, context, result_callback):
    """Generic function handler that delegates to level-specific handlers.
    
    This function is called when the language model calls any registered function.
    It delegates to the appropriate level-specific handler and sends challenge completion
    events when necessary.
    
    Args:
        function_name: The name of the function that was called.
        tool_call_id: The ID of the tool call.
        args: The arguments passed to the function.
        llm: The language model service.
        context: The conversation context.
        result_callback: A callback function to return the result.
    """
    logger.info(f"Function call: {function_name}")
    
    # Get the current level configuration
    global current_level_config
    if not current_level_config:
        logger.error("No level configuration found")
        result = {"message": "Error: No level configuration found"}
        await result_callback(result)
        return
    
    # Get the function handler for this function
    handler = current_level_config.function_handlers.get(function_name)
    if not handler:
        logger.error(f"No handler found for function: {function_name}")
        result = {"message": f"Error: Function {function_name} not supported"}
        await result_callback(result)
        return
    
    # Call the level-specific handler
    challenge_completed, payload = await handler(
        function_name, tool_call_id, args, llm, context, result_callback
    )
    
    # If the challenge was completed, send a challenge completion event
    if challenge_completed:
        global rtvi_processor
        if rtvi_processor:
            logger.info(f"Sending challenge_completed event to client for level {current_level_config.level_id}")
            frame = RTVIServerMessageFrame(
                data={
                    "type": "challenge_completed",
                    "payload": payload
                }
            )
            await rtvi_processor.push_frame(frame)


@weave.op()
async def main(room_url: str, token: str, custom_data: Optional[Dict[str, Any]] = None):
    """Main bot execution function.

    Sets up and runs the bot pipeline including:
    - Daily video transport
    - Speech-to-text and text-to-speech services
    - Language model integration
    - Animation processing
    - RTVI event handling
    
    Args:
        room_url: The Daily room URL
        token: The Daily room token
        custom_data: Custom data passed from the client, including the level ID
    """
    log = logger
    log.debug("Starting bot in room: {}", room_url)
    
    # Get the level ID from custom data, default to level 0
    level_id = 0
    if custom_data and isinstance(custom_data, dict):
        level_id = custom_data.get("level", 0)
    
    # Get the level configuration
    global current_level_config
    current_level_config = get_level_config(level_id)
    log.info(f"Using level configuration for level {level_id}")
    
    # Initialize Weave with the level-specific project name
    weave.init(project_name=current_level_config.weave_project)
    log.info(f"Initialized Weave with project name: {current_level_config.weave_project}")

    async with aiohttp.ClientSession() as session:

        # Set up Daily transport with video/audio parameters
        transport = DailyTransport(
            room_url,
            token,
            "Chatbot",
            DailyParams(
                audio_out_enabled=True,
                camera_out_enabled=True,
                camera_out_width=1024,
                camera_out_height=576,
                vad_enabled=True,
                vad_analyzer=SileroVADAnalyzer(),
                transcription_enabled=True,
            ),
        )

        # Initialize text-to-speech service using level-specific configuration
        tts = current_level_config.get_tts_service()

        # Initialize LLM service using level-specific configuration
        llm = current_level_config.get_llm_service()

        # Set up conversation context and management with level-specific messages and tools
        context = OpenAILLMContext(current_level_config.messages, tools=current_level_config.tools)
        context_aggregator = llm.create_context_aggregator(context)

        audiobuffer = AudioBufferProcessor(enable_turn_audio=True)

        # RTVI events for Pipecat client UI
        rtvi = RTVIProcessor(config=RTVIConfig(config=[]))

        global rtvi_processor
        rtvi_processor = rtvi

        # Register function handlers
        for function_name in current_level_config.function_handlers:
            llm.register_function(
                function_name,
                handle_function_call
            )

        pipeline = Pipeline(
            [
                transport.input(),
                rtvi,
                context_aggregator.user(),
                llm,
                tts,
                audiobuffer,
                transport.output(),
                context_aggregator.assistant(),
            ]
        )

        task = PipelineTask(
            pipeline,
            params=PipelineParams(
                allow_interruptions=True,
                enable_metrics=True,
                enable_usage_metrics=True,
            ),
            observers=[RTVIObserver(rtvi)],
        )

        @audiobuffer.event_handler("on_audio_data")
        async def on_audio_data(buffer, audio, sample_rate, num_channels):
            await save_audio(audio, sample_rate, num_channels, "full")
        
        @audiobuffer.event_handler("on_user_turn_audio_data")
        async def on_user_turn_audio_data(buffer, audio, sample_rate, num_channels):
            print("on_user_turn_audio_data")
            await save_audio(audio, sample_rate, num_channels, "user")
        
        @audiobuffer.event_handler("on_bot_turn_audio_data")
        async def on_bot_turn_audio_data(buffer, audio, sample_rate, num_channels):
            print("on_bot_turn_audio_data")
            await save_audio(audio, sample_rate, num_channels, "bot")

        @rtvi.event_handler("on_client_ready")
        async def on_client_ready(rtvi):
            await rtvi.set_bot_ready()

        @transport.event_handler("on_first_participant_joined")
        async def on_first_participant_joined(transport, participant):
            await audiobuffer.start_recording()
            await transport.capture_participant_transcription(participant["id"])
            await task.queue_frames([context_aggregator.user().get_context_frame()])

        @transport.event_handler("on_participant_left")
        @weave.op()
        async def on_participant_left(transport, participant, reason):
            print(f"Participant left: {participant}")
            await task.cancel()

        runner = PipelineRunner()

        await runner.run(task)


if __name__ == "__main__":
    asyncio.run(main())

async def bot(args: DailySessionArguments):
    """Main bot entry point compatible with the FastAPI route handler.

    Args:
        room_url: The Daily room URL
        token: The Daily room token
        body: The configuration object from the request body
        session_id: The session ID for logging
    """
    logger.info(f"Bot process initialized {args.room_url} {args.token}")

    try:
        # Extract custom data from the request body
        custom_data = None
        if args.body and isinstance(args.body, dict):
            custom_data = args.body.get("customData")
        
        await main(args.room_url, args.token, custom_data)
        logger.info("Bot process completed")
    except Exception as e:
        logger.exception(f"Error in bot process: {str(e)}")
        raise
