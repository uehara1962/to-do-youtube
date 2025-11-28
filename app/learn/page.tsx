import { getLessonsAction } from "@/actions/lessons/get-lessons-action";
import { getUserProgressAction } from "@/actions/progress/get-user-progress-action";
import { LearningPath } from "@/components/LearningPath";
import { XPDisplay } from "@/components/XPDisplay";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import clsx from "clsx";

export default async function LearnPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const lessonsResult = await getLessonsAction();
  const progressResult = await getUserProgressAction();

  // console.log("lessonsResult", lessonsResult);
  // console.log("progressResult", progressResult);

  const lessons = (lessonsResult.success && lessonsResult.lessons) || [];
  const progress = (progressResult.success && progressResult.progress) || [];

  // console.log("lessons", lessons);
  // console.log("progress", progress);

  // Map progress to lessons
  const lessonsWithProgress = lessons.map((lesson) => {
    const lessonProgress = progress.find((p) => p.lessonId === lesson.id);
    return {
      ...lesson,
      completed: lessonProgress?.completed || false,
      score: lessonProgress?.score || 0,
    };
  });

  // console.log("lessonsWithProgress", lessonsWithProgress);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Aprender Inglês</h1>
        <XPDisplay xp={0} level={1} />
      </div>

      <Suspense fallback={<Spinner className={clsx("min-h-[400px]")} />}>
        <LearningPath lessons={lessonsWithProgress} />
      </Suspense>
    </div>
  );
}
