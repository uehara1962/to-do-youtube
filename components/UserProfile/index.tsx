"use client";

import { useSession } from "@/lib/auth-client";

export function UserProfile() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Carregando...</div>;
  }

  if (!session) {
    return <div>Não autenticado</div>;
  }

  return (
    <div>
      <p>Olá, {session.user.name}!</p>
    </div>
  );
}