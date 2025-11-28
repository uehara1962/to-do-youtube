"use server";

import { createOrUpdateProgress } from "@/server/progress";
import { getExercisesByLessonId } from "@/server/exercises";
import { getUserAnswers } from "@/server/progress";
import { getSession } from "@/lib/auth-server";
import { z } from "zod";

const completeLessonSchema = z.object({
  lessonId: z.string().uuid(),
});

export async function completeLessonAction(formData: FormData) {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const data = {
      lessonId: formData.get("lessonId") as string,
    };

    const validated = completeLessonSchema.parse(data);

    // Get all exercises for the lesson
    const exercises = await getExercisesByLessonId(validated.lessonId);

    // Get user answers for this lesson
    const answers = await getUserAnswers(session.user.id, validated.lessonId);

    // Calculate score
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const totalExercises = exercises.length;
    const score =
      totalExercises > 0
        ? Math.round((correctAnswers / totalExercises) * 100)
        : 0;

    // Mark as completed if score is at least 70%
    const completed = score >= 70;

    // Update progress
    await createOrUpdateProgress(
      session.user.id,
      validated.lessonId,
      score,
      completed
    );

    return {
      success: true,
      score,
      completed,
      correctAnswers,
      totalExercises,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input" };
    }
    console.error("Error completing lesson:", error);
    return { success: false, error: "Failed to complete lesson" };
  }
}
