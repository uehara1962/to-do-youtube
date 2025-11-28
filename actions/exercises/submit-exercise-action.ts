"use server";

import { checkAnswer, getExerciseById } from "@/server/exercises";
import { saveUserAnswer } from "@/server/progress";
import { getSession } from "@/lib/auth-server";
import { z } from "zod";

const submitExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  answer: z.string().min(1),
});

export async function submitExerciseAction(formData: FormData) {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const data = {
      exerciseId: formData.get("exerciseId") as string,
      answer: formData.get("answer") as string,
    };

    const validated = submitExerciseSchema.parse(data);
    const exercise = await getExerciseById(validated.exerciseId);

    if (!exercise) {
      return { success: false, error: "Exercise not found" };
    }

    const isCorrect = await checkAnswer(validated.exerciseId, validated.answer);

    // Save user answer
    await saveUserAnswer(
      session.user.id,
      validated.exerciseId,
      validated.answer,
      isCorrect
    );

    return {
      success: true,
      isCorrect,
      correctAnswer: exercise.correctAnswer,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input" };
    }
    console.error("Error submitting exercise:", error);
    return { success: false, error: "Failed to submit exercise" };
  }
}
