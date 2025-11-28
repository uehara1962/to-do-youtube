"use server";

import { db } from "@/db/drizzle";
import { lessons } from "@/db/drizzle/schema";
import { eq, asc } from "drizzle-orm";

export async function getAllLessons() {
  return await db.query.lessons.findMany({
    orderBy: [asc(lessons.section), asc(lessons.order)],
  });
}

export async function getLessonById(lessonId: string) {
  return await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
  });
}

export async function getLessonWithExercises(lessonId: string) {
  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      exercises: true,
    },
  });

  // Sort exercises by order manually since Drizzle relations don't support orderBy directly
  if (lesson?.exercises) {
    lesson.exercises.sort((a, b) => a.order - b.order);
  }

  return lesson;
}

export async function getLessonsBySection(section: string) {
  return await db.query.lessons.findMany({
    where: eq(lessons.section, section),
    orderBy: [asc(lessons.order)],
  });
}
