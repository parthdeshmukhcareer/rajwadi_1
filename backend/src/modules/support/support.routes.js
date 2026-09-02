import { SupportController } from './support.controller.js';

export default async function supportRoutes(fastify, options) {
  const controller = new SupportController();

  fastify.post('/queries', controller.submitQuery);
}
