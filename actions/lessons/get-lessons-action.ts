"use server";

import { getAllLessons } from "@/server/lessons";
import { getSession } from "@/lib/auth-server";

export async function getLessonsAction() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  try {
    const lessons = await getAllLessons();
    return { success: true, lessons };
  } catch (error) {
    console.error("Error getting lessons:", error);
    return { success: false, error: "Failed to get lessons" };
  }
}
