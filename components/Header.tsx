
import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="bg-transparent py-6">
      <div className="container mx-auto px-4 text-center relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            GPA &amp; CGPA Calculator
          </span>
        </h1>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 sm:right-6">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
};

export default Header;
