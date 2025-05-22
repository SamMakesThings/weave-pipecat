'use client';

import { useState, useRef, useEffect } from 'react';
import { useLevelNavigation, LevelId } from '../contexts/LevelNavigationContext';
import { useLevelProgress } from '../contexts/LevelProgressContext';

export function Header() {
  const { currentLevelId, levels, setCurrentLevelId } = useLevelNavigation();
  const { isLevelCompleted, isLevelUnlocked } = useLevelProgress();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLevelSelect = (levelId: number) => {
    if (isLevelUnlocked(levelId as LevelId)) {
      setCurrentLevelId(levelId as LevelId);
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-[var(--background)] border-b border-gray-200 dark:border-gray-800 px-4 py-0 flex justify-between items-center">
      <div className="h-18">
        <img 
          src="/images/W&B_logo_primary_gold_black.svg" 
          alt="Weights & Biases" 
          className="h-full w-auto wb-logo-light"
        />
        <img 
          src="/images/W&B_logo_primary_gold_white.svg" 
          alt="Weights & Biases" 
          className="h-full w-auto wb-logo-dark"
        />
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          {/* Show hamburger icon on mobile, level text on larger screens */}
          <span className="hidden sm:inline">Level {currentLevelId}</span>
          <span className="sm:hidden">Lvl {currentLevelId}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
            {Object.values(levels).map((level) => {
              const isCompleted = isLevelCompleted(level.id);
              const isUnlocked = isLevelUnlocked(level.id);
              const isCurrent = currentLevelId === level.id;
              
              return (
                <button
                  key={level.id}
                  onClick={() => handleLevelSelect(level.id)}
                  disabled={!isUnlocked}
                  className={`
                    w-full text-left px-4 py-3 text-base
                    ${isCurrent ? 'bg-gray-100 dark:bg-gray-800' : ''}
                    ${isUnlocked ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'opacity-50 cursor-not-allowed'}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {isCurrent && !isCompleted && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--accent)]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    {!isUnlocked && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>Level {level.id}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
