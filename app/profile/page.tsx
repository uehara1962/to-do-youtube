import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { TwoFactorSettings } from "@/components/TwoFactorSettings";
import { db } from "@/db/drizzle";
import { twoFactor } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function ProfilePage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Verificar status do 2FA diretamente no banco de dados
  const twoFactorRecord = await db.query.twoFactor.findFirst({
    where: eq(twoFactor.userId, session.user.id),
  });

  const twoFactorEnabled = twoFactorRecord?.enabled ?? false;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Perfil</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas informações pessoais e configurações de segurança
          </p>
        </div>

        {/* Informações do Usuário */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Nome:</span> {session.user.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {session.user.email}
            </div>
            <div>
              <span className="font-medium">Email Verificado:</span>{" "}
              {session.user.emailVerified ? "✅ Sim" : "❌ Não"}
            </div>
          </div>
        </div>

        {/* Alterar Senha */}
        <ChangePasswordForm />

        {/* Configurações de 2FA */}
        <TwoFactorSettings
          user={{
            id: session.user.id,
            email: session.user.email,
            twoFactorEnabled: twoFactorEnabled ? true : undefined,
          }}
        />
      </div>
    </div>
  );
}
