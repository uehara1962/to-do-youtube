"use client";

import Link from "next/link";
import clsx from "clsx";
import { CheckCircle2, Circle, Lock } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  section: string;
  order: number;
  completed?: boolean;
}

interface LearningPathProps {
  lessons: Lesson[];
  currentSection?: string;
}

export function LearningPath({ lessons }: LearningPathProps) {
  // Group lessons by section
  const lessonsBySection = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.section]) {
      acc[lesson.section] = [];
    }
    acc[lesson.section].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  console.log("lessonsBySection", lessonsBySection);

  return (
    <div className="space-y-8">
      {Object.entries(lessonsBySection).map(([section, sectionLessons]) => (
        <div key={section} className="space-y-4">
          <h2 className="text-xl font-bold text-blue-400">{section}</h2>
          <div className="flex flex-wrap gap-4">
            {sectionLessons
              .sort((a, b) => a.order - b.order)
              .map((lesson, index) => {
                const isCompleted = lesson.completed;
                const isLocked =
                  index > 0 && !lessonsBySection[section][index - 1]?.completed;

                return (
                  <div key={lesson.id} className="relative">
                    {index > 0 && (
                      <div className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 w-4 h-0.5 bg-gray-600" />
                    )}
                    {isLocked ? (
                      <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center cursor-not-allowed">
                        <Lock className="w-6 h-6 text-gray-600" />
                      </div>
                    ) : (
                      <Link href={`/learn/${lesson.id}`}>
                        <div
                          className={clsx(
                            "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 cursor-pointer",
                            isCompleted
                              ? "bg-green-500 border-green-500"
                              : "bg-gray-800 border-blue-500 hover:border-blue-400"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-8 h-8 text-white" />
                          ) : (
                            <Circle className="w-8 h-8 text-blue-500" />
                          )}
                        </div>
                      </Link>
                    )}
                    <div className="mt-2 text-xs text-center text-gray-400 max-w-16 truncate">
                      {lesson.title}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
