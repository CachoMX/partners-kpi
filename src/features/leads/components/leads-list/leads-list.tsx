import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useLeads } from '../../api/get-leads';
import { useDeleteLead } from '../../api/delete-lead';
import { useGetPartners } from '@/features/partners/api/get-partners';
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
import { formatDate } from '@/utils/format';
import type { LeadFilters, LeadStatus, LeadDirection } from '../../types/lead.types';
import { LEAD_STATUSES, LEAD_DIRECTIONS } from '../../types/lead.types';
import { useToast } from '@/hooks/use-toast';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Engaged':
      return 'info';
    case 'Booked Call':
      return 'warning';
    case 'Proposal Sent':
      return 'default';
    case 'Closed':
      return 'success';
    default:
      return 'secondary';
  }
};

const getDirectionLabel = (direction: LeadDirection) => {
  return direction === 'made' ? 'Made' : 'Received';
};

export function LeadsList() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<LeadFilters>({});
  const { data: leads, isLoading } = useLeads(filters);
  const { data: partners } = useGetPartners();
  const deleteLead = useDeleteLead();

  const handleDelete = async (id: string, leadName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the lead "${leadName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteLead.mutateAsync(id);
      toast({
        title: 'Lead deleted',
        description: `Successfully deleted lead "${leadName}".`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete lead. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFilterChange = (key: keyof LeadFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Leads & Intros
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Track all your partnership introductions and their status
          </p>
        </div>
        <Link to="/leads/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        </Link>
      </div>

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Partner
            </label>
            <Select
              value={filters.partner_id || 'all'}
              onValueChange={(value) => handleFilterChange('partner_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All partners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All partners</SelectItem>
                {partners?.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Direction
            </label>
            <Select
              value={filters.direction || 'all'}
              onValueChange={(value) =>
                handleFilterChange('direction', value as LeadDirection)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All directions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All directions</SelectItem>
                {LEAD_DIRECTIONS.map((dir) => (
                  <SelectItem key={dir.value} value={dir.value}>
                    {dir.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Status
            </label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                handleFilterChange('status', value as LeadStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {LEAD_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
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

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[var(--color-text-secondary)]">
            Loading leads...
          </div>
        ) : !leads || leads.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[var(--color-text-secondary)]">
              {hasActiveFilters
                ? 'No leads match your filters.'
                : 'No leads yet. Create your first lead to get started!'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Intro Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    <Link
                      to={`/leads/${lead.id}`}
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      {lead.lead_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {lead.lead_company || (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.partner ? (
                      <Link
                        to={`/partners/${lead.partner_id}`}
                        className="text-[var(--color-accent)] hover:underline"
                      >
                        {lead.partner.company_name}
                      </Link>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getDirectionLabel(lead.direction)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(lead.intro_date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/leads/${lead.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(lead.id, lead.lead_name)}
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

      {leads && leads.length > 0 && (
        <div className="text-sm text-[var(--color-text-secondary)]">
          Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
