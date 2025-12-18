import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '../../api/get-profile';
import { useUpdateProfile } from '../../api/update-profile';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UpdateProfileInput } from '../../types/profile.types';

const profileSchema = z.object({
  full_name: z.string().optional(),
  business_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

export function ProfileForm() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);
  const updateProfileMutation = useUpdateProfile();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        business_name: profile.business_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zip_code: profile.zip_code || '',
        country: profile.country || '',
        website: profile.website || '',
        bio: profile.bio || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: UpdateProfileInput) => {
    if (!user?.id) return;

    try {
      setIsSaving(true);
      await updateProfileMutation.mutateAsync({
        userId: user.id,
        input: data,
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ color: 'var(--color-text-secondary)' }}>Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        {/* Full Name */}
        <div className="form-group">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            type="text"
            {...register('full_name')}
            placeholder="John Doe"
          />
          {errors.full_name && (
            <p className="text-small mt-1" style={{ color: 'var(--color-danger)' }}>
              {errors.full_name.message}
            </p>
          )}
        </div>

        {/* Business Name */}
        <div className="form-group">
          <Label htmlFor="business_name">Business Name</Label>
          <Input
            id="business_name"
            type="text"
            {...register('business_name')}
            placeholder="Acme Corp"
          />
          {errors.business_name && (
            <p className="text-small mt-1" style={{ color: 'var(--color-danger)' }}>
              {errors.business_name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="text-small mt-1" style={{ color: 'var(--color-danger)' }}>
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Website */}
        <div className="form-group">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            {...register('website')}
            placeholder="https://example.com"
          />
          {errors.website && (
            <p className="text-small mt-1" style={{ color: 'var(--color-danger)' }}>
              {errors.website.message}
            </p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="form-group">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          {...register('address')}
          placeholder="123 Main Street"
        />
        {errors.address && (
          <p className="text-small mt-1" style={{ color: 'var(--color-danger)' }}>
            {errors.address.message}
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        {/* City */}
        <div className="form-group">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            type="text"
            {...register('city')}
            placeholder="New York"
          />
        </div>

        {/* State */}
        <div className="form-group">
          <Label htmlFor="state">State / Province</Label>
          <Input
            id="state"
            type="text"
            {...register('state')}
            placeholder="NY"
          />
        </div>

        {/* Zip Code */}
        <div className="form-group">
          <Label htmlFor="zip_code">Zip / Postal Code</Label>
          <Input
            id="zip_code"
            type="text"
            {...register('zip_code')}
            placeholder="10001"
          />
        </div>

        {/* Country */}
        <div className="form-group">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            type="text"
            {...register('country')}
            placeholder="United States"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="form-group">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          {...register('bio')}
          placeholder="Tell us a bit about yourself or your business..."
          rows={4}
        />
        {errors.bio && (
          <p className="text-small mt-1" style={{ color: 'var(--color-danger)' }}>
            {errors.bio.message}
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-6">
        <Button
          type="submit"
          disabled={!isDirty || isSaving}
          className="btn-primary"
        >
          {isSaving ? 'Saving...' : 'Save Profile'}
        </Button>
        <Button
          type="button"
          onClick={() => reset()}
          disabled={!isDirty}
          variant="ghost"
          className="btn-ghost"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
