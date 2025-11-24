import NewListButton from "@/components/NewListButton";
import { clsx } from "clsx";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import ToDoListTable from "@/components/ToDoListTable";
import LogoutButton from "@/components/LogoutButton";
// import { getCurrentUser } from "@/lib/auth-server";
// import { redirect } from "next/navigation";

export default async function Home() {
  // const user = await getCurrentUser();

  // console.log("home page user:", user);
  // if (!user) {
  //   redirect("/login");
  // }

  return (
    <Suspense fallback={<Spinner className={clsx("min-h-[200px]")} />}>
      <NewListButton />
      <LogoutButton />
      <ToDoListTable />
    </Suspense>
  );
}
