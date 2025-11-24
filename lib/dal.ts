import "server-only";
import { cache } from "react";
import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

/**
 * Verifica se o usuário está autenticado
 * Redireciona para /login se não estiver
 */
export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: session.user.id,
    user: session.user,
  };
});

/**
 * Obtém o usuário atual
 * Retorna null se não autenticado (sem redirecionar)
 */
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user || null;
});