CREATE TABLE "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'received' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
