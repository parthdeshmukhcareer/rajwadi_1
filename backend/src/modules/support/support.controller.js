import { supportQuerySchema } from './support.schema.js';
import { SupportService } from './support.service.js';
import { Errors } from '../../utils/errors.js';

export class SupportController {
  constructor() {
    this.service = new SupportService();
  }

  submitQuery = async (req, reply) => {
    const result = supportQuerySchema.safeParse(req.body);
    if (!result.success) {
      throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    }

    const query = await this.service.createQuery(result.data);
    return reply.status(201).send({ success: true, data: query, message: 'Support query submitted successfully' });
  }
}
