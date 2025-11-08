
import React from 'react';
import LightBulbIcon from './icons/LightBulbIcon';

interface AiAnalysisProps {
  analysis: string;
  isLoading: boolean;
  error: string | null;
}

const AiAnalysis: React.FC<AiAnalysisProps> = ({ analysis, isLoading, error }) => {
  const glassEffectClasses = "bg-gradient-to-br from-white/50 to-white/20 dark:from-neutral-900/50 dark:to-neutral-900/30 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-xl shadow-black/10";
  
  if (isLoading) {
    return (
      <div className="mt-8 max-w-3xl mx-auto">
        <div className={`${glassEffectClasses} rounded-2xl p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 flex-shrink-0 bg-primary-100 dark:bg-primary-900/60 rounded-full flex items-center justify-center">
                <LightBulbIcon />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">AI Powered Analysis</h3>
          </div>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-neutral-900/10 dark:bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-neutral-900/10 dark:bg-white/10 rounded w-5/6"></div>
            <div className="h-4 bg-neutral-900/10 dark:bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-neutral-900/10 dark:bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="bg-red-500/10 backdrop-blur-2xl border border-red-500/20 shadow-lg rounded-2xl p-6">
           <h3 className="text-lg font-bold text-red-800 dark:text-red-200">An Error Occurred</h3>
           <p className="text-red-700 dark:text-red-300 mt-2 text-sm whitespace-pre-wrap">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="mt-8 max-w-3xl mx-auto transition-opacity duration-500 opacity-100">
      <div className={`${glassEffectClasses} rounded-2xl p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 flex-shrink-0 bg-primary-100 dark:bg-primary-900/60 rounded-full flex items-center justify-center">
              <LightBulbIcon />
          </div>
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">AI Powered Analysis</h3>
        </div>
        <div className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
          {analysis}
        </div>
      </div>
    </div>
  );
};

export default AiAnalysis;
