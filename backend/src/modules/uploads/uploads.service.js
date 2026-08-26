import { cloudinary } from '../../config/cloudinary.js';
import { Errors } from '../../utils/errors.js';
import { db } from '../../db/index.js';
import { productImages, products } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { env } from '../../config/env.js';
import crypto from 'crypto';

export class UploadsService {
  async uploadProductImage(productId, fileBuffer, mimeType, filename, variantId = null) {
    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimes.includes(mimeType)) {
      throw Errors.INVALID_IMAGE('Only JPEG, PNG, and WEBP formats are allowed.');
    }

    const maxSize = env.MAX_IMAGE_SIZE_MB * 1024 * 1024;
    if (fileBuffer.length > maxSize) {
      throw Errors.INVALID_IMAGE(`Image size must not exceed ${env.MAX_IMAGE_SIZE_MB}MB.`);
    }

    const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!product) throw Errors.PRODUCT_NOT_FOUND();

    const existingImages = await db.select().from(productImages).where(eq(productImages.productId, productId));
    if (existingImages.length >= env.MAX_PRODUCT_IMAGES) {
      throw Errors.VALIDATION_ERROR(`A product cannot have more than ${env.MAX_PRODUCT_IMAGES} images.`);
    }

    const uniqueSuffix = crypto.randomBytes(4).toString('hex');
    const safeName = filename.replace(/[^a-zA-Z0-9]/g, '_');
    const publicId = `rajwadi/products/${productId}/${safeName}_${uniqueSuffix}`;

    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });

      const [newImage] = await db.insert(productImages).values({
        productId,
        variantId: variantId || null,
        cloudinaryPublicId: uploadResult.public_id,
        imageUrl: uploadResult.secure_url,
        sortOrder: existingImages.length,
      }).returning();

      return newImage;
    } catch (error) {
      throw Errors.IMAGE_UPLOAD_FAILED(error.message);
    }
  }

  async deleteProductImage(imageId) {
    const [image] = await db.select().from(productImages).where(eq(productImages.id, imageId)).limit(1);
    if (!image) throw Errors.IMAGE_NOT_FOUND();

    // 1. Delete from Cloudinary
    try {
      const result = await cloudinary.uploader.destroy(image.cloudinaryPublicId);
      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error('Cloudinary deletion failed');
      }
    } catch (error) {
      throw Errors.IMAGE_UPLOAD_FAILED(`Failed to delete asset from Cloudinary: ${error.message}`);
    }

    // 2. Delete from DB
    await db.delete(productImages).where(eq(productImages.id, imageId));
  }
}
