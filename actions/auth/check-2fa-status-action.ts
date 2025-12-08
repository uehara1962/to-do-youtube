"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { twoFactor } from "@/db/drizzle/schema";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function check2FAStatusAction() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      return {
        error: "Não autenticado",
        enabled: false,
      };
    }

    // Verificar diretamente no banco de dados
    const twoFactorRecord = await db.query.twoFactor.findFirst({
      where: eq(twoFactor.userId, session.user.id),
    });

    const enabled = twoFactorRecord?.enabled ?? false;

    return {
      enabled,
      twoFactorEnabled: session.user.twoFactorEnabled ?? false,
      hasRecord: !!twoFactorRecord,
      record: twoFactorRecord
        ? {
            id: twoFactorRecord.id,
            enabled: twoFactorRecord.enabled,
            createdAt: twoFactorRecord.createdAt,
            updatedAt: twoFactorRecord.updatedAt,
            hasSecret: !!twoFactorRecord.secret,
            hasBackupCodes: !!twoFactorRecord.backupCodes,
          }
        : null,
    };
  } catch (error) {
    console.error("Error checking 2FA status:", error);
    return {
      error: error instanceof Error ? error.message : "Erro ao verificar 2FA",
      enabled: false,
    };
  }
}
