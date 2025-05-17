"""Level configuration package.

This package contains the configuration for different levels of the prompt injection challenge.
Each level has its own module with specific configurations for:
- Weave project name
- System prompts
- Tools
- Text-to-speech settings
- Language model selection
- Function handlers

The get_level_config function is used to get the configuration for a specific level.
"""

from typing import Dict, Any, Optional, Callable

# Import level-specific configurations
from .level0 import Level0Config
from .level1 import Level1Config

# Map of level ID to level configuration class
LEVEL_CONFIGS = {
    0: Level0Config,
    1: Level1Config,
}

def get_level_config(level_id: int):
    """Get the configuration for a specific level.
    
    Args:
        level_id: The ID of the level to get the configuration for.
        
    Returns:
        The configuration for the specified level.
        
    Raises:
        ValueError: If the level ID is not valid.
    """
    if level_id not in LEVEL_CONFIGS:
        raise ValueError(f"Invalid level ID: {level_id}. Valid levels are {list(LEVEL_CONFIGS.keys())}")
    
    return LEVEL_CONFIGS[level_id]()
