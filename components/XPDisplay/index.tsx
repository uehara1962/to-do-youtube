"use client";

import clsx from "clsx";

interface XPDisplayProps {
  xp?: number;
  level?: number;
  className?: string;
}

export function XPDisplay({ xp = 0, level = 1, className }: XPDisplayProps) {
  return (
    <div className={clsx("flex items-center gap-4", className)}>
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 font-bold">⚡</span>
        <span className="text-sm">{xp} XP</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-blue-400 font-bold">🏆</span>
        <span className="text-sm">Nível {level}</span>
      </div>
    </div>
  );
}
