"use client";

import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

interface ExerciseProgressBarProps {
  current: number;
  total: number;
  lessonId: string;
  hearts?: number; // Opcional: sistema de vidas
}

export function ExerciseProgressBar({
  current,
  total,
  lessonId,
  hearts = 5,
}: ExerciseProgressBarProps) {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Close Button */}
          <Link href={`/learn/${lessonId}`}>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </Link>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md">
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-gray-400 mt-1 text-center">
              {current} de {total}
            </div>
          </div>

          {/* Hearts (optional) */}
          <div className="flex items-center gap-1">
            {Array.from({ length: hearts }).map((_, index) => (
              <div
                key={index}
                className={clsx(
                  "w-6 h-6 rounded-full",
                  index < hearts
                    ? "bg-linear-to-br from-pink-500 via-purple-500 to-blue-500"
                    : "bg-gray-700"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
