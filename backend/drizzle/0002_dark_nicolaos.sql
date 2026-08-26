CREATE TABLE "carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "carts_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ci_quantity_check" CHECK ("cart_items"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"discount_type" varchar(20) NOT NULL,
	"discount_value" integer NOT NULL,
	"minimum_order_amount" integer,
	"maximum_discount_amount" integer,
	"starts_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"usage_limit" integer,
	"times_used" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code"),
	CONSTRAINT "coupon_code_uppercase_check" CHECK ("coupons"."code" = UPPER("coupons"."code")),
	CONSTRAINT "coupon_discount_value_check" CHECK ("coupons"."discount_value" >= 0),
	CONSTRAINT "coupon_min_order_check" CHECK ("coupons"."minimum_order_amount" IS NULL OR "coupons"."minimum_order_amount" >= 0),
	CONSTRAINT "coupon_max_discount_check" CHECK ("coupons"."maximum_discount_amount" IS NULL OR "coupons"."maximum_discount_amount" >= 0),
	CONSTRAINT "coupon_usage_limit_check" CHECK ("coupons"."usage_limit" IS NULL OR "coupons"."usage_limit" >= 0),
	CONSTRAINT "coupon_times_used_check" CHECK ("coupons"."times_used" >= 0),
	CONSTRAINT "coupon_percentage_check" CHECK ("coupons"."discount_type" != 'PERCENTAGE' OR ("coupons"."discount_value" >= 0 AND "coupons"."discount_value" <= 100))
);
--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cart_user_id_idx" ON "carts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ci_cart_id_idx" ON "cart_items" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "ci_variant_id_idx" ON "cart_items" USING btree ("variant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ci_cart_variant_idx" ON "cart_items" USING btree ("cart_id","variant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_code_idx" ON "coupons" USING btree ("code");--> statement-breakpoint
CREATE INDEX "coupon_is_active_idx" ON "coupons" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "coupon_expires_at_idx" ON "coupons" USING btree ("expires_at");