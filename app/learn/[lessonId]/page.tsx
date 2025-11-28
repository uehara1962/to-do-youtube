import { getLessonAction } from "@/actions/lessons/get-lesson-action";
import { getLessonProgressAction } from "@/actions/progress/get-user-progress-action";
import { LessonHeader } from "@/components/LessonHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getExercisesByLessonId } from "@/server/exercises";

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { lessonId } = await params;
  const lessonResult = await getLessonAction(lessonId);
  const progressResult = await getLessonProgressAction(lessonId);

  console.log("lessonResult", lessonResult);
  console.log("progressResult", progressResult);

  if (!lessonResult.success || !lessonResult.lesson) {
    notFound();
  }

  const lesson = lessonResult.lesson;
  const progress = progressResult.success ? progressResult.progress : null;

  const exercises = await getExercisesByLessonId(lessonId);
  const totalExercises = exercises.length;
  const completedExercises = progress?.completed ? totalExercises : 0;
  const firstExercise = exercises.length > 0 ? exercises[0] : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <LessonHeader
        section={lesson.section}
        title={lesson.title}
        description={lesson.description || undefined}
      />

      {progress && (
        <div className="mb-6">
          <ProgressBar current={completedExercises} total={totalExercises} />
          {progress.score > 0 && (
            <div className="mt-2 text-sm text-gray-400">
              Pontuação: {progress.score}%
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-8 text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-gray-400 mb-6">
            Esta lição contém {totalExercises} exercício
            {totalExercises !== 1 ? "s" : ""}.
            {progress?.completed && (
              <span className="block mt-2 text-green-400">
                ✓ Lição completada!
              </span>
            )}
          </p>
        </div>

        {firstExercise ? (
          <Link href={`/learn/${lessonId}/exercise/${firstExercise.id}`}>
            <Button size="lg" className="w-full md:w-auto">
              {progress?.completed ? "Refazer Lição" : "Iniciar Exercícios"}
            </Button>
          </Link>
        ) : (
          <p className="text-gray-500">Nenhum exercício disponível ainda.</p>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <Link href="/learn">
          <Button variant="outline">← Voltar</Button>
        </Link>
      </div>
    </div>
  );
}
