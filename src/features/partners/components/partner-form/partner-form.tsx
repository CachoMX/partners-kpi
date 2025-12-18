import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCreatePartner } from '../../api/create-partner';
import { useUpdatePartner } from '../../api/update-partner';
import { useGetPartner } from '../../api/get-partner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { CreatePartnerDTO } from '../../types/partner.types';

const partnerSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  contact_name: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  services: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

interface PartnerFormProps {
  partnerId?: string;
}

export function PartnerForm({ partnerId }: PartnerFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!partnerId;

  const { data: partner, isLoading: isLoadingPartner } = useGetPartner(partnerId);
  const createPartnerMutation = useCreatePartner();
  const updatePartnerMutation = useUpdatePartner(partnerId || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      services: '',
      website: '',
      location: '',
      notes: '',
    },
  });

  // Reset form when partner data is loaded
  useEffect(() => {
    if (partner) {
      reset({
        company_name: partner.company_name,
        contact_name: partner.contact_name || '',
        email: partner.email || '',
        phone: partner.phone || '',
        services: partner.services || '',
        website: partner.website || '',
        location: partner.location || '',
        notes: partner.notes || '',
      });
    }
  }, [partner, reset]);

  const onSubmit = async (data: PartnerFormData) => {
    try {
      const partnerData: CreatePartnerDTO = {
        company_name: data.company_name,
        contact_name: data.contact_name || null,
        email: data.email || null,
        phone: data.phone || null,
        services: data.services || null,
        website: data.website || null,
        location: data.location || null,
        notes: data.notes || null,
      };

      if (isEditMode) {
        await updatePartnerMutation.mutateAsync(partnerData);
        toast({
          title: 'Partner updated',
          description: `${data.company_name} has been updated successfully.`,
        });
      } else {
        await createPartnerMutation.mutateAsync(partnerData);
        toast({
          title: 'Partner created',
          description: `${data.company_name} has been added successfully.`,
        });
      }

      navigate('/partners');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'create'} partner. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  if (isEditMode && isLoadingPartner) {
    return (
      <div className="main-content">
        <div className="skeleton skeleton-title mb-6"></div>
        <div className="card">
          <div className="skeleton" style={{ width: '100%', height: '400px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="mb-6">
        <Button
          className="btn btn-ghost mb-4"
          onClick={() => navigate('/partners')}
        >
          <ArrowLeft size={16} />
          Back to Partners
        </Button>
        <h1 className="text-h1">
          {isEditMode ? 'Edit Partner' : 'Add New Partner'}
        </h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="company_name">
              Company Name <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="company_name"
              type="text"
              className="form-input"
              placeholder="Enter company name"
              {...register('company_name')}
            />
            {errors.company_name && (
              <p className="text-small text-danger mt-1">
                {errors.company_name.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact_name">
              Contact Name
            </label>
            <input
              id="contact_name"
              type="text"
              className="form-input"
              placeholder="Enter contact name"
              {...register('contact_name')}
            />
          </div>

          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="contact@company.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-small text-danger mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                placeholder="(123) 456-7890"
                {...register('phone')}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="services">
              Services
            </label>
            <input
              id="services"
              type="text"
              className="form-input"
              placeholder="e.g., Web Design, Marketing, Consulting"
              {...register('services')}
            />
          </div>

          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="website">
                Website
              </label>
              <input
                id="website"
                type="url"
                className="form-input"
                placeholder="https://www.company.com"
                {...register('website')}
              />
              {errors.website && (
                <p className="text-small text-danger mt-1">
                  {errors.website.message}
                </p>
              )}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                type="text"
                className="form-input"
                placeholder="City, State"
                {...register('location')}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              className="form-textarea"
              placeholder="Additional notes about this partner..."
              rows={4}
              {...register('notes')}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                ? 'Update Partner'
                : 'Create Partner'}
            </Button>
            <Button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/partners')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
