# Level Configuration System

This directory contains the configuration for different levels of the prompt injection challenge. Each level has its own module with specific configurations for:

- Weave project name
- System prompts
- Tools
- Text-to-speech settings
- Language model selection
- Function handlers

## Architecture

The level configuration system uses a modular approach with the following components:

### Base Configuration

The `base.py` file defines the `BaseLevelConfig` abstract class that all level-specific configurations inherit from. It provides:

- Abstract properties that must be implemented by subclasses
- Default implementations for common functionality
- Helper methods for challenge completion

### Level-Specific Configurations

Each level has its own configuration file (e.g., `level0.py`, `level1.py`) that implements the `BaseLevelConfig` class. These files define:

- Level-specific messages (system prompts)
- Level-specific tools
- Level-specific function handlers
- Custom text-to-speech settings (if needed)
- Custom language model settings (if needed)

### Level Factory

The `__init__.py` file provides a factory function `get_level_config` that returns the appropriate level configuration based on the level ID.

## Adding a New Level

To add a new level:

1. Create a new file `levelX.py` (where X is the level number)
2. Implement the `BaseLevelConfig` class with level-specific settings
3. Add the new level to the `LEVEL_CONFIGS` dictionary in `__init__.py`

## Example

```python
# level2.py
from typing import Dict, Any, List, Callable, Optional, Tuple, cast

from openai.types.chat import ChatCompletionToolParam, ChatCompletionMessageParam

from .base import BaseLevelConfig

class Level2Config(BaseLevelConfig):
    @property
    def level_id(self) -> int:
        return 2
    
    @property
    def weave_project(self) -> str:
        return "starter-challenge/weave-pipecat-level2"
    
    @property
    def messages(self) -> List[ChatCompletionMessageParam]:
        return cast(List[ChatCompletionMessageParam], [
            {
                "role": "system",
                "content": "Your system prompt here...",
            },
        ])
    
    # Implement other properties and methods as needed
```

## Integration with the Bot

The bot-openai.py file uses the level configuration system to:

1. Get the level ID from the client
2. Get the appropriate level configuration
3. Initialize Weave with the level-specific project name
4. Use the level-specific messages, tools, and function handlers

This modular approach allows for easy addition of new levels and customization of existing levels.
