
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SEMESTER_COURSES, GRADE_POINTS, GRADE_OPTIONS } from '../constants';
import { Course } from '../types';
import ImprovementDisplay from './ImprovementDisplay';
import PlusIcon from './icons/PlusIcon';
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
      <div className={`fixed top-0 left-0 right-0 z-20 py-4 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-200/80 dark:border-neutral-800/80 transition-all duration-300 ease-in-out ${isSticky ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
         <ImprovementDisplay 
            {...calculationResult}
            isSticky={true}
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 mt-6 sm:mt-8">
        
        {/* Input Section */}
        <div className={`${glassEffectClasses} rounded-2xl p-4 sm:p-6`}>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <PlusIcon />
            </span>
            Calculate Improvement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Select Semester
              </label>
              <select
                value={selectedSemesterKey}
                onChange={handleSemesterChange}
                className="w-full bg-white/50 dark:bg-black/20 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
              >
                <option value="">Choose...</option>
                {Object.keys(SEMESTER_COURSES).map(key => (
                  <option key={key} value={key}>Semester {key}</option>
                ))}
              </select>
              {totalSemesterCredits > 0 && (
                 <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-1">
                   Total Credits: <span className="font-semibold">{totalSemesterCredits}</span>
                 </p>
              )}
            </div>

            {selectedSemesterKey && (
                <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
                    className="w-full bg-white/50 dark:bg-black/20 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-neutral-400"
                />
                </div>
            )}
          </div>
        </div>

        {/* Course Selection */}
        {selectedSemesterKey && (
          <div className={`${glassEffectClasses} rounded-2xl p-4 sm:p-6`}>
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">
              Select Courses to Improve
            </h3>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Add Course
                </label>
                <select 
                    onChange={handleAddCourse} 
                    value="" 
                    className="w-full bg-white/50 dark:bg-black/20 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
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

            <div className="space-y-3">
               {Object.keys(selectedCourses).length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-200 bg-primary-50/50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800 animate-in fade-in slide-in-from-bottom-2"
                  >
                    <div className="flex-grow">
                        <p className="font-semibold text-primary-900 dark:text-primary-100 text-sm sm:text-base">{course.name}</p>
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{course.code} • {course.credits} Credits</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 mt-1 sm:mt-0">
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hidden sm:inline">New Grade:</span>
                             <select
                                value={grade}
                                onChange={(e) => handleGradeChange(course.code, e.target.value)}
                                className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none shadow-sm min-w-[80px]"
                            >
                                {GRADE_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            onClick={() => handleRemoveCourse(course.code)}
                            className="p-2 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Remove course"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImprovementCalculator;
