import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ChangePasswordFormData } from '../../types/settings.types';

const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function UserProfile() {
  const { user, signOut } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      setIsChangingPassword(true);
      const { error } = await auth.updatePassword(data.newPassword);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Password updated successfully',
        variant: 'default',
      });

      reset();
      setShowPasswordForm(false);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update password',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="mb-6">
        <div className="form-group">
          <Label>Email</Label>
          <Input type="email" value={user?.email || ''} disabled />
          <p className="text-small mt-1">
            Your email address is used for authentication
          </p>
        </div>

        {user?.created_at && (
          <div className="form-group">
            <Label>Member Since</Label>
            <Input value={formatDate(user.created_at)} disabled />
          </div>
        )}
      </div>

      <div className="divider"></div>

      <div className="mb-6 mt-6">
        <h3 className="text-h3">Password</h3>
        {!showPasswordForm ? (
          <Button
            onClick={() => setShowPasswordForm(true)}
            variant="secondary"
            className="btn-secondary"
          >
            Change Password
          </Button>
        ) : (
          <form onSubmit={handleSubmit(handleChangePassword)}>
            <div className="form-group">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register('newPassword')}
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <p className="text-danger text-small mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-danger text-small mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="btn-primary"
              >
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  reset();
                }}
                variant="ghost"
                className="btn-ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      <div className="divider"></div>

      <div className="mt-6">
        <h3 className="text-h3">Account Actions</h3>
        <Button onClick={handleSignOut} variant="secondary" className="btn-secondary">
          Sign Out
        </Button>
      </div>
    </div>
  );
}
