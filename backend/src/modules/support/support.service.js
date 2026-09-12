import { db } from '../../db/index.js';
import { supportQueries } from '../../db/schema/index.js';
import { whatsappService } from '../../services/whatsapp.service.js';
import { emailService } from '../../services/email.service.js';

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
    
    // Send email notification to owner
    try {
      console.log('New Support Query:', query.id);
      await emailService.sendSupportQueryNotification(query);
    } catch (err) {
      console.error('Failed to notify owner about support query via email', err);
    }
    
    return query;
  }
}
