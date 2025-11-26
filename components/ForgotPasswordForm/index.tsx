"use client";

import { useState } from "react";
import { forgotPasswordAction } from "@/actions/auth/forgot-password-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    const result = await forgotPasswordAction(formData);
    setIsPending(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("If an account exists, a reset email has been sent.");
    }
  };

  return (
    <form action={handleSubmit} className="w-full max-w-md space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4">Esqueceu sua senha?</h1>
      <div className="space-y-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          disabled={isPending}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
}