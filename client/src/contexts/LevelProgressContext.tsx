import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LevelId } from './LevelNavigationContext';

interface LevelProgressState {
  completedLevels: Set<LevelId>;
  unlockedLevels: Set<LevelId>;
}

interface LevelProgressContextType extends LevelProgressState {
  completeLevel: (levelId: LevelId) => Promise<boolean>;
  isLevelCompleted: (levelId: LevelId) => boolean;
  isLevelUnlocked: (levelId: LevelId) => boolean;
  resetProgress: () => void;
}

// Create context
const LevelProgressContext = createContext<LevelProgressContextType | undefined>(undefined);

// Provider component
export function LevelProgressProvider({ children }: { children: ReactNode }) {
  // Initialize with level 0 unlocked, no levels completed
  const [state, setState] = useState<LevelProgressState>({
    completedLevels: new Set<LevelId>(),
    unlockedLevels: new Set<LevelId>([0]),
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('levelProgress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        setState({
          completedLevels: new Set(parsed.completedLevels),
          unlockedLevels: new Set(parsed.unlockedLevels),
        });
      }
    } catch (error) {
      console.error('Failed to load progress from localStorage:', error);
    }
  }, []);

  // Save progress to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('levelProgress', JSON.stringify({
        completedLevels: Array.from(state.completedLevels),
        unlockedLevels: Array.from(state.unlockedLevels),
      }));
    } catch (error) {
      console.error('Failed to save progress to localStorage:', error);
    }
  }, [state]);

  // Mark a level as completed and unlock the next level
  // In a real app, this would validate with the server
  const completeLevel = async (levelId: LevelId): Promise<boolean> => {
    // Here you would make an API call to validate completion
    // For now, we'll simulate a successful completion
    const success = true;

    if (success) {
      setState(prevState => {
        const newCompletedLevels = new Set(prevState.completedLevels);
        newCompletedLevels.add(levelId);

        const newUnlockedLevels = new Set(prevState.unlockedLevels);
        // Unlock the next level if it exists
        if (levelId < 4) {
          newUnlockedLevels.add((levelId + 1) as LevelId);
        }

        return {
          completedLevels: newCompletedLevels,
          unlockedLevels: newUnlockedLevels,
        };
      });
    }

    return success;
  };

  // Check if a level is completed
  const isLevelCompleted = (levelId: LevelId): boolean => {
    return state.completedLevels.has(levelId);
  };

  // Check if a level is unlocked
  const isLevelUnlocked = (levelId: LevelId): boolean => {
    return state.unlockedLevels.has(levelId);
  };

  // Reset all progress
  const resetProgress = () => {
    setState({
      completedLevels: new Set<LevelId>(),
      unlockedLevels: new Set<LevelId>([0]),
    });
  };

  const value = {
    ...state,
    completeLevel,
    isLevelCompleted,
    isLevelUnlocked,
    resetProgress,
  };

  return (
    <LevelProgressContext.Provider value={value}>
      {children}
    </LevelProgressContext.Provider>
  );
}

// Custom hook for using this context
export function useLevelProgress() {
  const context = useContext(LevelProgressContext);
  if (context === undefined) {
    throw new Error('useLevelProgress must be used within a LevelProgressProvider');
  }
  return context;
}
