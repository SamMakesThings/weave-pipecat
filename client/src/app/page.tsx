'use client';

import { WelcomeScreen } from '../components/WelcomeScreen';
import { LevelScreen } from '../components/LevelScreen';
import { SuccessScreen } from '../components/SuccessScreen';
import { LevelSelector } from '../components/LevelSelector';
import { useLevelNavigation } from '../contexts/LevelNavigationContext';

export default function Home() {
  const { currentScreen } = useLevelNavigation();

  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && <WelcomeScreen />}
      
      {currentScreen === 'level' && (
        <>
          <LevelSelector />
          <LevelScreen />
        </>
      )}
      
      {currentScreen === 'success' && <SuccessScreen />}
    </div>
  );
}
