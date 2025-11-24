// actions/auth/logout-action.ts
"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function logoutAction() {
  try {
    const headersList = await headers();
    await auth.api.signOut({
      headers: headersList,
    });

    redirect("/login");
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorWithDigest = error as Error & { digest?: string };
      if (
        error.message === "NEXT_REDIRECT" ||
        errorWithDigest.digest?.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
    }

    console.error("Logout error:", error);
    redirect("/login");
  }
}



// -------------------------

// "use server";

// import { asyncDelay } from "@/utils/async-delay";
// // import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";

// export async function logoutAction() {
//   await asyncDelay(5000);
//   return { success: "Logout realizado com sucesso" };
  
//   try {
//     // await auth.api.signOut({
//     //   headers: await import("next/headers").then((h) => h.headers()),
//     // });
//     redirect("/login");
//   } catch (error) {
//     console.error("Logout error:", error);
//     throw new Error("Erro ao fazer logout");
//   }
// }