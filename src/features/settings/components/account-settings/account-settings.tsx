import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const changeEmailSchema = z.object({
  newEmail: z.string().email('Invalid email address'),
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

export function AccountSettings() {
  const { user, signOut } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const emailForm = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
  });

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      setIsChangingPassword(true);
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully',
      });

      passwordForm.reset();
      setShowPasswordForm(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update password',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleChangeEmail = async (data: ChangeEmailFormData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.newEmail,
      });

      if (error) throw error;

      toast({
        title: 'Email update initiated',
        description: 'Please check your new email address to confirm the change',
      });

      emailForm.reset();
      setShowEmailForm(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update email',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast({
        title: 'Invalid confirmation',
        description: 'You must type "DELETE" exactly to confirm',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsDeleting(true);

      // Delete user account through Supabase Admin API
      // Note: This requires proper RLS policies and might need a server function
      const { error } = await supabase.rpc('delete_user_account');

      if (error) {
        // If RPC doesn't exist, show message to contact support
        toast({
          title: 'Account Deletion',
          description: 'Please contact support to delete your account. All your data will be removed.',
          variant: 'destructive',
        });
        setShowDeleteDialog(false);
        return;
      }

      toast({
        title: 'Account deleted',
        description: 'Your account has been deleted successfully',
      });

      await signOut();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete account',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
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
      {/* Email Section */}
      <div className="mb-6">
        <h3 className="text-h3 mb-3">Email Address</h3>
        <div className="form-group">
          <Label>Current Email</Label>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <Input type="email" value={user?.email || ''} disabled style={{ flex: 1 }} />
            {!showEmailForm && (
              <Button
                onClick={() => setShowEmailForm(true)}
                variant="secondary"
                className="btn-secondary"
              >
                Change Email
              </Button>
            )}
          </div>
        </div>

        {showEmailForm && (
          <form onSubmit={emailForm.handleSubmit(handleChangeEmail)} className="mt-4">
            <div className="form-group">
              <Label htmlFor="newEmail">New Email Address</Label>
              <Input
                id="newEmail"
                type="email"
                {...emailForm.register('newEmail')}
                placeholder="new.email@example.com"
              />
              {emailForm.formState.errors.newEmail && (
                <p className="text-small mt-1" style={{ color: 'var(--color-danger)' }}>
                  {emailForm.formState.errors.newEmail.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="btn-primary">
                Update Email
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowEmailForm(false);
                  emailForm.reset();
                }}
                variant="ghost"
                className="btn-ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {user?.created_at && (
          <p className="text-small mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            Member since {formatDate(user.created_at)}
          </p>
        )}
      </div>

      <div className="divider"></div>

      {/* Password Section */}
      <div className="mb-6 mt-6">
        <h3 className="text-h3 mb-3">Password</h3>
        {!showPasswordForm ? (
          <Button
            onClick={() => setShowPasswordForm(true)}
            variant="secondary"
            className="btn-secondary"
          >
            Change Password
          </Button>
        ) : (
          <form onSubmit={passwordForm.handleSubmit(handleChangePassword)}>
            <div className="form-group">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...passwordForm.register('newPassword')}
                placeholder="Enter new password"
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-small mt-1" style={{ color: 'var(--color-danger)' }}>
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...passwordForm.register('confirmPassword')}
                placeholder="Confirm new password"
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-small mt-1" style={{ color: 'var(--color-danger)' }}>
                  {passwordForm.formState.errors.confirmPassword.message}
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
                  passwordForm.reset();
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

      {/* Account Actions */}
      <div className="mt-6">
        <h3 className="text-h3 mb-3">Account Actions</h3>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button onClick={signOut} variant="secondary" className="btn-secondary">
            Sign Out
          </Button>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="btn-danger"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--color-danger)', fontSize: '1.5rem', fontWeight: 'bold' }}>
              ⚠️ Delete Account
            </DialogTitle>
            <DialogDescription style={{ color: 'var(--color-text-primary)', fontSize: '1rem', marginTop: 'var(--space-2)' }}>
              Are you absolutely sure? This will <strong style={{ color: 'var(--color-danger)' }}>PERMANENTLY DELETE</strong> your account and all associated data including partners, leads, and deals. This action <strong style={{ color: 'var(--color-danger)' }}>CANNOT</strong> be undone!
            </DialogDescription>
          </DialogHeader>

          <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
            <Label htmlFor="confirmDelete" style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Type <code style={{
                backgroundColor: 'var(--color-bg-primary)',
                padding: '2px 6px',
                borderRadius: '4px',
                color: 'var(--color-danger)',
                fontWeight: 'bold'
              }}>DELETE</code> to confirm:
            </Label>
            <Input
              id="confirmDelete"
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              autoComplete="off"
              style={{
                marginTop: 'var(--space-2)',
                borderColor: deleteConfirmText === 'DELETE' ? 'var(--color-success)' : 'var(--color-border)'
              }}
            />
            <p className="text-small" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
              You must type "DELETE" exactly (in all caps)
            </p>
          </div>

          <DialogFooter style={{ marginTop: 'var(--space-4)' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmText('');
              }}
              disabled={isDeleting}
              style={{ marginRight: 'var(--space-2)' }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting || deleteConfirmText !== 'DELETE'}
              style={{
                opacity: deleteConfirmText !== 'DELETE' ? 0.5 : 1,
                cursor: deleteConfirmText !== 'DELETE' ? 'not-allowed' : 'pointer'
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
