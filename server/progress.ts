"use server";

import { db } from "@/db/drizzle";
import { userProgress, userAnswers, exercises } from "@/db/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function getUserProgress(userId: string) {
  return await db.query.userProgress.findMany({
    where: eq(userProgress.userId, userId),
  });
}

export async function getLessonProgress(userId: string, lessonId: string) {
  return await db.query.userProgress.findFirst({
    where: and(
      eq(userProgress.userId, userId),
      eq(userProgress.lessonId, lessonId)
    ),
  });
}

export async function createOrUpdateProgress(
  userId: string,
  lessonId: string,
  score: number,
  completed: boolean
) {
  const existing = await getLessonProgress(userId, lessonId);

  if (existing) {
    return await db
      .update(userProgress)
      .set({
        score: Math.max(existing.score, score), // Keep highest score
        completed: completed || existing.completed,
        attempts: existing.attempts + 1,
        completedAt:
          completed && !existing.completed ? new Date() : existing.completedAt,
        updatedAt: new Date(),
      })
      .where(eq(userProgress.id, existing.id))
      .returning();
  } else {
    return await db
      .insert(userProgress)
      .values({
        userId,
        lessonId,
        score,
        completed,
        attempts: 1,
        completedAt: completed ? new Date() : null,
      })
      .returning();
  }
}

export async function saveUserAnswer(
  userId: string,
  exerciseId: string,
  answer: string,
  isCorrect: boolean
) {
  return await db.insert(userAnswers).values({
    userId,
    exerciseId,
    answer,
    isCorrect,
    attemptedAt: new Date(),
  });
}

export async function getUserAnswers(userId: string, lessonId?: string) {
  const answers = await db.query.userAnswers.findMany({
    where: eq(userAnswers.userId, userId),
    with: {
      exercise: true,
    },
  });

  if (lessonId) {
    // Filter answers for exercises in a specific lesson
    return answers.filter((answer) => answer.exercise?.lessonId === lessonId);
  }

  return answers;
}
