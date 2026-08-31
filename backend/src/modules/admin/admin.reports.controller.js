export class AdminReportsController {
  constructor(adminReportsService) {
    this.adminReportsService = adminReportsService;
  }

  getSalesReport = async (req, reply) => {
    // Auth is handled by middleware
    const { range, startDate, endDate } = req.query;
    
    // Validate custom dates if provided
    if (range === 'custom') {
      if (!startDate || !endDate) {
        return reply.code(400).send({ success: false, message: 'startDate and endDate are required for custom range' });
      }
      if (new Date(startDate) > new Date(endDate)) {
        return reply.code(400).send({ success: false, message: 'startDate must be before or equal to endDate' });
      }
    }
    
    const data = await this.adminReportsService.getSalesReport({ range, startDate, endDate });
    return reply.send({ success: true, data });
  }
}
