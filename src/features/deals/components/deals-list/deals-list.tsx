import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, DollarSign } from 'lucide-react';
import { useDeals } from '../../api/get-deals';
import { useDeleteDeal } from '../../api/delete-deal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { formatDate, formatCurrency } from '@/utils/format';
import type { DealFilters, DealStatus, DealTier } from '../../types/deal.types';
import { DEAL_STATUSES, DEAL_TIERS } from '../../types/deal.types';
import { useToast } from '@/hooks/use-toast';

const getStatusVariant = (status: DealStatus) => {
  switch (status) {
    case 'won':
      return 'success';
    case 'lost':
      return 'destructive';
    case 'on_hold':
      return 'warning';
    default:
      return 'secondary';
  }
};

const getTierVariant = (tier?: DealTier) => {
  switch (tier) {
    case 'platinum':
      return 'default';
    case 'gold':
      return 'warning';
    case 'silver':
      return 'secondary';
    case 'bronze':
      return 'outline';
    default:
      return 'secondary';
  }
};

export function DealsList() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<DealFilters>({});
  const { data: deals, isLoading } = useDeals(filters);
  const deleteDeal = useDeleteDeal();

  const handleDelete = async (id: string, leadName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the deal for "${leadName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteDeal.mutateAsync(id);
      toast({
        title: 'Deal deleted',
        description: `Successfully deleted deal for "${leadName}".`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete deal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFilterChange = (key: keyof DealFilters, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  // Calculate totals
  const wonDeals = deals?.filter((d) => d.status === 'won') || [];
  const totalValue = wonDeals.reduce((sum, deal) => sum + deal.deal_value, 0);
  const totalCommission = wonDeals.reduce(
    (sum, deal) => sum + (deal.commission_amount || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Deals & Commissions
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Track deal values, commissions, and revenue
          </p>
        </div>
        <Link to="/deals/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Deal
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Total Deal Value (Won)</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {formatCurrency(totalValue)}
          </p>
        </div>
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Total Commission (Won)</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {formatCurrency(totalCommission)}
          </p>
        </div>
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Won Deals</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {wonDeals.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Status
            </label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                handleFilterChange('status', value as DealStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {DEAL_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Tier
            </label>
            <Select
              value={filters.tier || 'all'}
              onValueChange={(value) => handleFilterChange('tier', value as DealTier)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tiers</SelectItem>
                {DEAL_TIERS.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Recurring
            </label>
            <Select
              value={
                filters.is_recurring === undefined
                  ? 'all'
                  : filters.is_recurring
                    ? 'true'
                    : 'false'
              }
              onValueChange={(value) =>
                handleFilterChange(
                  'is_recurring',
                  value === 'all' ? 'all' : value === 'true'
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All deals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All deals</SelectItem>
                <SelectItem value="true">Recurring only</SelectItem>
                <SelectItem value="false">One-time only</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
        </div>

        {hasActiveFilters && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Deals Table */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[var(--color-text-secondary)]">
            Loading deals...
          </div>
        ) : !deals || deals.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[var(--color-text-secondary)]">
              {hasActiveFilters
                ? 'No deals match your filters.'
                : 'No deals yet. Create your first deal to get started!'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Deal Value</TableHead>
                <TableHead>Commission %</TableHead>
                <TableHead>Commission $</TableHead>
                <TableHead>Recurring</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Close Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">
                    {deal.lead ? (
                      <Link
                        to={`/leads/${deal.lead_id}`}
                        className="text-[var(--color-accent)] hover:underline"
                      >
                        {deal.lead.lead_name}
                      </Link>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {deal.lead?.partner ? (
                      <Link
                        to={`/partners/${deal.lead.partner_id}`}
                        className="text-[var(--color-accent)] hover:underline"
                      >
                        {deal.lead.partner.company_name}
                      </Link>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(deal.deal_value)}</TableCell>
                  <TableCell>{deal.commission_percent}%</TableCell>
                  <TableCell>
                    {formatCurrency(deal.commission_amount || 0)}
                  </TableCell>
                  <TableCell>
                    {deal.is_recurring ? (
                      <Badge variant="info">
                        {deal.recurring_frequency || 'Yes'}
                      </Badge>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">One-time</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {deal.tier ? (
                      <Badge variant={getTierVariant(deal.tier)}>
                        {deal.tier.charAt(0).toUpperCase() + deal.tier.slice(1)}
                      </Badge>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(deal.status)}>
                      {deal.status.charAt(0).toUpperCase() +
                        deal.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {deal.close_date ? (
                      formatDate(deal.close_date)
                    ) : (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/deals/${deal.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDelete(
                            deal.id,
                            deal.lead?.lead_name || 'Unknown'
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {deals && deals.length > 0 && (
        <div className="text-sm text-[var(--color-text-secondary)]">
          Showing {deals.length} deal{deals.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
