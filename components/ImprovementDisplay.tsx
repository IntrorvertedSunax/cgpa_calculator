
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
    <div className="grid gap-4 md:grid-cols-5 max-w-3xl mx-auto">
      {/* Stats Panel */}
      <div className={`md:col-span-2 ${glassEffectClasses} rounded-2xl p-4 sm:p-5 flex flex-col justify-center gap-2 sm:gap-3`}>
          <div className="flex justify-between items-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Current Points</p>
              <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {currentSecuredPoints.toFixed(2)}
              </p>
          </div>
          <div className="flex justify-between items-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Improvement</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  +{improvedCoursePoints.toFixed(2)}
              </p>
          </div>
          <div className="pt-2 sm:pt-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
               <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">New Total</p>
               <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {updatedSecuredPoints.toFixed(2)}
              </p>
          </div>
      </div>

      {/* Main Result Display */}
      <div className="md:col-span-3">
           <div className={`h-full ${glassEffectClasses} rounded-2xl p-6 flex flex-col items-center justify-center text-center`}>
              <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-300 mb-1">Updated GPA</h3>
              <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full"></div>
                  <p className={`relative text-5xl sm:text-6xl font-black bg-gradient-to-br ${getGpaGradient(updatedGpa)} bg-clip-text text-transparent`}>
                      {updatedGpa.toFixed(3)}
                  </p>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                  Adding <span className="font-semibold text-neutral-800 dark:text-neutral-200">{improvedCreditsCount}</span> credits of improved grades.
              </p>
           </div>
      </div>
    </div>
  );
};

export default ImprovementDisplay;
