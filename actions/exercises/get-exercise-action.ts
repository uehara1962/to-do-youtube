"use server";

import { getExerciseById } from "@/server/exercises";
import { getSession } from "@/lib/auth-server";

export async function getExerciseAction(exerciseId: string) {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const exercise = await getExerciseById(exerciseId);
    if (!exercise) {
      return { success: false, error: "Exercise not found" };
    }
    return { success: true, exercise };
  } catch (error) {
    console.error("Error getting exercise:", error);
    return { success: false, error: "Failed to get exercise" };
  }
}
