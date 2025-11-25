"use client";

import { useState } from "react";
import { resetPasswordAction } from "@/actions/auth/reset-password-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || ""; // Get token from URL query param
  const [isPending, setIsPending] = useState(false);

  if (!token) {
    return <div className="text-red-500">Invalid or missing reset token.</div>;
  }

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    const result = await resetPasswordAction(formData, token);
    setIsPending(false);

    if (result?.error) {
      toast.error(result.error);
    }
  };

  return (
    <form action={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          disabled={isPending}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}