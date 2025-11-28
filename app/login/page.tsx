import LoginForm from "@/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login page",
};


export default function LoginPage() {
  return (
    <div className="w-2/3 max-w-md mx-auto flex items-center justify-center" suppressHydrationWarning>
      <LoginForm />
    </div>
  );
}
