// app/dashboard/page.tsx
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
      <div>
        <h1>Dashboard</h1>
        <p>Bem-vindo, {user.name}!</p>
      </div>
  );
}


// -------------------
// // app/dashboard/page.tsx
// import { Spinner } from "@/components/ui/spinner";
// // import { getCurrentUser } from "@/lib/auth-server";
// import clsx from "clsx";
// // import { redirect } from "next/navigation";
// import { Suspense } from "react";

// export default async function DashboardPage() {
//   // const user = await getCurrentUser();

//   // if (!user) {
//   //   redirect("/login");
//   // }

//   return (
//     <Suspense fallback={<Spinner className={clsx("min-h-[200px]")} />}>
//       <div>
//         <h1>Dashboard</h1>
//         {/* <p>Bem-vindo, {user.name}!</p> */}
//       </div>
//     </Suspense>
//   );
// }
