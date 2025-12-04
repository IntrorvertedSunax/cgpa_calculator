
import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="bg-transparent py-5 sm:py-8 transition-all duration-300">
      <div className="container mx-auto px-4 relative flex items-center justify-center min-h-[3rem]">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-center px-14 sm:px-0 w-full sm:w-auto">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent break-words leading-tight">
            CGPA Calculator
          </span>
        </h1>
        <div className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
};

export default Header;