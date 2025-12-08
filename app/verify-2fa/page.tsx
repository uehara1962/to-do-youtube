import { VerifyTwoFactorForm } from "@/components/VerifyTwoFactorForm";

export default function VerifyTwoFactorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Verificação de Dois Fatores
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite o código de verificação enviado para seu email
          </p>
        </div>
        <VerifyTwoFactorForm />
      </div>
    </div>
  );
}
