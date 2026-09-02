import { db } from '../../db/index.js';
import { supportQueries } from '../../db/schema/index.js';
import { whatsappService } from '../../services/whatsapp.service.js';

export class SupportService {
  async createQuery(data) {
    const [query] = await db.insert(supportQueries).values({
      name: data.name,
      email: data.email,
      phone: data.phone,
      orderNumber: data.orderNumber || null,
      queryType: data.queryType,
      message: data.message,
      status: 'OPEN'
    }).returning();
    
    // Optionally log/send to whatsapp
    try {
      console.log('New Support Query:', query.id);
      // We could use whatsappService here if we want to notify owner of queries too.
    } catch (err) {
      console.error('Failed to notify owner about support query', err);
    }
    
    return query;
  }
}
