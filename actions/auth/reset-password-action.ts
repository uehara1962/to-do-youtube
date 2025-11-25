"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function resetPasswordAction(formData: FormData, token: string) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  try {
    const headersList = await headers();
    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token, // Token from the URL
      },
      headers: headersList,
    });

    redirect("/login?reset=success");
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Reset password error:", error);
    return { error: "Failed to reset password. Token might be invalid or expired." };
  }
}