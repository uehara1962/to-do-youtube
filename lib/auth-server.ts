import { auth } from "@/lib/auth";

export async function getSession() {
  return await auth.api.getSession({
    headers: await import("next/headers").then((h) => h.headers()),
  });
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}