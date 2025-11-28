"use client";

import Link from "next/link";
import clsx from "clsx";
import { CheckCircle2, Circle } from "lucide-react";

interface LessonCardProps {
  id: string;
  title: string;
  description?: string;
  section: string;
  completed?: boolean;
  score?: number;
}

export function LessonCard({
  id,
  title,
  description,
  section,
  completed,
  score,
}: LessonCardProps) {
  return (
    <Link href={`/learn/${id}`}>
      <div
        className={clsx(
          "p-4 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer",
          completed
            ? "border-green-500 bg-green-500/10"
            : "border-gray-600 hover:border-gray-500"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1">{section}</div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            {description && (
              <p className="text-sm text-gray-400">{description}</p>
            )}
            {score !== undefined && (
              <div className="mt-2 text-sm text-gray-400">
                Pontuação: {score}%
              </div>
            )}
          </div>
          <div className="ml-4">
            {completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-gray-500" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
