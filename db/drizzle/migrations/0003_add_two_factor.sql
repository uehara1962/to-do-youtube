CREATE TABLE "twoFactor" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "secret" text,
  "backup_codes" jsonb,
  "enabled" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "twoFactor"
ADD CONSTRAINT "twoFactor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "twoFactor"
ADD CONSTRAINT "twoFactor_user_id_unique" UNIQUE("user_id");