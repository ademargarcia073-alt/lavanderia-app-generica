CREATE TABLE "address" (
	"user_id" text PRIMARY KEY NOT NULL,
	"referencia" text NOT NULL,
	"telefono" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "item_category" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "quantity" integer;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "delivery_address" text;--> statement-breakpoint
ALTER TABLE "contact_info" ADD COLUMN "role" text DEFAULT 'customer' NOT NULL;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;