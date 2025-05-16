'use client';

import { useLevelNavigation } from '../contexts/LevelNavigationContext';
import { useLevelProgress } from '../contexts/LevelProgressContext';

export function LevelSelector() {
  const { currentLevelId, levels, setCurrentLevelId } = useLevelNavigation();
  const { isLevelCompleted, isLevelUnlocked } = useLevelProgress();

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-2 mb-8">
      {Object.values(levels).map((level) => {
        const isCompleted = isLevelCompleted(level.id);
        const isUnlocked = isLevelUnlocked(level.id);
        const isCurrent = currentLevelId === level.id;
        
        return (
          <button
            key={level.id}
            onClick={() => isUnlocked && setCurrentLevelId(level.id)}
            disabled={!isUnlocked}
            className={`
              px-4 py-2 rounded-full font-medium transition-colors
              ${isCurrent ? 'ring-2 ring-[var(--accent)]' : ''}
              ${isCompleted 
                ? 'bg-green-500 text-white' 
                : isUnlocked 
                  ? 'bg-[var(--accent)] text-black hover:opacity-90' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Level {level.id}
          </button>
        );
      })}
    </div>
  );
}
