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
              button-secondary
              ${isCurrent ? 'ring-2 ring-[var(--accent)]' : ''}
            `}
            style={
              isCompleted 
                ? { background: 'rgba(34, 197, 94, 0.9)', color: 'white' } 
                : isUnlocked 
                  ? { background: 'linear-gradient(270deg, #fc3 0, #ffad33 100%)', color: 'black' } 
                  : { background: 'rgba(209, 213, 219, 0.9)', color: 'rgba(107, 114, 128, 0.9)', cursor: 'not-allowed', opacity: 0.7 }
            }
          >
            Level {level.id}
          </button>
        );
      })}
    </div>
  );
}
