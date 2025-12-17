"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { account } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export type ChangePasswordActionState = {
  error: string | null;
  success: boolean;
};

export async function changePasswordAction(
  state: ChangePasswordActionState,
  formData: FormData
): Promise<ChangePasswordActionState> {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Todos os campos são obrigatórios", success: false };
  }

  if (newPassword !== confirmPassword) {
    return { error: "As senhas não coincidem", success: false };
  }

  if (newPassword.length < 8) {
    return {
      error: "A nova senha deve ter pelo menos 8 caracteres",
      success: false,
    };
  }

  if (currentPassword === newPassword) {
    return {
      error: "A nova senha deve ser diferente da senha atual",
      success: false,
    };
  }

  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      return { error: "Não autenticado", success: false };
    }

    // Buscar a conta do usuário para verificar a senha atual
    const userAccount = await db.query.account.findFirst({
      where: eq(account.userId, session.user.id),
    });

    if (!userAccount || !userAccount.password) {
      return {
        error: "Conta não encontrada ou não possui senha configurada",
        success: false,
      };
    }

    // Verificar se a senha atual está correta
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      userAccount.password
    );

    if (!isCurrentPasswordValid) {
      return {
        error: "Senha atual incorreta",
        success: false,
      };
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar a senha no banco de dados
    await db
      .update(account)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(account.id, userAccount.id));

    return { error: null, success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erro ao alterar senha. Tente novamente.",
      success: false,
    };
  }
}

