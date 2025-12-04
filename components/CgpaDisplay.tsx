
import React from 'react';

interface CgpaDisplayProps {
  cgpa: number;
  totalCredits: number;
  totalPoints: number;
  semestersCount: number;
  isSticky: boolean;
}

const CgpaDisplay: React.FC<CgpaDisplayProps> = ({ cgpa, totalCredits, totalPoints, semestersCount, isSticky }) => {
    const getCgpaGradient = () => {
        if (cgpa >= 3.75) return 'from-green-500 to-green-400';
        if (cgpa >= 3.25) return 'from-sky-500 to-sky-400';
        if (cgpa >= 2.5) return 'from-amber-500 to-amber-400';
        if (cgpa > 0) return 'from-orange-500 to-red-500';
        return 'from-neutral-500 to-neutral-400';
    };

    const glassEffectClasses = "bg-gradient-to-br from-white/50 to-white/20 dark:from-neutral-900/50 dark:to-neutral-900/30 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-xl shadow-black/10";
    
    if (isSticky) {
        return (
            <div className="max-w-3xl mx-auto px-4">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <h2 className="text-sm sm:text-base font-semibold text-neutral-700 dark:text-neutral-200">
                            Cumulative Grade Point Average (CGPA)
                        </h2>
                        <div className="flex gap-x-4 sm:gap-x-6 text-xs sm:text-sm text-center text-neutral-500 dark:text-neutral-400 mt-1.5">
                            <div>
                                <span className="block font-semibold text-neutral-700 dark:text-neutral-200">{semestersCount}</span>
                                Semesters
                            </div>
                            <div>
                                <span className="block font-semibold text-green-600 dark:text-green-400">{totalCredits.toFixed(2)}</span>
                                Credits
                            </div>
                            <div>
                                <span className="block font-semibold text-indigo-600 dark:text-indigo-400">{totalPoints.toFixed(2)}</span>
                                Points
                            </div>
                        </div>
                    </div>
                    <p className={`text-4xl font-bold bg-gradient-to-br ${getCgpaGradient()} bg-clip-text text-transparent flex-shrink-0`}>
                        {cgpa.toFixed(3)}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`transition-all duration-300 ease-in-out ${glassEffectClasses} rounded-2xl p-6 max-w-2xl mx-auto text-center`}>
            <h2 className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
                Cumulative Grade Point Average (CGPA)
            </h2>
            <p className={`text-6xl sm:text-7xl font-extrabold my-2 bg-gradient-to-br ${getCgpaGradient()} bg-clip-text text-transparent`}>
                {cgpa.toFixed(3)}
            </p>
            
            <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 grid grid-cols-3 gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                <div>
                    <span className="block text-base sm:text-lg font-semibold text-neutral-700 dark:text-neutral-200">{semestersCount}</span>
                    Semesters
                </div>
                <div>
                    <span className="block text-base sm:text-lg font-semibold text-green-600 dark:text-green-400">{totalCredits.toFixed(2)}</span>
                    Total Credits
                </div>
                 <div>
                    <span className="block text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400">{totalPoints.toFixed(2)}</span>
                    Total Points
                </div>
            </div>
        </div>
    );
};

export default CgpaDisplay;
