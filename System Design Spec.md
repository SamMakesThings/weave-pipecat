# Overview
I want to expand the previous voice injection challenge that I built for the offsite and for the NVIDIA conference. The system I built did not have a UI and it only had one level of difficulty. I wanted to model the new challenge to be public on the internet, have multiple stages of difficulty to increase accessibility, and to directly tie in to Weave. The new version should be engaging, it should have some kind of fun imagery or interaction effect, maybe a 3D visualization that reacts once it has been broken. 

# Goals
I want to build a service or tool that goes viral and draws a substantial amount of attention to Weave. I want to get people to use and interact with Weave, and I want to position WeaveHacks as an authority. Some combination of going viral and getting direct use of Weave is my goal. 

# Constraints
This needs to be something that I can build within a week. It needs to have a full interface, and part of the experience needs to be in Weave itself. I'll also have a good number of credits that I can spend on this, but I'll need to get approval from somewhere. I think people using it would get me a large amount of budget, especially if those people are also diving into Weave. I may need some form of anti-abuse or anti-DDoS attack tool. 

# Spec
## Summary


## Stack
### Original Plan
- React, Next.JS, TypeScript
- Maybe Zustand for simple state management?
- PipeCat (probably, since we're collaborating with them)
- PipeCat Cloud
- Modal for FastAPI deployment. Automatically scaled FastAPI / Uvicorn. That, combined with pipe cat cloud service, means it should be quite scalable.

### Implementation
- React, Next.JS 15, TypeScript
- React Context API for state management (chosen over Zustand for simplicity)
- Tailwind CSS for styling
- PipeCat Cloud integration for voice capabilities
- Backend integration with FastAPI planned for level validation

## Levels
- Level 0: Authorize a bank transfer if they're authorized or if they really really need it
- Level 1: Only if they know a secret password that is in the prompt (or get it to call the function to enter the password)
	- Weaker model
- Level 2: Only if they are a specific authorized person and know some google-able facts about the authorized person
  - Lukas Biewald is the person they need to be. They should verify Lukas's city of birth (Boston).
- Level 3: Only if they are Lukas and can "verify their identity" through a secure method that isn't specified (ask Sam for the prompt)
- Level 4: Only if they know a secret password that is in the prompt and have been told not to share or hint at (or get it to call the function to enter the password)
	- Stronger model
- Level 5: Only if they use a specific OTP verification method (hard, need an LLM to ignore a tool)
	- Weaker model


## UI design
### Original Ideas
- Probably one of the least important components. It needs to be error-free, and graceful at handling problems. But I believe it can also be very simple.
- The stack should be [[Next.js]], [[TypeScript]], and [[Tailwind]].
- I do need to encourage people to look at and maybe sign up for Weave. I think, having a prominent link to a leaderboard after solving a challenge would work.
- Should I show the conversational transcript in real time? Would be kind of fun, but also abs complexity.
- It should work just as well on mobile. Maybe better.
- If I have time, making a 3-D reactive spline Model could be a unique experience.
- Use a soft gold yellow as the accent color.
- Keep the UI minimal.
- A user should only be able to progress to the next level after completing the current one. For the initial prototype, the user can just navigate between screens, but in the final version, the level should only advance once the backend FastAPI server says they've succeeded.
- The state for levels should not be stored on the client, where a smart user can access it.

### Implementation
- Built with Next.js, TypeScript, and Tailwind CSS as specified
- Responsive design that works well on both mobile and desktop
- Minimal UI with clean, focused screens for each part of the experience
- Soft gold yellow (#f5d742) used as the accent color throughout the application
- SVG illustrations for each level to provide visual context
- Level progression system where users can only access levels they've unlocked
- Success screens after completing challenges with links to results and leaderboard
- For the initial prototype, level completion is simulated client-side
- In the final version, level completion will be validated by the backend FastAPI server

### Screens
#### Original Plan
- Welcome screen. A message saying "Welcome", then a description of the challenge. 
	- "Are you good at prompt injection? What about social engineering? Put your skills to the test with our Voice Agent Prompt Injection Challenge. We have five different voice agents for you to talk to. You'll need to extract passwords, authorize bank transfers, negotiate impossible sales, and more. Are you ready?"
	- Also a "Start" button
- A level screen. The screen should have an image or SVG design relevant to that level. It should have a title, a description, and a "Call" button.
	- When a call is in progress, it should have an indicator that the call is active, and a "Hang up" button. Maybe a blinking red light?
	- When the server says the user succeed, give a "Good job!" message, a link to a transcript of their conversation, and a "next level" button.

#### Implementation
- **Welcome Screen**
  - Title: "Voice Agent Prompt Injection Challenge"
  - Description explaining the challenge using the specified text
  - "Start Challenge" button to begin
  
- **Level Selection**
  - Horizontal navigation bar showing all levels
  - Visual indicators for current, completed, and locked levels
  - Ability to jump between unlocked levels
  
- **Level Screen**
  - Level title and description
  - SVG illustration relevant to the level
  - "Call Agent" button to start the challenge
  - When call is in progress:
    - Pulsing red indicator showing active call
    - "Hang Up" button to end the call
  - After successful completion (triggered by real challenge completion events from the server):
    - Success message
    - Option to view transcript (to be implemented)
    - "Next Level" button
  
- **Success Screen**
  - Congratulations message
  - Summary of achievements
  - Links to view results and leaderboard
  - Option to start over

### State management
#### Original Ideas
- These are just ideas and should not be taken as gospel.
- Level status
	- Level state in the backend maybe? Don't want people to be able to edit their way forward. Either that or do a different page with each level, all of them password protected. Also lets people jump back to where they were
- Call status (includes permissions)

#### Implementation
Implemented using React Context API with separate contexts for different concerns:
  
- **LevelNavigationContext**
  - Manages which screen is currently displayed (welcome, level, success)
  - Stores information about all levels (title, description, image)
  - Tracks the currently selected level
  
- **LevelProgressContext**
  - Tracks which levels are completed and unlocked
  - Provides methods to complete levels and check status
  - Currently uses localStorage for persistence
  - Will be connected to backend validation in final version
  
- **CallContext**
  - Manages call status (idle, connecting, connected, etc.)
  - Handles microphone permissions
  - Provides methods to start and end calls
  - Integrated with PipeCat Cloud for voice capabilities
  - Tracks challenge completion state and listens for completion events from the server
  
- **RTVIProvider**
  - Initializes and manages the PipeCat client connection
  - Provides real-time voice interaction capabilities

### Project Structure
```
client/
├── public/
│   └── images/
│       ├── level0.svg
│       ├── level1.svg
│       ├── level2.svg
│       ├── level3.svg
│       └── level4.svg
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── api/
│   │       └── connect/
│   │           └── route.ts
│   ├── components/
│   │   ├── LevelScreen.tsx
│   │   ├── LevelSelector.tsx
│   │   ├── SuccessScreen.tsx
│   │   └── WelcomeScreen.tsx
│   └── contexts/
│       ├── AppContextProvider.tsx
│       ├── CallContext.tsx
│       ├── LevelNavigationContext.tsx
│       ├── LevelProgressContext.tsx
│       └── RTVIProvider.tsx
└── package.json
```


## Server structure
- if this does go viral, I need it to be very scalable. This makes me think a serverless structure would be best. Pipecat cloud is likely the lowest hanging fruit here. Serve the front end on something scalable, serve voice via Pipecat cloud. But I may need some other service to kick off those calls. Deployed FastAPI? How many calls could that take at once?
- I should verify how much Lavanya is willing to spend on credits for this
- I need five separately access weave projects. How can I make that work from a single running application? Isn't there only one project name per Weave instance? Do I need to have five deployed FastAPI servers? Hmm, asking [[Adrian Swanberg]] for help
	- FOUND IT
	- Ask someone to provision me an org, with high limits. Enable public projects on the org. Make the team itself private. Make the project public. Should enable security through obscurity, which is all I need.

### Level Configuration System

To support multiple levels of difficulty, a modular level configuration system has been implemented:

#### Architecture

- **Base Configuration Class**: A `BaseLevelConfig` abstract class that defines the interface for all level-specific configurations, including:
  - Abstract properties for level ID, Weave project name, and messages
  - Default implementations for tools and function handlers
  - Helper methods for TTS and LLM services
  - Utility method for generating challenge completion payloads

- **Level-Specific Configurations**: Each level has its own configuration file (e.g., `level0.py`, `level1.py`) that implements the `BaseLevelConfig` class with level-specific settings:
  - System prompts
  - Tools
  - Function handlers
  - Weave project name
  - Text-to-speech settings
  - Language model selection

- **Level Factory**: A factory function `get_level_config` that returns the appropriate level configuration based on the level ID.

#### Integration with Bot

The bot-openai.py file has been updated to:
- Get the level ID from the client
- Use the appropriate level configuration
- Initialize Weave with the level-specific project name
- Use level-specific messages, tools, and function handlers

#### Project Structure

```
server/
├── levels/
│   ├── __init__.py
│   ├── base.py
│   ├── level0.py
│   ├── level1.py
│   └── README.md
├── bot-openai.py
└── Dockerfile
```

This modular approach allows for easy addition of new levels and customization of existing levels, with each level having its own unique configuration while sharing common infrastructure.


## PipeCat Cloud Integration

The application now integrates with PipeCat Cloud for voice capabilities:

- **RTVIProvider**: A custom provider component that initializes the PipeCat client and provides it to the application through React context.
- **API Connect Endpoint**: A Next.js API route that handles the connection to the PipeCat Cloud service, creating a Daily.co room for WebRTC communication.
- **CallContext Integration**: The CallContext has been updated to use the PipeCat client for starting and ending calls, and now includes event listeners for challenge completion events from the server.
- **Audio Component**: The LevelScreen component now includes the RTVIClientAudio component to handle audio playback from the PipeCat agent.

The integration allows users to:
1. Click the "Call Agent" button to initiate a call to the PipeCat Cloud agent
2. Speak with the agent using their microphone
3. Hear the agent's responses through their speakers
4. End the call by clicking the "Hang Up" button
5. Receive real-time challenge completion events when specific success criteria are met

### Server-Side Event Emission

When a user successfully completes a challenge (for example, getting the bot to call a restricted function like `authorize_bank_transfer`), the server sends a custom message to the client using the RTVI framework's custom messaging capability. This pattern can be applied to any challenge-specific success criteria.

### Challenge Completion UI

The application maintains the active call while showing the success state, allowing users to continue their conversation with the bot after completing a challenge. The UI provides options to either continue the conversation or end the call and proceed to the next level.

When a user successfully completes a challenge, the server includes a Weave trace URL in the challenge completion payload. This URL links directly to the Weave dashboard for the specific conversation, allowing users to view their interaction trace. The Success screen displays this link, enhancing the connection between the challenge and Weave's tracing capabilities.

# Todos and log
- [x] Sketch out very basic UI structure and navigational flows. Also sketch out state management.
- [x] Run previous conversation system, check everything
- [x] Get proper turn based audio tracing.
- [x] Get entire conversation audio recording.
- [x] Make a JavaScript UI that can successfully make calls.
- [x] Create the complete UI flow, including the success screens, level change state, and navigation.
- [x] Integrate with PipeCat for real voice capabilities
- [x] Get the Pipecat deployment to signal the UI when the user succeeds in getting it to run authorize_bank_transfer
- [x] Get the UI to respond and show a success state when Pipecat makes the success tool call
- [x] Add a live link to the Weave project on user success. Test link
- [x] Figure out how to have independent Weave projects for each level. Set it up.
- [x] Figure out how to have multiple levels, with independently structured voice bots and independent Weave dashboards. Implement.
- [x] Decide how I should structure the challenges. Should they be the same task with multiple levels of difficulty, or should they be distinct tasks?
- [x] Deploy the UI & purchase + set up a custom domain
- [x] Fully outline the levels and their challenges
- [x] Implement level 0 (easiest level - just ask nicely)
- [x] Implement level 1 (password extraction)
- [ ] Implement level 2
- [ ] Implement level 3
- [ ] Implement level 4
- [ ] Make it aesthetic. Smooth UI, good visuals, better state indicators, better error handling.
- [ ] Share internally for feedback.
- [ ] Share externally to a few prompt injection people for feedback
- [ ] Improve tracing labels


## Log
- Looking at this example project from Daily re: PipeCat and NextJS: https://github.com/daily-co/pipecat-cloud-simple-chatbot
	- I'll need to push a new PipeCat Cloud image, but that's fine.
	- I wonder if I can just ask Cline to integrate the server and client? Can it look up documentation and go to links?
- Damn. The server is sending a success response, but somehow the client is not picking it up. Why?
- Fixed an issue where the challenge completion event was causing an infinite loop in the UI. Implemented a reference tracking mechanism to ensure the event is only processed once.
- Updated the LevelScreen component to maintain the active call when showing the success state, allowing users to continue their conversation with the bot after completing a challenge.
- Okay, I've decided that the different levels are actually going to be different aspects of difficulty for the same task. Everyone is going to try to authorize a bank transfer, but the bank transfer authorization will get increasingly difficult as the user progresses. 
- However, I don't know how to structure the backend for this. Every challenge is going to have a distinct prompt, and they will also have probably distinct tools and sub-functions. Additionally, they need to be tracked to distinct Weave teams and projects.
- This means the team name/entity name in the Weave.init call at the start of the program will need to change. 
- Perhaps the bots.py file can stay the same. But I have a different agent file for each level?
- Or maybe each agent file has its own language model, prompts definition, and tools definition, and then those get plugged into the same PipeCat agent and handler?
- I should identify exactly the logic that does not change between levels. Keep that in the bot.py file and then break other parts into numbered agent files. E.g. agent_1.py, agent_2.py
- Implemented a modular level configuration system with a base class and level-specific implementations. This allows each level to have its own Weave project, system prompts, tools, and function handlers.
- Fixed client-side issues with level switching and challenge completion state management.
- Updated the Dockerfile to include the levels directory for deployment.
- Fixed provider order in AppContextProvider.tsx to ensure proper context access.
- Added proper level progression in the UI with the "Next Level" button now correctly advancing to the next level.
