import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetDeal } from '../../api/get-deal';
import { useCreateDeal } from '../../api/create-deal';
import { useUpdateDeal } from '../../api/update-deal';
import { useLeads } from '@/features/leads/api/get-leads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { DealStatus, DealTier } from '../../types/deal.types';
import { DEAL_STATUSES, DEAL_TIERS, RECURRING_FREQUENCIES } from '../../types/deal.types';

const dealSchema = z.object({
  lead_id: z.string().min(1, 'Lead is required'),
  deal_value: z.coerce
    .number()
    .min(0, 'Deal value must be positive')
    .max(10000000, 'Deal value seems too high'),
  commission_percent: z.coerce
    .number()
    .min(0, 'Commission percent must be at least 0')
    .max(100, 'Commission percent cannot exceed 100'),
  is_recurring: z.boolean(),
  recurring_frequency: z.enum(['monthly', 'quarterly', 'annually']).optional(),
  tier: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
  status: z.enum(['pending', 'won', 'lost', 'on_hold']),
  close_date: z.string().optional(),
  notes: z.string().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

interface DealFormProps {
  dealId?: string;
}

export function DealForm({ dealId }: DealFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!dealId;

  const { data: deal, isLoading: isLoadingDeal } = useGetDeal(dealId || '');
  const { data: leads } = useLeads();
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      deal_value: 0,
      commission_percent: 10,
      is_recurring: false,
      status: 'pending',
    },
  });

  const isRecurring = watch('is_recurring');

  useEffect(() => {
    if (deal && isEditMode) {
      setValue('lead_id', deal.lead_id);
      setValue('deal_value', deal.deal_value);
      setValue('commission_percent', deal.commission_percent);
      setValue('is_recurring', deal.is_recurring);
      setValue('recurring_frequency', deal.recurring_frequency);
      setValue('tier', deal.tier);
      setValue('status', deal.status);
      setValue('close_date', deal.close_date || '');
      setValue('notes', deal.notes || '');
    }
  }, [deal, isEditMode, setValue]);

  const onSubmit = async (data: DealFormData) => {
    try {
      const payload = {
        ...data,
        deal_value: Number(data.deal_value),
        commission_percent: Number(data.commission_percent),
        recurring_frequency: data.is_recurring ? data.recurring_frequency : undefined,
      };

      if (isEditMode && dealId) {
        await updateDeal.mutateAsync({
          id: dealId,
          input: payload,
        });
        toast({
          title: 'Success',
          description: 'Deal updated successfully.',
        });
      } else {
        await createDeal.mutateAsync(payload);
        toast({
          title: 'Success',
          description: 'Deal created successfully.',
        });
      }
      navigate('/deals');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save deal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isEditMode && isLoadingDeal) {
    return (
      <div className="p-8 text-center text-[var(--color-text-secondary)]">
        Loading deal...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          {isEditMode ? 'Edit Deal' : 'New Deal'}
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          {isEditMode
            ? 'Update deal information and commission details'
            : 'Create a new deal and track commission'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 space-y-6"
      >
        {/* Lead Selection */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Lead <span className="text-red-500">*</span>
          </label>
          <Select
            value={watch('lead_id') || ''}
            onValueChange={(value) => setValue('lead_id', value)}
            disabled={isEditMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a lead" />
            </SelectTrigger>
            <SelectContent>
              {leads?.map((lead) => (
                <SelectItem key={lead.id} value={lead.id}>
                  {lead.lead_name} - {lead.partner?.company_name || 'Unknown Partner'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.lead_id && (
            <p className="text-red-500 text-sm mt-1">{errors.lead_id.message}</p>
          )}
        </div>

        {/* Deal Value and Commission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Deal Value ($) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="10000"
              {...register('deal_value')}
            />
            {errors.deal_value && (
              <p className="text-red-500 text-sm mt-1">{errors.deal_value.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Commission Percent (%) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="10"
              {...register('commission_percent')}
            />
            {errors.commission_percent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.commission_percent.message}
              </p>
            )}
          </div>
        </div>

        {/* Recurring and Tier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Recurring Deal
            </label>
            <Select
              value={String(isRecurring)}
              onValueChange={(value) => setValue('is_recurring', value === 'true')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">One-time</SelectItem>
                <SelectItem value="true">Recurring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isRecurring && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Recurring Frequency
              </label>
              <Select
                value={watch('recurring_frequency') || ''}
                onValueChange={(value) =>
                  setValue('recurring_frequency', value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {RECURRING_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Tier and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Deal Tier
            </label>
            <Select
              value={watch('tier') || 'none'}
              onValueChange={(value) =>
                setValue('tier', value === 'none' ? undefined : (value as DealTier))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No tier</SelectItem>
                {DEAL_TIERS.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <Select
              value={watch('status') || ''}
              onValueChange={(value) => setValue('status', value as DealStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {DEAL_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Close Date */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Close Date
          </label>
          <Input type="date" {...register('close_date')} />
          {errors.close_date && (
            <p className="text-red-500 text-sm mt-1">{errors.close_date.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Notes
          </label>
          <Textarea
            placeholder="Additional notes about this deal..."
            rows={4}
            {...register('notes')}
          />
          {errors.notes && (
            <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Deal' : 'Create Deal'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/deals')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
