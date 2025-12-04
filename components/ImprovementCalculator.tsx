
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SEMESTER_COURSES, GRADE_POINTS, GRADE_OPTIONS } from '../constants';
import { Course } from '../types';
import ImprovementDisplay from './ImprovementDisplay';
import TrashIcon from './icons/TrashIcon';
import { ImprovementState } from '../App';

interface ImprovementCalculatorProps {
  improvementState: ImprovementState;
  setImprovementState: React.Dispatch<React.SetStateAction<ImprovementState>>;
}

const ImprovementCalculator: React.FC<ImprovementCalculatorProps> = ({ improvementState, setImprovementState }) => {
  const { selectedSemesterKey, semesterData } = improvementState;

  // Retrieve data specifically for the selected semester, or default to empty
  const currentSemesterData = useMemo(() => {
     return semesterData[selectedSemesterKey] || { currentGpa: '', selectedCourses: {} };
  }, [semesterData, selectedSemesterKey]);

  const { currentGpa, selectedCourses } = currentSemesterData;

  // Sticky header state
  const [isSticky, setIsSticky] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const displayElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const displayElement = displayElementRef.current;
    if (!displayElement) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            setIsSticky(!entry.isIntersecting && entry.boundingClientRect.y < 0);
        },
        { rootMargin: '-1px 0px 0px 0px', threshold: 1 }
    );
    
    observer.observe(displayElement);

    return () => {
        if (displayElement) observer.unobserve(displayElement);
    };
  }, []);

  const courses: Course[] = useMemo(
    () => (selectedSemesterKey ? SEMESTER_COURSES[selectedSemesterKey] : []),
    [selectedSemesterKey]
  );

  const availableCourses = useMemo(() => {
    return courses.filter(course => !selectedCourses[course.code]);
  }, [courses, selectedCourses]);

  const totalSemesterCredits = useMemo(() => {
    return courses.reduce((sum, course) => sum + course.credits, 0);
  }, [courses]);

  const calculationResult = useMemo(() => {
    const currentGpaNum = parseFloat(currentGpa);
    
    // 1. Calculate current secured point
    let currentSecuredPoints = 0;
    if (!isNaN(currentGpaNum) && totalSemesterCredits > 0) {
      currentSecuredPoints = currentGpaNum * totalSemesterCredits;
    }

    // 2. Calculate point of improved courses
    let improvedCoursePoints = 0;
    let improvedCreditsCount = 0;

    Object.entries(selectedCourses).forEach(([courseCode, grade]) => {
      const course = courses.find(c => c.code === courseCode);
      const gradePoint = GRADE_POINTS[grade];
      
      if (course && gradePoint !== undefined) {
        improvedCoursePoints += course.credits * gradePoint;
        improvedCreditsCount += course.credits;
      }
    });

    // 3. Update secured point
    const updatedSecuredPoints = currentSecuredPoints + improvedCoursePoints;

    // 4. Compute final updated CGPA
    const updatedGpa = totalSemesterCredits > 0 ? updatedSecuredPoints / totalSemesterCredits : 0;

    return {
      currentSecuredPoints,
      improvedCoursePoints,
      updatedSecuredPoints,
      updatedGpa,
      improvedCreditsCount
    };
  }, [currentGpa, totalSemesterCredits, selectedCourses, courses]);

  // Helper to safely update the current semester's data
  const updateCurrentSemesterData = (updates: Partial<{ currentGpa: string; selectedCourses: Record<string, string> }>) => {
    setImprovementState(prev => ({
      ...prev,
      semesterData: {
        ...prev.semesterData,
        [selectedSemesterKey]: {
          ...(prev.semesterData[selectedSemesterKey] || { currentGpa: '', selectedCourses: {} }),
          ...updates
        }
      }
    }));
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImprovementState(prev => ({
      ...prev,
      selectedSemesterKey: e.target.value
    }));
  };

  const handleAddCourse = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseCode = e.target.value;
    if (courseCode) {
      updateCurrentSemesterData({
        selectedCourses: {
          ...selectedCourses,
          [courseCode]: 'N/A' // Default grade
        }
      });
    }
  };

  const handleRemoveCourse = (courseCode: string) => {
    const nextCourses = { ...selectedCourses };
    delete nextCourses[courseCode];
    updateCurrentSemesterData({ selectedCourses: nextCourses });
  };

  const handleGradeChange = (courseCode: string, grade: string) => {
    updateCurrentSemesterData({
      selectedCourses: {
        ...selectedCourses,
        [courseCode]: grade
      }
    });
  };

  const handleGpaChange = (val: string) => {
    updateCurrentSemesterData({ currentGpa: val });
  };

  const glassEffectClasses = "bg-gradient-to-br from-white/50 to-white/20 dark:from-neutral-900/50 dark:to-neutral-900/30 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-xl shadow-black/10";
  const inputClasses = "w-full bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-black/10 dark:border-white/10 shadow-inner rounded-xl py-3 px-4 text-base focus:ring-2 focus:ring-primary-500/80 focus:border-primary-500 outline-none transition";
  
  return (
    <section className={`transition-all duration-500 ease-out ${isMounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
      
      {/* Display Section (Non-sticky) */}
      <div ref={displayElementRef} className="py-2 sm:py-4">
        <ImprovementDisplay 
            {...calculationResult}
            isSticky={false}
        />
      </div>

      {/* Sticky Header */}
      <div className={`fixed top-0 left-0 right-0 z-20 py-4 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-200/80 dark:border-neutral-800/80 transition-all duration-300 ease-in-out will-change-[transform,opacity] ${isSticky ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
         <ImprovementDisplay 
            {...calculationResult}
            isSticky={true}
        />
      </div>

      <div className="max-w-3xl mx-auto mt-4 sm:mt-8">
        
        {/* Main Card */}
        <div className={`${glassEffectClasses} rounded-2xl p-4 sm:p-6`}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
             {/* Semester Selection */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 ml-1">
                Select Semester
              </label>
              <select
                value={selectedSemesterKey}
                onChange={handleSemesterChange}
                className={inputClasses}
              >
                <option value="">Choose...</option>
                {Object.keys(SEMESTER_COURSES).map(key => (
                  <option key={key} value={key}>Semester {key}</option>
                ))}
              </select>
            </div>

            {/* Current GPA Input */}
            {selectedSemesterKey && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 ml-1">
                    Current GPA
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={currentGpa}
                    onChange={(e) => handleGpaChange(e.target.value)}
                    placeholder="e.g. 2.50"
                    inputMode="decimal"
                    className={inputClasses}
                />
                </div>
            )}
          </div>

          {selectedSemesterKey && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Divider */}
                <div className="h-px bg-black/10 dark:bg-white/10 my-6"></div>

                {/* Add Course */}
                <div className="mb-6 space-y-1.5">
                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 ml-1">
                        Add Course to Improve
                    </label>
                    <select 
                        onChange={handleAddCourse} 
                        value="" 
                        className={inputClasses}
                        disabled={availableCourses.length === 0}
                    >
                        <option value="" disabled>
                            {availableCourses.length === 0 ? "All courses added" : "Select a course to improve..."}
                        </option>
                        {availableCourses.map(course => (
                            <option key={course.code} value={course.code}>
                                {course.name} ({course.code})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Courses List */}
                <div className="space-y-3">
                    {Object.keys(selectedCourses).length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-neutral-200/50 dark:border-neutral-800/50 rounded-xl">
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm">No improved courses added yet.</p>
                            <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-1">Select a course from the dropdown above to begin.</p>
                        </div>
                    )}

                    {Object.entries(selectedCourses).map(([courseCode, grade]) => {
                        const course = courses.find(c => c.code === courseCode);
                        if (!course) return null;

                        return (
                        <div 
                            key={course.code}
                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 shadow-sm"
                        >
                            <div className="flex-grow min-w-0 pr-4">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">{course.name}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{course.code} • {course.credits} Credits</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <select
                                    value={grade}
                                    onChange={(e) => handleGradeChange(course.code, e.target.value)}
                                    className="h-10 w-20 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 block px-2 outline-none shadow-sm transition-all"
                                >
                                    {GRADE_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <button 
                                    onClick={() => handleRemoveCourse(course.code)}
                                    className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                    title="Remove course"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImprovementCalculator;
