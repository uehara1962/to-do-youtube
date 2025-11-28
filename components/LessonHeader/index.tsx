"use client";

import clsx from "clsx";

interface LessonHeaderProps {
  section: string;
  title: string;
  description?: string;
}

export function LessonHeader({
  section,
  title,
  description,
}: LessonHeaderProps) {
  return (
    <div className="mb-6">
      <div className="text-sm text-gray-400 mb-2">{section}</div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && <p className="text-gray-400">{description}</p>}
    </div>
  );
}
