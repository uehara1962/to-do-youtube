"use server";

import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export type Disable2FAActionState = {
  error: string | null;
  success: boolean;
};

export async function disable2FAAction(
  state: Disable2FAActionState,
  formData: FormData
): Promise<Disable2FAActionState> {
  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Senha é obrigatória", success: false };
  }

  try {
    const headersList = await headers();
    const baseUrl =
      process.env.BETTER_AUTH_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000");

    // Criar um NextRequest para passar ao handler do better-auth
    const request = new NextRequest(`${baseUrl}/api/auth/two-factor/disable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: baseUrl,
        Referer: baseUrl,
        Cookie: headersList.get("cookie") || "",
      },
      body: JSON.stringify({ password }),
    });

    // Usar o handler interno do better-auth
    const handler = auth.handler;
    const response = await handler(request);

    const result = await response.json();

    if (!response.ok || result.error) {
      return {
        error:
          result.error?.message || result.message || "Erro ao desabilitar 2FA",
        success: false,
      };
    }

    return { error: null, success: true };
  } catch (error) {
    console.error("Disable 2FA error:", error);
    return {
      error: error instanceof Error ? error.message : "Erro ao desabilitar 2FA",
      success: false,
    };
  }
}
