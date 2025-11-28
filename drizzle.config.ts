import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config = {
  schema: "./db/drizzle/schema.ts",
  out: "./db/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};

export default config;
