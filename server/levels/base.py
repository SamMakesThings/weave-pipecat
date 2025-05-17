"""Base configuration for challenge levels.

This module defines the base configuration class that all level-specific
configurations inherit from. It provides default values and methods that
can be overridden by level-specific configurations.
"""

import os
from typing import Dict, Any, List, Callable, Optional, TypeVar, Union, cast
from abc import ABC, abstractmethod

import aiohttp
from openai.types.chat import ChatCompletionToolParam, ChatCompletionMessageParam
from pipecat.services.cartesia import CartesiaTTSService
from pipecat.services.openai import OpenAILLMService


class BaseLevelConfig(ABC):
    """Base configuration for a challenge level.
    
    This class defines the interface and default values for level-specific
    configurations. Subclasses should override properties and methods as needed.
    """
    
    @property
    @abstractmethod
    def level_id(self) -> int:
        """The ID of the level."""
        pass
    
    @property
    @abstractmethod
    def weave_project(self) -> str:
        """The Weave project name for this level."""
        pass
    
    @property
    @abstractmethod
    def messages(self) -> List[ChatCompletionMessageParam]:
        """The initial messages for the conversation.
        
        This should include the system prompt and any other initial messages.
        
        Returns:
            A list of message dictionaries conforming to ChatCompletionMessageParam.
        """
        pass
    
    @property
    def tools(self) -> List[ChatCompletionToolParam]:
        """The tools available to the language model for this level.
        
        Returns:
            A list of ChatCompletionToolParam objects.
        """
        return []
    
    @property
    def function_handlers(self) -> Dict[str, Callable[..., Any]]:
        """The function handlers for this level.
        
        Returns:
            A dictionary mapping function names to handler functions.
        """
        return {}
    
    def get_tts_service(self) -> CartesiaTTSService:
        """Get the text-to-speech service for this level.
        
        Returns:
            A CartesiaTTSService instance.
        """
        api_key = os.getenv("CARTESIA_API_KEY")
        if api_key is None:
            raise ValueError("CARTESIA_API_KEY environment variable is not set")
        
        return CartesiaTTSService(
            api_key=api_key,
            voice_id="79a125e8-cd45-4c13-8a67-188112f4dd22",  # British Lady (default)
        )
    
    def get_llm_service(self) -> OpenAILLMService:
        """Get the language model service for this level.
        
        Returns:
            An OpenAILLMService instance.
        """
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key is None:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        
        return OpenAILLMService(
            api_key=api_key,
            model="gpt-4o",  # Default model
        )
    
    def get_challenge_completion_payload(self, tool_name: str, weave_trace_url: Optional[str] = None) -> Dict[str, Any]:
        """Get the payload for the challenge completion event.
        
        Args:
            tool_name: The name of the tool that was called to complete the challenge.
            weave_trace_url: The URL to the Weave trace for this conversation.
            
        Returns:
            A dictionary with the challenge completion payload.
        """
        return {
            "level": self.level_id,
            "tool": tool_name,
            "weaveTraceUrl": weave_trace_url
        }
