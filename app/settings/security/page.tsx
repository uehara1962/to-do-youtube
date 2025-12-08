import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TwoFactorSettings } from "@/components/TwoFactorSettings";
import { db } from "@/db/drizzle";
import { twoFactor } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function SecuritySettingsPage() {
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

  console.log("=== 2FA STATUS CHECK ===");
  console.log("Session user.twoFactorEnabled:", session.user.twoFactorEnabled);
  console.log("Database twoFactor.enabled:", twoFactorEnabled);
  console.log("Has twoFactor record:", !!twoFactorRecord);
  if (twoFactorRecord) {
    console.log("Record details:", {
      id: twoFactorRecord.id,
      enabled: twoFactorRecord.enabled,
      hasSecret: !!twoFactorRecord.secret,
      hasBackupCodes: !!twoFactorRecord.backupCodes,
      createdAt: twoFactorRecord.createdAt,
      updatedAt: twoFactorRecord.updatedAt,
    });
  }
  console.log("========================");

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações de Segurança</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas configurações de segurança e autenticação de dois
            fatores
          </p>
        </div>

        {/* Status do 2FA */}
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">Status do 2FA</h2>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Na sessão:</span>{" "}
              {session.user.twoFactorEnabled === null
                ? "null"
                : session.user.twoFactorEnabled
                ? "✅ Habilitado"
                : "❌ Desabilitado"}
            </p>
            <p>
              <span className="font-medium">No banco de dados:</span>{" "}
              {twoFactorEnabled ? "✅ Habilitado" : "❌ Desabilitado"}
            </p>
            <p>
              <span className="font-medium">Registro existe:</span>{" "}
              {twoFactorRecord ? "✅ Sim" : "❌ Não"}
            </p>
            {twoFactorRecord && (
              <>
                <p>
                  <span className="font-medium">Secret configurado:</span>{" "}
                  {twoFactorRecord.secret ? "✅ Sim" : "❌ Não"}
                </p>
                <p>
                  <span className="font-medium">Backup codes:</span>{" "}
                  {twoFactorRecord.backupCodes ? "✅ Sim" : "❌ Não"}
                </p>
                <p>
                  <span className="font-medium">Criado em:</span>{" "}
                  {twoFactorRecord.createdAt.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Atualizado em:</span>{" "}
                  {twoFactorRecord.updatedAt.toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>

        <TwoFactorSettings
          user={{
            id: session.user.id,
            email: session.user.email,
            twoFactorEnabled:
              session.user.twoFactorEnabled === null
                ? undefined
                : session.user.twoFactorEnabled,
          }}
        />
      </div>
    </div>
  );
}
