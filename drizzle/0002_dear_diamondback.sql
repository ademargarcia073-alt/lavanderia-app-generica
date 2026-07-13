CREATE TABLE "contact_info" (
	"user_id" text PRIMARY KEY NOT NULL,
	"last_name" text NOT NULL,
	"phone" text NOT NULL,
	"gender" text,
	"birth_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_info" ADD CONSTRAINT "contact_info_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;