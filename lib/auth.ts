import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import * as schema from "@/db/drizzle/schema";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { sendResetPasswordEmail, sendTwoFactorCode } from "./email";
import { eq } from "drizzle-orm";

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
      twoFactor: schema.twoFactor,
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
  plugins: [
    nextCookies(),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          // Armazenar código na tabela verification com expiração de 10 minutos
          const expiresAt = new Date();
          expiresAt.setMinutes(expiresAt.getMinutes() + 10);

          // Deletar códigos anteriores do mesmo usuário
          await db
            .delete(schema.verification)
            .where(eq(schema.verification.identifier, user.email));

          // Inserir novo código
          await db.insert(schema.verification).values({
            identifier: user.email,
            value: otp,
            expiresAt: expiresAt,
          });

          console.log("=== BETTER AUTH GEROU CÓDIGO ===");
          console.log("Email:", user.email);
          console.log("Código:", otp);
          console.log("Expira em:", expiresAt);
          console.log("================================");

          // Enviar código por email
          await sendTwoFactorCode(user.email, otp);
        },
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
