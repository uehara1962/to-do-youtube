"use server";

import { db } from "@/db/drizzle";
import { exercises } from "@/db/drizzle/schema";
import { eq, asc } from "drizzle-orm";

export async function getExerciseById(exerciseId: string) {
  return await db.query.exercises.findFirst({
    where: eq(exercises.id, exerciseId),
  });
}

export async function getExercisesByLessonId(lessonId: string) {
  return await db.query.exercises.findMany({
    where: eq(exercises.lessonId, lessonId),
    orderBy: [asc(exercises.order)],
  });
}

export async function getNextExercise(
  lessonId: string,
  currentExerciseOrder: number
) {
  return await db.query.exercises.findFirst({
    where: eq(exercises.lessonId, lessonId),
    orderBy: [asc(exercises.order)],
  });
}

export async function getExerciseByOrder(lessonId: string, order: number) {
  const allExercises = await getExercisesByLessonId(lessonId);
  return allExercises.find((e) => e.order === order) || null;
}

export async function checkAnswer(
  exerciseId: string,
  userAnswer: string
): Promise<boolean> {
  const exercise = await getExerciseById(exerciseId);

  if (!exercise) {
    return false;
  }

  // Normalize answers (lowercase, trim)
  const normalizedUserAnswer = userAnswer.toLowerCase().trim();
  const normalizedCorrectAnswer = exercise.correctAnswer.toLowerCase().trim();

  return normalizedUserAnswer === normalizedCorrectAnswer;
}
