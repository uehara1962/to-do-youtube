import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import * as schema from "@/db/drizzle/schema";
import { nextCookies } from "better-auth/next-js";
import { sendResetPasswordEmail } from "./email";

// Get base URL for server-side
// Priority: BETTER_AUTH_URL > VERCEL_URL > localhost
const baseUrl =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000");

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Mude para true em produção
    async sendResetPassword({ user, url }) {
      await sendResetPasswordEmail(user.email, url);
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: baseUrl,
  basePath: "/api/auth",
  // Configuração de Cookies
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias (em segundos)
    updateAge: 60 * 60 * 24, // Atualizar sessão a cada 24 horas
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache de 5 minutos
    },
  },
  advanced: {
    cookiePrefix: "better-auth", // Prefixo dos cookies (padrão)
    database: {
      generateId: () => crypto.randomUUID(), // Função para gerar IDs
    },
  },
  trustedOrigins: [
    baseUrl,
    "https://www.carlosuehara.com.br",
    "https://carlosuehara.com.br",
    // Adicione outros domínios confiáveis aqui
  ],
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
