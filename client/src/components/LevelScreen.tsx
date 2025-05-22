'use client';

import { useState, useEffect, useRef } from 'react';
import { useLevelNavigation, LevelId } from '../contexts/LevelNavigationContext';
import { useLevelProgress } from '../contexts/LevelProgressContext';
import { useCall } from '../contexts/CallContext';
import { RTVIClientAudio } from '@pipecat-ai/client-react';

export function LevelScreen() {
  const { currentLevelId, levels, setCurrentScreen, setCurrentLevelId } = useLevelNavigation();
  const { isLevelUnlocked, completeLevel } = useLevelProgress();
  const { status, isCallActive, startCall, endCall, challengeCompleted, challengeData, resetChallengeState } = useCall();
  const [showSuccess, setShowSuccess] = useState(false);

  const currentLevel = levels[currentLevelId];
  const isUnlocked = isLevelUnlocked(currentLevelId);

  // Use a ref to track if we've already processed this challenge completion
  const hasProcessedChallenge = useRef(false);

  const getCallButtonText = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting...';
      case 'waiting_for_agent':
        return 'Waiting for agent...';
      default:
        return 'Call Agent';
    }
  };

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
    resetChallengeState();
    
    if (isCallActive) {
      await handleHangUp();
    }
    
    if (currentLevelId < 4) {
      // Move to the next level
      const nextLevelId = (currentLevelId + 1) as LevelId;
      setCurrentLevelId(nextLevelId);
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
          <h1 className="mb-6 text-green-500">
            Challenge Completed!
          </h1>
          
          <p className="mb-8">
            Congratulations! You successfully completed Level {currentLevelId}.
          </p>
          
          <p className="mb-8">
            Check out a transcript/recording of your conversation in the Weave dashboard! (or those of other winners)
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={handleNextLevel}
              className="button-primary"
            >
              {currentLevelId < 4 ? 'Next Level' : 'Finish Challenge'}
            </button>
            
            {challengeData?.weaveTraceUrl && (
              <a 
                href={challengeData.weaveTraceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary"
              >
                View Conversation in Weave
              </a>
            )}
            
            {isCallActive && (
              <button
                onClick={handleHangUp}
                className="button-secondary"
                style={{ background: 'rgba(239, 68, 68, 0.9)', color: 'white' }}
              >
                Hang Up
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
        <h1 className="mb-4 text-center">
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
              <p className="mb-4">
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
                className="button-secondary"
                style={{ background: 'rgba(239, 68, 68, 0.9)', color: 'white' }}
              >
                Hang Up
              </button>
            </div>
          ) : (
            <button
              onClick={startCall}
              disabled={!isUnlocked || status === 'connecting' || status === 'waiting_for_agent'}
              className={!isUnlocked ? 'button-secondary' : 'button-primary'}
              style={!isUnlocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {getCallButtonText()}
            </button>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentScreen('welcome')}
            className="button-secondary"
            style={{ background: 'transparent', border: 'none', color: 'var(--foreground)' }}
          >
            Back to Welcome
          </button>
        </div>
        </div>
      )}
    </div>
  );
}
