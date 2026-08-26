CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"short_description" text,
	"description" text,
	"base_price" integer NOT NULL,
	"compare_at_price" integer,
	"fabric" varchar(255),
	"work_type" varchar(255),
	"occasion" varchar(255),
	"care_instruction" text,
	"hsn_code" varchar(20),
	"gst_rate" integer NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "prod_price_check" CHECK ("products"."base_price" >= 0),
	CONSTRAINT "prod_compare_price_check" CHECK ("products"."compare_at_price" IS NULL OR "products"."compare_at_price" >= "products"."base_price"),
	CONSTRAINT "prod_gst_check" CHECK ("products"."gst_rate" >= 0)
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" varchar(100) NOT NULL,
	"size" varchar(50),
	"color" varchar(50),
	"price" integer NOT NULL,
	"compare_at_price" integer,
	"stock_on_hand" integer DEFAULT 0 NOT NULL,
	"reserved_stock" integer DEFAULT 0 NOT NULL,
	"weight_grams" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_sku_unique" UNIQUE("sku"),
	CONSTRAINT "pv_price_check" CHECK ("product_variants"."price" >= 0),
	CONSTRAINT "pv_compare_price_check" CHECK ("product_variants"."compare_at_price" IS NULL OR "product_variants"."compare_at_price" >= "product_variants"."price"),
	CONSTRAINT "pv_stock_on_hand_check" CHECK ("product_variants"."stock_on_hand" >= 0),
	CONSTRAINT "pv_reserved_stock_check" CHECK ("product_variants"."reserved_stock" >= 0),
	CONSTRAINT "pv_stock_safety_check" CHECK ("product_variants"."reserved_stock" <= "product_variants"."stock_on_hand"),
	CONSTRAINT "pv_weight_check" CHECK ("product_variants"."weight_grams" IS NULL OR "product_variants"."weight_grams" >= 0)
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"cloudinary_public_id" varchar(255) NOT NULL,
	"image_url" text NOT NULL,
	"thumbnail_url" text,
	"alt_text" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cat_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "cat_is_active_idx" ON "categories" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "prod_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "prod_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "prod_is_active_idx" ON "products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "prod_is_featured_idx" ON "products" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "prod_created_at_idx" ON "products" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "pv_product_id_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pv_sku_idx" ON "product_variants" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "pv_is_active_idx" ON "product_variants" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "pi_product_id_idx" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "pi_variant_id_idx" ON "product_images" USING btree ("variant_id");