CREATE SEQUENCE "public"."order_number_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"user_id" uuid NOT NULL,
	"status" varchar(50) DEFAULT 'PENDING_PAYMENT' NOT NULL,
	"payment_status" varchar(50) DEFAULT 'PENDING' NOT NULL,
	"subtotal" integer NOT NULL,
	"discount_total" integer DEFAULT 0 NOT NULL,
	"tax_total" integer NOT NULL,
	"shipping_total" integer NOT NULL,
	"grand_total" integer NOT NULL,
	"coupon_code" varchar(50),
	"shipping_address" jsonb NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "order_subtotal_check" CHECK ("orders"."subtotal" >= 0),
	CONSTRAINT "order_discount_check" CHECK ("orders"."discount_total" >= 0),
	CONSTRAINT "order_tax_check" CHECK ("orders"."tax_total" >= 0),
	CONSTRAINT "order_shipping_check" CHECK ("orders"."shipping_total" >= 0),
	CONSTRAINT "order_grand_total_check" CHECK ("orders"."grand_total" >= 0)
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"sku" varchar(100) NOT NULL,
	"size" varchar(50),
	"color" varchar(50),
	"unit_price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"discount_amount" integer DEFAULT 0 NOT NULL,
	"tax_amount" integer DEFAULT 0 NOT NULL,
	"line_total" integer NOT NULL,
	"product_image" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "order_order_number_idx" ON "orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "order_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "order_payment_status_idx" ON "orders" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "order_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "order_expires_at_idx" ON "orders" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "order_worker_idx" ON "orders" USING btree ("status","expires_at");--> statement-breakpoint
CREATE INDEX "oi_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "oi_variant_id_idx" ON "order_items" USING btree ("variant_id");