import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { StatsCard } from '../stats-card/stats-card';
import { TopPartners } from '../top-partners/top-partners';
import { RecentActivity } from '../recent-activity/recent-activity';
import {
  useGetDashboardStats,
  useGetTopPartners,
  useGetRecentLeads,
} from '../../api/get-dashboard-stats';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { DashboardFilters } from '../../types/dashboard.types';

export function DashboardOverview() {
  const [filters, setFilters] = useState<DashboardFilters>({});

  const { data: stats, isLoading: statsLoading, error: statsError } = useGetDashboardStats(filters);
  const {
    data: topPartners,
    isLoading: partnersLoading,
    error: partnersError,
  } = useGetTopPartners(filters);
  const { data: recentLeads, isLoading: leadsLoading, error: leadsError } = useGetRecentLeads(filters);

  const handleFilterChange = (key: keyof DashboardFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  // Loading state
  if (statsLoading || partnersLoading || leadsLoading) {
    return (
      <div className="main-content">
        <h1 className="text-h1 mb-6">Dashboard</h1>
        <div className="card-grid">
          <div className="card-report">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
          <div className="card-report">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
          <div className="card-report">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
          <div className="card-report">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (statsError || partnersError || leadsError) {
    const error = statsError || partnersError || leadsError;
    return (
      <div className="main-content">
        <h1 className="text-h1 mb-6">Dashboard</h1>
        <div className="alert alert-danger">
          <strong>Error loading dashboard:</strong>{' '}
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1" style={{ margin: 0 }}>Dashboard</h1>
      </div>

      {/* Date Range Filter */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
            Filter by Date Range
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              From Date
            </label>
            <Input
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              To Date
            </label>
            <Input
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
            />
          </div>
          <div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="card-grid mb-6">
        <StatsCard title="Total Partners" value={stats?.totalPartners || 0} />
        <StatsCard title="Total Leads" value={stats?.totalLeads || 0} />
        <StatsCard title="Intros Made" value={stats?.leadsMade || 0} />
        <StatsCard title="Intros Received" value={stats?.leadsReceived || 0} />
      </div>

      {/* Status Pipeline Breakdown */}
      <div className="mb-6">
        <div className="card">
          <h2 className="text-h2 mb-4">Lead Pipeline</h2>
          <div className="card-grid">
            <div className="card-report">
              <div className="stat-value">{stats?.statusBreakdown.engaged || 0}</div>
              <div className="stat-label">Engaged</div>
            </div>
            <div className="card-report">
              <div className="stat-value">
                {stats?.statusBreakdown.bookedCall || 0}
              </div>
              <div className="stat-label">Booked Call</div>
            </div>
            <div className="card-report">
              <div className="stat-value">
                {stats?.statusBreakdown.proposalSent || 0}
              </div>
              <div className="stat-label">Proposal Sent</div>
            </div>
            <div className="card-report">
              <div className="stat-value">{stats?.statusBreakdown.closed || 0}</div>
              <div className="stat-label">Closed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Partners and Recent Activity in 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <TopPartners partners={topPartners || []} />
        <RecentActivity leads={recentLeads || []} />
      </div>
    </div>
  );
}
