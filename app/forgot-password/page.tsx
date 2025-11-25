import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <ForgotPasswordForm />
    </div>
  );
}