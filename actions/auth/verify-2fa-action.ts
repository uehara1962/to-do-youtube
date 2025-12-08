"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { verification, twoFactor } from "@/db/drizzle/schema";
import { eq, and, gt } from "drizzle-orm";

export type Verify2FAActionState = {
  error: string | null;
  success: boolean;
};

export async function verify2FAAction(
  state: Verify2FAActionState,
  formData: FormData
): Promise<Verify2FAActionState> {
  const code = formData.get("code") as string;

  if (!code || code.length !== 6) {
    return { error: "Código inválido", success: false };
  }

  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      return { error: "Não autenticado", success: false };
    }

    // Verificar se há um código OTP armazenado na tabela verification
    const verificationRecords = await db.query.verification.findMany({
      where: and(
        eq(verification.identifier, session.user.email),
        gt(verification.expiresAt, new Date())
      ),
    });

    console.log("=== VERIFICATION RECORDS 1 ===");
    console.log("Records found:", verificationRecords.length);
    verificationRecords.forEach((record, index) => {
      console.log(`Record ${index + 1}:`, {
        id: record.id,
        identifier: record.identifier,
        value: record.value,
        expiresAt: record.expiresAt,
        createdAt: record.createdAt,
      });
    });
    console.log("Code to verify:", code);
    console.log("===========================");

    // Verificar se o código existe e é válido na tabela verification
    const validRecord = verificationRecords.find(
      (record) => record.value === code
    );

    if (!validRecord) {
      return { error: "Código inválido ou expirado", success: false };
    }

    // Código válido! Deletar o código usado e habilitar 2FA
    await db.delete(verification).where(eq(verification.id, validRecord.id));

    // Atualizar o registro twoFactor para enabled: true
    const twoFactorRecord = await db.query.twoFactor.findFirst({
      where: eq(twoFactor.userId, session.user.id),
    });

    if (twoFactorRecord) {
      await db
        .update(twoFactor)
        .set({ enabled: true, updatedAt: new Date() })
        .where(eq(twoFactor.id, twoFactorRecord.id));
    }

    console.log("=== CÓDIGO VERIFICADO COM SUCESSO ===");
    console.log("2FA habilitado para usuário:", session.user.email);
    console.log("====================================");

    // Redirecionar para o dashboard após sucesso
    redirect("/dashboard");
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

    console.error("Verify 2FA error:", error);
    return {
      error: error instanceof Error ? error.message : "Erro ao verificar código",
      success: false,
    };
  }
}

