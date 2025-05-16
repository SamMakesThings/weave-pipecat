import { ReactNode } from 'react';
import { LevelNavigationProvider } from './LevelNavigationContext';
import { LevelProgressProvider } from './LevelProgressContext';
import { CallProvider } from './CallContext';
import { RTVIProvider } from './RTVIProvider';

interface AppContextProviderProps {
  children: ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  return (
    <RTVIProvider>
      <LevelNavigationProvider>
        <LevelProgressProvider>
          <CallProvider>
            {children}
          </CallProvider>
        </LevelProgressProvider>
      </LevelNavigationProvider>
    </RTVIProvider>
  );
}
