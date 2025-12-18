import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '@/stores/theme.store';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProfileForm } from '../profile-form/profile-form';
import { AccountSettings } from '../account-settings/account-settings';
import { LeadStatusSettings } from '../lead-status-settings/lead-status-settings';
import { DEFAULT_LEAD_STATUSES } from '../../utils/lead-statuses';
import type { DataStats } from '../../types/settings.types';

export function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const [defaultLeadStatus, setDefaultLeadStatus] = useState('Engaged');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [dataStats, setDataStats] = useState<DataStats>({
    partnersCount: 0,
    leadsCount: 0,
    storageUsed: 'N/A',
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isClearingData, setIsClearingData] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    loadDataStats();
  }, []);

  const loadDataStats = async () => {
    try {
      setIsLoadingStats(true);

      const [partnersResult, leadsResult] = await Promise.all([
        supabase.from('partners').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
      ]);

      setDataStats({
        partnersCount: partnersResult.count || 0,
        leadsCount: leadsResult.count || 0,
        storageUsed: 'N/A', // Storage calculation can be implemented later
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
    setDeleteConfirmText('');
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteConfirmText('');
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast({
        title: 'Invalid confirmation',
        description: 'You must type "DELETE" exactly to confirm',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsClearingData(true);

      // Delete all leads first (foreign key constraint)
      const { error: leadsError } = await supabase
        .from('leads')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (leadsError) throw leadsError;

      // Delete all partners
      const { error: partnersError } = await supabase
        .from('partners')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (partnersError) throw partnersError;

      toast({
        title: 'Success',
        description: 'All data has been deleted',
      });

      // Close dialog and reload stats
      handleCloseDeleteDialog();
      await loadDataStats();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to clear data',
        variant: 'destructive',
      });
    } finally {
      setIsClearingData(false);
    }
  };

  return (
    <div className="main-content">
      <div className="mb-6">
        <h1 className="text-h1">Settings</h1>
        <p className="text-secondary" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Manage your account, preferences, and application settings
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* User Profile Section */}
        <div className="card">
          <h2 className="text-h2 mb-4">Profile Information</h2>
          <p className="text-small mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Update your personal and business information
          </p>
          <ProfileForm />
        </div>

        {/* Account Settings Section */}
        <div className="card">
          <h2 className="text-h2 mb-4">Account Settings</h2>
          <p className="text-small mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your email, password, and account security
          </p>
          <AccountSettings />
        </div>

        {/* Application Preferences Section */}
        <div className="card">
          <h2 className="text-h2 mb-4">Application Preferences</h2>

          <div className="form-group">
            <Label htmlFor="theme">Theme</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={toggleTheme}
                className="btn-secondary"
                variant="secondary"
              >
                {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </Button>
              <p className="text-small">
                Currently using {theme === 'dark' ? 'dark' : 'light'} theme
              </p>
            </div>
          </div>

          <div className="form-group">
            <Label htmlFor="defaultStatus">Default Lead Status</Label>
            <Select value={defaultLeadStatus} onValueChange={setDefaultLeadStatus}>
              <SelectTrigger id="defaultStatus">
                <SelectValue placeholder="Select default status" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_LEAD_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-small mt-1">
              New leads will be created with this status by default
            </p>
          </div>

          <div className="form-group">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="text-small">
                  Send email notifications for lead updates
                </span>
              </label>
            </div>
            <p className="text-small mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              (Coming soon - email notifications are not yet implemented)
            </p>
          </div>
        </div>

        {/* Lead Status Settings Section */}
        <div className="card">
          <h2 className="text-h2 mb-4">Lead Status Pipeline</h2>
          <LeadStatusSettings />
        </div>

        {/* Data Management Section */}
        <div className="card">
          <h2 className="text-h2 mb-4">Data Management</h2>

          <div className="mb-6">
            <h3 className="text-h3 mb-3">Database Statistics</h3>
            {isLoadingStats ? (
              <p className="text-small">Loading statistics...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <div className="card">
                  <div className="stat-card">
                    <div className="stat-value">{dataStats.partnersCount}</div>
                    <div className="stat-label">Total Partners</div>
                  </div>
                </div>
                <div className="card">
                  <div className="stat-card">
                    <div className="stat-value">{dataStats.leadsCount}</div>
                    <div className="stat-label">Total Leads</div>
                  </div>
                </div>
                <div className="card">
                  <div className="stat-card">
                    <div className="stat-value text-small">
                      {dataStats.storageUsed}
                    </div>
                    <div className="stat-label">Storage Used</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-h3 mb-3">Import & Export</h3>
            <p className="text-small mb-3">
              Import data from CSV or export your current data for backup
            </p>
            <Link to="/import-export" className="btn btn-secondary">
              Go to Import/Export
            </Link>
          </div>

          <div className="divider"></div>

          {/* Danger Zone */}
          <div className="mt-6">
            <h3 className="text-h3 mb-3 text-danger">Danger Zone</h3>
            <div className="alert alert-danger">
              <p className="font-semibold mb-2">Clear All Data</p>
              <p className="text-small mb-4">
                This will permanently delete all partners and leads from your
                database. This action cannot be undone. Please make sure you have
                exported your data before proceeding.
              </p>
              <Button
                onClick={handleOpenDeleteDialog}
                disabled={isClearingData}
                className="btn btn-danger"
                variant="destructive"
              >
                Delete All Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--color-danger)', fontSize: '1.5rem', fontWeight: 'bold' }}>
              ⚠️ Delete All Data
            </DialogTitle>
            <DialogDescription style={{ color: 'var(--color-text-primary)', fontSize: '1rem', marginTop: 'var(--space-2)' }}>
              Are you absolutely sure? This will <strong style={{ color: 'var(--color-danger)' }}>DELETE ALL</strong> your partners and leads data.
              This action <strong style={{ color: 'var(--color-danger)' }}>CANNOT</strong> be undone!
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
              onClick={handleCloseDeleteDialog}
              disabled={isClearingData}
              style={{ marginRight: 'var(--space-2)' }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isClearingData || deleteConfirmText !== 'DELETE'}
              style={{
                opacity: deleteConfirmText !== 'DELETE' ? 0.5 : 1,
                cursor: deleteConfirmText !== 'DELETE' ? 'not-allowed' : 'pointer'
              }}
            >
              {isClearingData ? 'Deleting...' : 'Delete All Data'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
