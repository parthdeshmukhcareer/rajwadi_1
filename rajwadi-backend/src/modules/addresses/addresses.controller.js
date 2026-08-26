import { createAddressSchema, updateAddressSchema } from './addresses.schema.js';
import { Errors } from '../../utils/errors.js';

export class AddressesController {
  constructor(addressesService) {
    this.addressesService = addressesService;
  }

  getAll = async (req, reply) => {
    const userId = req.user.sub;
    const addresses = await this.addressesService.getAddresses(userId);
    return reply.send({ success: true, data: addresses });
  }

  create = async (req, reply) => {
    const userId = req.user.sub;
    const result = createAddressSchema.safeParse(req.body);
    if (!result.success) {
      throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    }
    const address = await this.addressesService.createAddress(userId, result.data);
    return reply.status(201).send({ success: true, data: address });
  }

  update = async (req, reply) => {
    const userId = req.user.sub;
    const { id } = req.params;
    
    const result = updateAddressSchema.safeParse(req.body);
    if (!result.success) {
      throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    }
    const address = await this.addressesService.updateAddress(userId, id, result.data);
    return reply.send({ success: true, data: address });
  }

  delete = async (req, reply) => {
    const userId = req.user.sub;
    const { id } = req.params;
    await this.addressesService.deleteAddress(userId, id);
    return reply.send({ success: true, data: { message: 'Address deleted' } });
  }
}
