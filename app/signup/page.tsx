// app/signup/page.tsx
import SignUpForm from "@/components/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup",
  description: "Signup page",
};


export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center">
      <SignUpForm />
    </div>
  );
}