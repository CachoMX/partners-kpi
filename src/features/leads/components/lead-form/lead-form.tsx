import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useGetPartners } from '@/features/partners/api/get-partners';
import { useCreateLead } from '../../api/create-lead';
import { useUpdateLead } from '../../api/update-lead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Lead } from '../../types/lead.types';
import { LEAD_STATUSES, LEAD_DIRECTIONS } from '../../types/lead.types';

const leadSchema = z.object({
  partner_id: z.string().min(1, 'Partner is required'),
  direction: z.enum(['made', 'received'], {
    required_error: 'Direction is required',
  }),
  lead_name: z.string().min(1, 'Lead name is required'),
  lead_company: z.string().optional(),
  contact_info: z.string().optional(),
  intro_date: z.string().min(1, 'Intro date is required'),
  communication_method: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  lead?: Lead;
  mode?: 'create' | 'edit';
}

export function LeadForm({ lead, mode = 'create' }: LeadFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: partners, isLoading: partnersLoading } = useGetPartners();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      partner_id: lead?.partner_id || '',
      direction: lead?.direction || 'made',
      lead_name: lead?.lead_name || '',
      lead_company: lead?.lead_company || '',
      contact_info: lead?.contact_info || '',
      intro_date: lead?.intro_date || new Date().toISOString().split('T')[0],
      communication_method: lead?.communication_method || '',
      status: lead?.status || 'Engaged',
      notes: lead?.notes || '',
    },
  });

  const selectedPartnerId = watch('partner_id');
  const selectedDirection = watch('direction');
  const selectedStatus = watch('status');

  useEffect(() => {
    if (lead) {
      setValue('partner_id', lead.partner_id);
      setValue('direction', lead.direction);
      setValue('lead_name', lead.lead_name);
      setValue('lead_company', lead.lead_company || '');
      setValue('contact_info', lead.contact_info || '');
      setValue('intro_date', lead.intro_date);
      setValue('communication_method', lead.communication_method || '');
      setValue('status', lead.status);
      setValue('notes', lead.notes || '');
    }
  }, [lead, setValue]);

  const onSubmit = async (data: LeadFormData) => {
    try {
      if (mode === 'create') {
        await createLead.mutateAsync({
          partner_id: data.partner_id,
          direction: data.direction,
          lead_name: data.lead_name,
          lead_company: data.lead_company || null,
          contact_info: data.contact_info || null,
          intro_date: data.intro_date,
          communication_method: data.communication_method || null,
          status: data.status,
          notes: data.notes || null,
        });

        toast({
          title: 'Lead created',
          description: `Successfully created lead "${data.lead_name}".`,
        });

        navigate('/leads');
      } else if (lead) {
        await updateLead.mutateAsync({
          id: lead.id,
          data: {
            partner_id: data.partner_id,
            direction: data.direction,
            lead_name: data.lead_name,
            lead_company: data.lead_company || null,
            contact_info: data.contact_info || null,
            intro_date: data.intro_date,
            communication_method: data.communication_method || null,
            status: data.status,
            notes: data.notes || null,
          },
          previousStatus: lead.status,
        });

        toast({
          title: 'Lead updated',
          description: `Successfully updated lead "${data.lead_name}".`,
        });

        navigate(`/leads/${lead.id}`);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${mode === 'create' ? 'create' : 'update'} lead. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? 'Create New Lead' : 'Edit Lead'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="partner_id">
                  Partner <span className="text-[var(--color-danger)]">*</span>
                </Label>
                <Select
                  value={selectedPartnerId}
                  onValueChange={(value) => setValue('partner_id', value)}
                  disabled={partnersLoading}
                >
                  <SelectTrigger id="partner_id">
                    <SelectValue placeholder="Select a partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners?.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.partner_id && (
                  <p className="text-sm text-[var(--color-danger)] mt-1">
                    {errors.partner_id.message}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Direction <span className="text-[var(--color-danger)]">*</span>
                </Label>
                <div className="flex gap-4 mt-2">
                  {LEAD_DIRECTIONS.map((dir) => (
                    <label
                      key={dir.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={dir.value}
                        checked={selectedDirection === dir.value}
                        onChange={(e) =>
                          setValue('direction', e.target.value as 'made' | 'received')
                        }
                        className="w-4 h-4 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                      />
                      <span className="text-sm text-[var(--color-text-primary)]">
                        {dir.label}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.direction && (
                  <p className="text-sm text-[var(--color-danger)] mt-1">
                    {errors.direction.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lead_name">
                  Lead Name <span className="text-[var(--color-danger)]">*</span>
                </Label>
                <Input
                  id="lead_name"
                  {...register('lead_name')}
                  placeholder="John Doe"
                />
                {errors.lead_name && (
                  <p className="text-sm text-[var(--color-danger)] mt-1">
                    {errors.lead_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lead_company">Lead Company</Label>
                <Input
                  id="lead_company"
                  {...register('lead_company')}
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <Label htmlFor="contact_info">Contact Info</Label>
                <Input
                  id="contact_info"
                  {...register('contact_info')}
                  placeholder="john@acme.com or (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="intro_date">
                  Intro Date <span className="text-[var(--color-danger)]">*</span>
                </Label>
                <Input id="intro_date" type="date" {...register('intro_date')} />
                {errors.intro_date && (
                  <p className="text-sm text-[var(--color-danger)] mt-1">
                    {errors.intro_date.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="communication_method">
                  Communication Method
                </Label>
                <Input
                  id="communication_method"
                  {...register('communication_method')}
                  placeholder="Email, Phone, LinkedIn, etc."
                />
              </div>

              <div>
                <Label htmlFor="status">
                  Status <span className="text-[var(--color-danger)]">*</span>
                </Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => setValue('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-[var(--color-danger)] mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Additional notes about this intro or lead..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? mode === 'create'
                    ? 'Creating...'
                    : 'Updating...'
                  : mode === 'create'
                  ? 'Create Lead'
                  : 'Update Lead'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
