'use client';

import { useLevelNavigation } from '../contexts/LevelNavigationContext';

export function WelcomeScreen() {
  const { setCurrentScreen } = useLevelNavigation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="mb-6">
          Can you hack a system by talking to it?
        </h1>
        
        <p className="mb-8">
          Are you good at prompt injection? What about social engineering? Put your skills to the test with our Voice Agent Prompt Injection Challenge.
        </p>
        
        <p className="mb-8">
          We have five different voice agents for you to talk to. You&apos;ll need to extract passwords, authorize bank transfers, negotiate impossible sales, and more. Are you ready?
        </p>
        
        <button
          onClick={() => setCurrentScreen('level')}
          className="button-primary"
        >
          Start Challenge
        </button>
      </div>
    </div>
  );
}
