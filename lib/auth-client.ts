import { createAuthClient } from "better-auth/react";

// Get base URL for client-side
// In production, use NEXT_PUBLIC_BETTER_AUTH_URL or detect from window.location
// In development, use localhost
const getBaseUrl = () => {
  // Check for explicit public env variable first (highest priority)
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }

  // In browser (client-side), detect from current location
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Fallback for SSR (shouldn't happen often, but safe fallback)
  return process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";
};

// Initialize auth client with dynamic base URL
// The baseURL will be resolved when the client is used in the browser
export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

export const { signIn, signUp, signOut, useSession } = authClient;
