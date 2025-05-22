'use client';

import { WelcomeScreen } from '../components/WelcomeScreen';
import { LevelScreen } from '../components/LevelScreen';
import { SuccessScreen } from '../components/SuccessScreen';
import { Header } from '../components/Header';
import { useLevelNavigation } from '../contexts/LevelNavigationContext';

export default function Home() {
  const { currentScreen } = useLevelNavigation();

  return (
    <div className="min-h-screen">
      {currentScreen !== 'welcome' && <Header />}
      
      {currentScreen === 'welcome' && <WelcomeScreen />}
      
      {currentScreen === 'level' && <LevelScreen />}
      
      {currentScreen === 'success' && <SuccessScreen />}
    </div>
  );
}
