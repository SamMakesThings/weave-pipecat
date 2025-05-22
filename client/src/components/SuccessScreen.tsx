'use client';

import { useLevelNavigation } from '../contexts/LevelNavigationContext';
import { useLevelProgress } from '../contexts/LevelProgressContext';

export function SuccessScreen() {
  const { setCurrentScreen } = useLevelNavigation();
  const { resetProgress } = useLevelProgress();

  const handleReset = () => {
    resetProgress();
    setCurrentScreen('welcome');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="mb-6 text-green-500">
          Congratulations!
        </h1>
        
        <p className="mb-8">
          You have successfully completed all levels of the Voice Agent Prompt Injection Challenge!
        </p>
        
        <p className="mb-8">
          Your skills in prompt injection and social engineering are impressive. You were able to extract passwords, negotiate discounts, and even authorize bank transfers through voice interactions.
        </p>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="mb-4">Want to learn more?</h2>
          <p className="mb-4">
            Check out more about AI safety and prompt injection techniques.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#"
              className="button-primary"
            >
              View Your Results
            </a>
            <a
              href="#"
              className="button-secondary"
            >
              View Leaderboard
            </a>
          </div>
        </div>
        
        <button
          onClick={handleReset}
          className="button-primary"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
