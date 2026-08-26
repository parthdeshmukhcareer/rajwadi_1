import { Errors } from '../../utils/errors.js';

export class UploadsController {
  constructor(uploadsService) {
    this.uploadsService = uploadsService;
  }

  uploadImage = async (req, reply) => {
    const { productId } = req.params;
    
    const data = await req.file();
    if (!data) {
      throw Errors.VALIDATION_ERROR('No file uploaded');
    }

    const fileBuffer = await data.toBuffer();
    
    let variantId = null;
    if (data.fields.variantId) {
      variantId = data.fields.variantId.value;
    }

    const image = await this.uploadsService.uploadProductImage(
      productId,
      fileBuffer,
      data.mimetype,
      data.filename,
      variantId
    );

    return reply.status(201).send({ success: true, data: image });
  }

  deleteImage = async (req, reply) => {
    const { id } = req.params;
    await this.uploadsService.deleteProductImage(id);
    return reply.send({ success: true, data: { message: 'Image deleted successfully' } });
  }
}
