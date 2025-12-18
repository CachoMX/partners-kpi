import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft, DollarSign, Calendar, Repeat } from 'lucide-react';
import { useGetDeal } from '../../api/get-deal';
import { useDeleteDeal } from '../../api/delete-deal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/utils/format';
import { useToast } from '@/hooks/use-toast';
import type { DealStatus, DealTier } from '../../types/deal.types';

interface DealDetailProps {
  dealId: string;
}

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

export function DealDetail({ dealId }: DealDetailProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: deal, isLoading } = useGetDeal(dealId);
  const deleteDeal = useDeleteDeal();

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete this deal? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteDeal.mutateAsync(dealId);
      toast({
        title: 'Deal deleted',
        description: 'Successfully deleted deal.',
      });
      navigate('/deals');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete deal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-[var(--color-text-secondary)]">
        Loading deal...
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--color-text-secondary)]">Deal not found</p>
        <Button onClick={() => navigate('/deals')} className="mt-4">
          Back to Deals
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/deals')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Deal Details
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              {deal.lead?.lead_name || 'Unknown Lead'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/deals/${dealId}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Deal Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Deal Value</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {formatCurrency(deal.deal_value)}
          </p>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Commission ({deal.commission_percent}%)</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {formatCurrency(deal.commission_amount || 0)}
          </p>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
            <Repeat className="h-4 w-4" />
            <span className="text-sm font-medium">Deal Type</span>
          </div>
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">
            {deal.is_recurring ? (
              <Badge variant="info" className="text-base">
                {deal.recurring_frequency
                  ? deal.recurring_frequency.charAt(0).toUpperCase() +
                    deal.recurring_frequency.slice(1)
                  : 'Recurring'}
              </Badge>
            ) : (
              'One-time'
            )}
          </p>
        </div>
      </div>

      {/* Deal Information */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          Deal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Lead Name
            </label>
            <p className="text-[var(--color-text-primary)] mt-1">
              {deal.lead ? (
                <Link
                  to={`/leads/${deal.lead_id}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {deal.lead.lead_name}
                </Link>
              ) : (
                'Unknown'
              )}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Partner
            </label>
            <p className="text-[var(--color-text-primary)] mt-1">
              {deal.lead?.partner ? (
                <Link
                  to={`/partners/${deal.lead.partner_id}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {deal.lead.partner.company_name}
                </Link>
              ) : (
                '-'
              )}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Status
            </label>
            <div className="mt-1">
              <Badge variant={getStatusVariant(deal.status)}>
                {deal.status.charAt(0).toUpperCase() +
                  deal.status.slice(1).replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Tier
            </label>
            <div className="mt-1">
              {deal.tier ? (
                <Badge variant={getTierVariant(deal.tier)}>
                  {deal.tier.charAt(0).toUpperCase() + deal.tier.slice(1)}
                </Badge>
              ) : (
                <span className="text-[var(--color-text-muted)]">No tier</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Close Date
            </label>
            <p className="text-[var(--color-text-primary)] mt-1 flex items-center gap-2">
              {deal.close_date ? (
                <>
                  <Calendar className="h-4 w-4 text-[var(--color-text-secondary)]" />
                  {formatDate(deal.close_date)}
                </>
              ) : (
                <span className="text-[var(--color-text-muted)]">Not set</span>
              )}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Created
            </label>
            <p className="text-[var(--color-text-primary)] mt-1">
              {formatDate(deal.created_at)}
            </p>
          </div>
        </div>

        {deal.notes && (
          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Notes
            </label>
            <p className="text-[var(--color-text-primary)] mt-2 whitespace-pre-wrap">
              {deal.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
