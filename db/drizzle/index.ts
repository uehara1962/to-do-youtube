import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import * as schema from "./schema";

// Carregar variáveis de ambiente do .env.local
// Isso é necessário quando o arquivo é importado diretamente (ex: scripts de seed)
dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. " +
      "Please create a .env.local file with DATABASE_URL or set it as an environment variable."
  );
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
