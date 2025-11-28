"use server";

import { getLessonWithExercises } from "@/server/lessons";
import { getSession } from "@/lib/auth-server";

export async function getLessonAction(lessonId: string) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  try {
    const lesson = await getLessonWithExercises(lessonId);
    if (!lesson) {
      return { success: false, error: "Lesson not found" };
    }
    return { success: true, lesson };
  } catch (error) {
    console.error("Error getting lesson:", error);
    return { success: false, error: "Failed to get lesson" };
  }
}
