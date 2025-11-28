import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Esqueceu sua senha?",
  description: "Esqueceu sua senha? page",
};


export default function ForgotPasswordPage() {
  return (
    <div className="w-2/3 max-w-md mx-auto flex items-center justify-center">
      <ForgotPasswordForm />
    </div>
  );
}
