import { ReactNode } from 'react';
import { LevelNavigationProvider } from './LevelNavigationContext';
import { LevelProgressProvider } from './LevelProgressContext';
import { CallProvider } from './CallContext';

interface AppContextProviderProps {
  children: ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  return (
    <LevelNavigationProvider>
      <LevelProgressProvider>
        <CallProvider>
          {children}
        </CallProvider>
      </LevelProgressProvider>
    </LevelNavigationProvider>
  );
}
