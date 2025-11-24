import NewListButton from "@/components/NewListButton";
import ToDoList from "@/components/ToDoList";
import { clsx } from "clsx";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function TodoPage() {
  // Verificar autenticação antes de renderizar
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<Spinner className={clsx("min-h-[200px]")} />}>
      <ToDoList />
      <NewListButton />
    </Suspense>
  );
}
