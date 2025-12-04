import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import SgpaCalculator from './components/SgpaCalculator';
import CgpaCalculator from './components/CgpaCalculator';
import ImprovementCalculator from './components/ImprovementCalculator';
import ConfirmationModal from './components/ConfirmationModal';
import ElectricIcon from './components/icons/ElectricIcon';
import TrendingUpIcon from './components/icons/TrendingUpIcon';
import TrashIcon from './components/icons/TrashIcon';

type View = 'sgpa' | 'cgpa' | 'improvement';

interface SgpaState {
  selectedSemesterKey: string;
  grades: Record<string, string>;
}

interface CgpaState {
  gpas: Record<string, string>;
}

export interface ImprovementState {
  selectedSemesterKey: string;
  semesterData: Record<string, {
    currentGpa: string;
    selectedCourses: Record<string, string>;
  }>;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('sgpa');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && userPrefersDark)) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const [sgpaState, setSgpaState] = useState<SgpaState>(() => {
    try {
      const saved = localStorage.getItem('sgpaState');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error reading sgpaState from localStorage', error);
    }
    return { selectedSemesterKey: '', grades: {} };
  });

  const [cgpaState, setCgpaState] = useState<CgpaState>(() => {
    try {
      const saved = localStorage.getItem('cgpaState');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error reading cgpaState from localStorage', error);
    }
    return { gpas: {} };
  });

  const [improvementState, setImprovementState] = useState<ImprovementState>(() => {
    try {
      const saved = localStorage.getItem('improvementState');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error reading improvementState from localStorage', error);
    }
    return { selectedSemesterKey: '', semesterData: {} };
  });

  useEffect(() => {
    try {
      localStorage.setItem('sgpaState', JSON.stringify(sgpaState));
    } catch (error) {
      console.error('Error saving sgpaState to localStorage', error);
    }
  }, [sgpaState]);

  useEffect(() => {
    try {
      localStorage.setItem('cgpaState', JSON.stringify(cgpaState));
    } catch (error) {
      console.error('Error saving cgpaState to localStorage', error);
    }
  }, [cgpaState]);

  useEffect(() => {
    try {
      localStorage.setItem('improvementState', JSON.stringify(improvementState));
    } catch (error) {
      console.error('Error saving improvementState to localStorage', error);
    }
  }, [improvementState]);

  const sgpaButtonRef = useRef<HTMLButtonElement>(null);
  const cgpaButtonRef = useRef<HTMLButtonElement>(null);
  const improvementButtonRef = useRef<HTMLButtonElement>(null);
  const [gliderStyle, setGliderStyle] = useState({});

  useEffect(() => {
    const updateGlider = () => {
        let targetButton: HTMLButtonElement | null = null;
        
        if (activeView === 'sgpa') targetButton = sgpaButtonRef.current;
        else if (activeView === 'cgpa') targetButton = cgpaButtonRef.current;
        else if (activeView === 'improvement') targetButton = improvementButtonRef.current;

        if (targetButton) {
        setGliderStyle({
            width: `${targetButton.offsetWidth}px`,
            transform: `translateX(${targetButton.offsetLeft}px)`,
        });
        }
    };

    // Initial update
    updateGlider();

    // Update on resize to handle orientation changes on mobile
    window.addEventListener('resize', updateGlider);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateGlider);
  }, [activeView]);

  const handleClearAllData = () => {
    setSgpaState({ selectedSemesterKey: '', grades: {} });
    setCgpaState({ gpas: {} });
    setImprovementState({ selectedSemesterKey: '', semesterData: {} });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen text-neutral-800 dark:text-neutral-200 relative isolate">
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-neutral-50 dark:bg-neutral-950">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] sm:h-[700px] sm:w-[700px] animate-[blob-spin_30s_linear_infinite] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl opacity-50 dark:opacity-30"></div>
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] sm:h-[700px] sm:w-[700px] animate-[blob-spin-reverse_35s_linear_infinite] rounded-full bg-gradient-to-tl from-indigo-500/20 to-sky-500/20 blur-3xl opacity-50 dark:opacity-30"></div>
      </div>

      <Header theme={theme} onToggleTheme={handleThemeToggle} />
      <main className="container mx-auto px-4 py-4 sm:py-10">
        
        {/* Department Title - Moved here and styled for better visibility and mobile alignment */}
        <div className="text-center mb-8 px-4">
            <h3 className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                <ElectricIcon className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                <span className="leading-snug">Department of Electrical and Electronic Engineering, GSTU</span>
            </h3>
        </div>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative grid grid-cols-3 sm:flex p-1 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-inner border border-white/30 dark:border-black/30 w-full sm:w-auto" role="tablist">
            <span 
                className="absolute top-1 bottom-1 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] bg-gradient-to-br from-white/80 to-white/60 dark:from-neutral-800/90 dark:to-neutral-800/70 backdrop-blur-sm rounded-lg shadow-md border border-white dark:border-white/10"
                style={gliderStyle}
                aria-hidden="true"
            ></span>

            <button 
                ref={sgpaButtonRef}
                onClick={() => setActiveView('sgpa')}
                className={`relative z-10 flex items-center justify-center px-1 sm:px-5 py-2.5 sm:py-2 text-xs sm:text-base font-semibold whitespace-nowrap rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/75 transition-colors duration-300 ${activeView === 'sgpa' ? 'text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
                role="tab"
                aria-selected={activeView === 'sgpa'}
                aria-controls="sgpa-panel"
            >
                GPA Calculator
            </button>
            <button 
                ref={cgpaButtonRef}
                onClick={() => setActiveView('cgpa')}
                className={`relative z-10 flex items-center justify-center px-1 sm:px-5 py-2.5 sm:py-2 text-xs sm:text-base font-semibold whitespace-nowrap rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/75 transition-colors duration-300 ${activeView === 'cgpa' ? 'text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
                role="tab"
                aria-selected={activeView === 'cgpa'}
                aria-controls="cgpa-panel"
            >
                CGPA Calculator
            </button>
            <button 
                ref={improvementButtonRef}
                onClick={() => setActiveView('improvement')}
                className={`relative z-10 flex items-center justify-center px-1 sm:px-5 py-2.5 sm:py-2 text-xs sm:text-base font-semibold whitespace-nowrap rounded-lg gap-1 sm:gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/75 transition-colors duration-300 ${activeView === 'improvement' ? 'text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
                role="tab"
                aria-selected={activeView === 'improvement'}
                aria-controls="improvement-panel"
            >
                <TrendingUpIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Improvement
            </button>
          </div>
        </div>
        
        <div role="tabpanel" id="sgpa-panel" hidden={activeView !== 'sgpa'}>
          {activeView === 'sgpa' && <SgpaCalculator sgpaState={sgpaState} setSgpaState={setSgpaState} />}
        </div>
        <div role="tabpanel" id="cgpa-panel" hidden={activeView !== 'cgpa'}>
          {activeView === 'cgpa' && <CgpaCalculator cgpaState={cgpaState} setCgpaState={setCgpaState} />}
        </div>
        <div role="tabpanel" id="improvement-panel" hidden={activeView !== 'improvement'}>
          {activeView === 'improvement' && <ImprovementCalculator improvementState={improvementState} setImprovementState={setImprovementState} />}
        </div>

        <div className="flex justify-center mt-12 mb-4">
            <button
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center justify-center gap-2 px-8 py-3 bg-white/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-200 dark:border-red-800/50 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
                <TrashIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Clear All Data
            </button>
        </div>
      </main>
      <footer className="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm">
        <p>Developed with passion by Introverted Sunax</p>
      </footer>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleClearAllData}
        title="Confirm Data Deletion"
      >
        Are you sure you want to clear all your saved SGPA and CGPA data? This action cannot be undone.
      </ConfirmationModal>
    </div>
  );
};

export default App;