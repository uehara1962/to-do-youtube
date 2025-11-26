import NewListButton from "@/components/NewListButton";
import ToDoList from "@/components/ToDoList";
import { clsx } from "clsx";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { trackServerEvent } from "@/lib/mixpanel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "To Do List",
  description: "To Do List page",
};

export default async function TodoPage() {
  // Verificar autenticação antes de renderizar
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  trackServerEvent("todo_page_viewed", {
    page: "todo",
  });

  return (
    <Suspense fallback={<Spinner className={clsx("min-h-[200px]")} />}>
      <ToDoList />
      <NewListButton />
    </Suspense>
  );
}
