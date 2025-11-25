"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const headersList = await headers();
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "/reset-password", // Page to redirect to after clicking email link
      },
      headers: headersList,
    });

    return { success: true };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: "Failed to send reset email" };
  }
}
