// actions/auth/signup-action.ts
"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export type SignupActionState = {
  error: string | null;
};

export async function signupAction(state: SignupActionState, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Todos os campos são obrigatórios" };
  }

  try {
    const headersList = await headers();
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: headersList,
    });

    if (result.user) {
      redirect("/");
    } else {
      return { error: "Erro ao criar conta" };
    }
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

    console.error("Signup error:", error);
    return {
      error: error instanceof Error ? error.message : "Erro ao criar conta",
    };
  }
}