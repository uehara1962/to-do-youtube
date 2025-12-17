import NewListButton from "@/components/NewListButton";
import { clsx } from "clsx";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import ToDoListTable from "@/components/ToDoListTable";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { trackServerEvent } from "@/lib/mixpanel";
import { Metadata } from "next";
import { getSeoTags } from "@/lib/seo";

export const metadata: Metadata = getSeoTags({
  appName: "Home | To Do List",
  AppDescription: "Home page of the To Do List app",
  Keywords: ["to do list", "todo list", "todo"],
  appDomain: "https://www.carlosuehara.com.br",
  canonicalUrlRelative: "/",
});

export default async function Home() {
  const user = await getCurrentUser();

  console.log("home page user:", user);
  if (!user) { 
    redirect("/login");
  }

  trackServerEvent("home_page_viewed", {
    page: "home",
    user_id: user.id,
    user_email: user.email,
  });

  return (
    <Suspense fallback={<Spinner className={clsx("min-h-[200px]")} />}>
      <NewListButton />
      <LogoutButton />
      <ToDoListTable />
    </Suspense>
  );
}
