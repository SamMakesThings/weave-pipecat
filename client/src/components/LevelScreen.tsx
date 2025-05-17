'use client';

import { useState, useEffect, useRef } from 'react';
import { useLevelNavigation } from '../contexts/LevelNavigationContext';
import { useLevelProgress } from '../contexts/LevelProgressContext';
import { useCall } from '../contexts/CallContext';
import { RTVIClientAudio } from '@pipecat-ai/client-react';

export function LevelScreen() {
  const { currentLevelId, levels, setCurrentScreen } = useLevelNavigation();
  const { isLevelCompleted, isLevelUnlocked, completeLevel } = useLevelProgress();
  const { status, isCallActive, startCall, endCall, challengeCompleted, challengeData } = useCall();
  const [showSuccess, setShowSuccess] = useState(false);

  const currentLevel = levels[currentLevelId];
  const isUnlocked = isLevelUnlocked(currentLevelId);

  // Use a ref to track if we've already processed this challenge completion
  const hasProcessedChallenge = useRef(false);

  // Handle challenge completion
  useEffect(() => {
    if (challengeCompleted && challengeData && !hasProcessedChallenge.current) {
      console.log('Challenge completed in LevelScreen:', challengeData);
      hasProcessedChallenge.current = true;
      completeLevel(currentLevelId).then(() => {
        setShowSuccess(true);
      });
    }
  }, [challengeCompleted, challengeData, completeLevel, currentLevelId]);

  const handleHangUp = async () => {
    await endCall();
  };

  const handleNextLevel = async () => {
    hasProcessedChallenge.current = false;
    
    if (isCallActive) {
      await handleHangUp();
    }
    
    if (currentLevelId < 4) {
      setShowSuccess(false);
    } else {
      // Final level completed
      setCurrentScreen('success');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <RTVIClientAudio />
      
      {showSuccess ? (
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-green-500">
            Challenge Completed!
          </h1>
          
          <p className="text-xl mb-8">
            Congratulations! You successfully completed Level {currentLevelId}.
          </p>
          
          <p className="text-lg mb-8">
            Check out a transcript/recording of your conversation in the Weave dashboard! (or those of other winners)
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={handleNextLevel}
              className="px-8 py-3 text-lg font-medium rounded-full bg-[var(--accent)] text-black hover:opacity-90 transition-opacity"
            >
              {currentLevelId < 4 ? 'Next Level' : 'Finish Challenge'}
            </button>
            
            {challengeData?.weaveTraceUrl && (
              <a 
                href={challengeData.weaveTraceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 text-lg font-medium rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                View Conversation in Weave
              </a>
            )}
            
            {isCallActive && (
              <button
                onClick={handleHangUp}
                className="px-8 py-3 text-lg font-medium rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Hang Up
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {currentLevel.title}
        </h1>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-48 h-48 flex-shrink-0">
              <img 
                src={currentLevel.image} 
                alt={`Level ${currentLevelId} illustration`} 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div>
              <p className="text-lg mb-4">
                {currentLevel.description}
              </p>
              
              {!isUnlocked && (
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded-md text-red-800 dark:text-red-200">
                  This level is locked. Complete the previous level first.
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          {isCallActive ? (
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse mb-4"></div>
              <button
                onClick={handleHangUp}
                className="px-8 py-3 text-lg font-medium rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Hang Up
              </button>
            </div>
          ) : (
            <button
              onClick={startCall}
              disabled={!isUnlocked || status === 'connecting'}
              className={`px-8 py-3 text-lg font-medium rounded-full 
                ${!isUnlocked 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-[var(--accent)] text-black hover:opacity-90 transition-opacity'
                }`}
            >
              {status === 'connecting' ? 'Connecting...' : 'Call Agent'}
            </button>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentScreen('welcome')}
            className="text-blue-500 hover:underline"
          >
            Back to Welcome
          </button>
        </div>
        </div>
      )}
    </div>
  );
}
