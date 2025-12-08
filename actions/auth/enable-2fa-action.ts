"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
// import { sendTwoFactorCode } from "@/lib/email";

export type Enable2FAActionState = {
  error: string | null;
  success: boolean;
};

export async function enable2FAAction(
  state: Enable2FAActionState,
  formData: FormData
): Promise<Enable2FAActionState> {
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
    const request = new NextRequest(`${baseUrl}/api/auth/two-factor/enable`, {
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

    console.log("response_enable:", response);
    const result = await response.json();
    console.log("result_enable:", result);

    if (!response.ok || result.error) {
      return {
        error:
          result.error?.message || result.message || "Erro ao habilitar 2FA",
        success: false,
      };
    }

    // Após habilitar 2FA, precisamos enviar o código por email imediatamente
    // O Better Auth gera o código e chama nossa função sendOTP configurada no plugin
    try {
      // Chamar o endpoint do Better Auth para gerar e enviar o código
      const sendOtpRequest = new NextRequest(
        `${baseUrl}/api/auth/two-factor/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: baseUrl,
            Referer: baseUrl,
            Cookie: headersList.get("cookie") || "",
          },
        }
      );

      const sendOtpResponse = await handler(sendOtpRequest);
      const sendOtpResult = await sendOtpResponse.json();

      console.log("sendOtpResponse:", sendOtpResponse.status);
      console.log("sendOtpResult:", sendOtpResult);

      if (!sendOtpResponse.ok || sendOtpResult.error) {
        console.error("Erro ao enviar código:", sendOtpResult.error);
        // Não falhar completamente, apenas logar o erro
        // O usuário pode solicitar reenvio na página de verificação
      }
    } catch (error) {
      console.error("Erro ao enviar código após habilitar 2FA:", error);
      // Não falhar completamente, apenas logar o erro
    }

    // Redirecionar para a página de verificação
    redirect("/verify-2fa");
  } catch (error: unknown) {
    // redirect() lança uma exceção especial NEXT_REDIRECT
    if (error instanceof Error) {
      const errorWithDigest = error as Error & { digest?: string };
      if (
        error.message === "NEXT_REDIRECT" ||
        errorWithDigest.digest?.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
    }

    console.error("Enable 2FA error:", error);
    return {
      error: error instanceof Error ? error.message : "Erro ao habilitar 2FA",
      success: false,
    };
  }
}
