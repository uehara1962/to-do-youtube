import { getLessonAction } from "@/actions/lessons/get-lesson-action";
import { getExerciseAction } from "@/actions/exercises/get-exercise-action";
// import { getLessonProgressAction } from "@/actions/progress/get-user-progress-action";
import { ExerciseProgressBar } from "@/components/ExerciseProgressBar";
import { ExerciseMultipleChoice } from "@/components/ExerciseMultipleChoice";
import { ExerciseTranslation } from "@/components/ExerciseTranslation";
import { ExerciseFillBlank } from "@/components/ExerciseFillBlank";
import { ExerciseListening } from "@/components/ExerciseListening";
import { ExerciseSpeaking } from "@/components/ExerciseSpeaking";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getExercisesByLessonId } from "@/server/exercises";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aprender Inglês",
  description: "Aprender Inglês page",
};

interface ExercisePageProps {
  params: Promise<{ lessonId: string; exerciseId: string }>;
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { lessonId, exerciseId } = await params;

  const lessonResult = await getLessonAction(lessonId);
  const exerciseResult = await getExerciseAction(exerciseId);

  if (!lessonResult.success || !lessonResult.lesson) {
    notFound();
  }

  if (!exerciseResult.success || !exerciseResult.exercise) {
    notFound();
  }

  // const lesson = lessonResult.lesson;
  const exercise = exerciseResult.exercise;

  // Get all exercises to determine current position
  const allExercises = await getExercisesByLessonId(lessonId);
  const currentIndex = allExercises.findIndex((e) => e.id === exerciseId);
  const currentExerciseNumber = currentIndex + 1;
  const totalExercises = allExercises.length;

  // Get next and previous exercise IDs
  const nextExercise =
    currentIndex < allExercises.length - 1
      ? allExercises[currentIndex + 1]
      : null;
  const previousExercise =
    currentIndex > 0 ? allExercises[currentIndex - 1] : null;

  // Render exercise component based on type
  const renderExercise = () => {
    const exerciseProps = {
      exerciseId: exercise.id,
      question: exercise.question,
      correctAnswer: exercise.correctAnswer,
      options:
        exercise.options && Array.isArray(exercise.options)
          ? (exercise.options as string[])
          : [],
      audioUrl: exercise.audioUrl || null,
    };

    switch (exercise.type) {
      case "multiple_choice":
        return <ExerciseMultipleChoice {...exerciseProps} />;
      case "translation":
        return <ExerciseTranslation {...exerciseProps} />;
      case "fill_blank":
        return <ExerciseFillBlank {...exerciseProps} />;
      case "listening":
        return <ExerciseListening {...exerciseProps} />;
      case "speaking":
        return <ExerciseSpeaking {...exerciseProps} />;
      default:
        return (
          <div className="text-red-400">
            Tipo de exercício não suportado: {exercise.type}
          </div>
        );
    }
  };

  return (
    <div className="w-2/3 bg-gray-900 pt-7">
      <ExerciseProgressBar
        current={currentExerciseNumber}
        total={totalExercises}
        lessonId={lessonId}
      />

      <div className="w-full mx-auto px-4 py-2 max-w-5xl">
        <div className="bg-gray-800 rounded-lg p-8 min-h-[60vh] flex flex-col justify-center">
          {renderExercise()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <div>
            {previousExercise ? (
              <Link href={`/learn/${lessonId}/exercise/${previousExercise.id}`}>
                <Button variant="outline">← Anterior</Button>
              </Link>
            ) : (
              <Link href={`/learn/${lessonId}`}>
                <Button variant="outline">← Voltar para Lição</Button>
              </Link>
            )}
          </div>

          <div className="text-sm text-gray-400">
            Exercício {currentExerciseNumber} de {totalExercises}
          </div>

          <div>
            {nextExercise ? (
              <Link href={`/learn/${lessonId}/exercise/${nextExercise.id}`}>
                <Button>Próximo →</Button>
              </Link>
            ) : (
              <Link href={`/learn/${lessonId}`}>
                <Button>Finalizar Lição →</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
