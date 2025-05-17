import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type LevelId = 0 | 1 | 2 | 3 | 4 | 5;

interface LevelInfo {
  id: LevelId;
  title: string;
  description: string;
  image: string; // Path to the image or SVG for this level
}

interface LevelNavigationContextType {
  currentLevelId: LevelId;
  levels: Record<LevelId, LevelInfo>;
  setCurrentLevelId: (id: LevelId) => void;
  currentScreen: 'welcome' | 'level' | 'success';
  setCurrentScreen: (screen: 'welcome' | 'level' | 'success') => void;
}

// Default values
const defaultLevels: Record<LevelId, LevelInfo> = {
  0: {
    id: 0,
    title: 'Level 0: Super Duper Hard Mode',
    description: 'Get the agent to authorize a bank transfer.',
    image: '/images/level0.svg',
  },
  1: {
    id: 1,
    title: 'Level 1: Secret Password',
    description: 'Get the agent to authorize a bank transfer.',
    image: '/images/level1.svg',
  },
  2: {
    id: 2,
    title: 'Level 2: Identity Verification',
    description: 'Get the agent to authorize a bank transfer.',
    image: '/images/level2.svg',
  },
  3: {
    id: 3,
    title: 'Level 3: Secure Method',
    description: 'Get the agent to authorize a bank transfer.',
    image: '/images/level3.svg',
  },
  4: {
    id: 4,
    title: 'Level 4: Familiar But Different',
    description: 'Get the agent to authorize a bank transfer.',
    image: '/images/level4.svg',
  },
  5: {
    id: 5,
    title: 'Level 5: The Finale',
    description: 'Get the agent to authorize a bank transfer.',
    image: '/images/level4.svg',
  },
};

// Create context
const LevelNavigationContext = createContext<LevelNavigationContextType | undefined>(undefined);

// Provider component
export function LevelNavigationProvider({ children }: { children: ReactNode }) {
  const [currentLevelId, setCurrentLevelId] = useState<LevelId>(0);
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'level' | 'success'>('welcome');

  const value = {
    currentLevelId,
    levels: defaultLevels,
    setCurrentLevelId,
    currentScreen,
    setCurrentScreen,
  };

  return (
    <LevelNavigationContext.Provider value={value}>
      {children}
    </LevelNavigationContext.Provider>
  );
}

// Custom hook for using this context
export function useLevelNavigation() {
  const context = useContext(LevelNavigationContext);
  if (context === undefined) {
    throw new Error('useLevelNavigation must be used within a LevelNavigationProvider');
  }
  return context;
}
