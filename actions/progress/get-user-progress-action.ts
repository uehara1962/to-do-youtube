"use server";

import { getUserProgress, getLessonProgress } from "@/server/progress";
import { getSession } from "@/lib/auth-server";

export async function getUserProgressAction() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  try {
    const progress = await getUserProgress(session.user.id);
    return { success: true, progress };
  } catch (error) {
    console.error("Error getting user progress:", error);
    return { success: false, error: "Failed to get progress" };
  }
}

export async function getLessonProgressAction(lessonId: string) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  try {
    const progress = await getLessonProgress(session.user.id, lessonId);
    return { success: true, progress };
  } catch (error) {
    console.error("Error getting lesson progress:", error);
    return { success: false, error: "Failed to get lesson progress" };
  }
}
