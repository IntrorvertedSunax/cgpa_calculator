
import React from 'react';

interface ImprovementDisplayProps {
  currentSecuredPoints: number;
  improvedCoursePoints: number;
  updatedSecuredPoints: number;
  updatedGpa: number;
  improvedCreditsCount: number;
  isSticky: boolean;
}

const ImprovementDisplay: React.FC<ImprovementDisplayProps> = ({
  currentSecuredPoints,
  improvedCoursePoints,
  updatedSecuredPoints,
  updatedGpa,
  improvedCreditsCount,
  isSticky
}) => {
  const getGpaGradient = (gpa: number) => {
    if (gpa >= 3.75) return 'from-green-500 to-green-400';
    if (gpa >= 3.25) return 'from-sky-500 to-sky-400';
    if (gpa >= 2.5) return 'from-amber-500 to-amber-400';
    if (gpa > 0) return 'from-orange-500 to-red-500';
    return 'from-neutral-500 to-neutral-400';
  };

  const glassEffectClasses = "bg-gradient-to-br from-white/50 to-white/20 dark:from-neutral-900/50 dark:to-neutral-900/30 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-xl shadow-black/10";

  if (isSticky) {
    return (
        <div className="max-w-3xl mx-auto px-4">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <h2 className="text-sm sm:text-base font-semibold text-neutral-700 dark:text-neutral-200">
                        Updated GPA
                    </h2>
                     <div className="flex gap-x-4 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        <span>New Points: <span className="font-semibold text-neutral-700 dark:text-neutral-200">{updatedSecuredPoints.toFixed(2)}</span></span>
                        <span className="text-green-600 dark:text-green-400">Imp: +{improvedCoursePoints.toFixed(2)}</span>
                    </div>
                </div>
                <p className={`text-4xl font-bold bg-gradient-to-br ${getGpaGradient(updatedGpa)} bg-clip-text text-transparent flex-shrink-0`}>
                    {updatedGpa.toFixed(3)}
                </p>
            </div>
        </div>
    );
  }

  return (
    <div className={`transition-all duration-300 ease-in-out ${glassEffectClasses} rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto text-center`}>
        <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-neutral-400">
            Updated GPA
        </h2>
        <p className={`text-5xl sm:text-7xl font-extrabold my-2 bg-gradient-to-br ${getGpaGradient(updatedGpa)} bg-clip-text text-transparent`}>
            {updatedGpa.toFixed(3)}
        </p>
        <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 mb-1">
            Adding <span className="font-semibold text-neutral-600 dark:text-neutral-300">{improvedCreditsCount}</span> credits of improved grades.
        </p>

        <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 grid grid-cols-3 gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            <div>
                <span className="block text-base sm:text-lg font-semibold text-neutral-700 dark:text-neutral-200">{currentSecuredPoints.toFixed(2)}</span>
                Current Points
            </div>
            <div>
                <span className="block text-base sm:text-lg font-semibold text-green-600 dark:text-green-400">+{improvedCoursePoints.toFixed(2)}</span>
                Improvement
            </div>
             <div>
                <span className="block text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400">{updatedSecuredPoints.toFixed(2)}</span>
                New Total
            </div>
        </div>
    </div>
  );
};

export default ImprovementDisplay;
