export class AdminDashboardController {
  constructor(adminDashboardService) {
    this.adminDashboardService = adminDashboardService;
  }

  getDashboard = async (req, reply) => {
    // Auth is handled by middleware
    const data = await this.adminDashboardService.getOverview();
    return reply.send({ success: true, data });
  }
}
