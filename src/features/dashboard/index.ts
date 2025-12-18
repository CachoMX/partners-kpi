// Public API for dashboard feature
export { DashboardOverview } from './components/dashboard-overview/dashboard-overview';
export { StatsCard } from './components/stats-card/stats-card';
export { TopPartners } from './components/top-partners/top-partners';
export { RecentActivity } from './components/recent-activity/recent-activity';

export { useGetDashboardStats, useGetTopPartners, useGetRecentLeads } from './api/get-dashboard-stats';

export type { DashboardStats, TopPartner, RecentLead } from './types/dashboard.types';
