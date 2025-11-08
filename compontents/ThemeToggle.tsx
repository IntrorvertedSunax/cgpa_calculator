import React from 'react';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-950 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative h-6 w-6 overflow-hidden">
        <SunIcon
          className={`absolute h-6 w-6 transition-all duration-300 ease-in-out ${
            theme === 'dark'
              ? 'opacity-100 transform rotate-0 scale-100'
              : 'opacity-0 transform -rotate-90 scale-50'
          }`}
        />
        <MoonIcon
          className={`absolute h-6 w-6 transition-all duration-300 ease-in-out ${
            theme === 'light'
              ? 'opacity-100 transform rotate-0 scale-100'
              : 'opacity-0 transform rotate-90 scale-50'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
