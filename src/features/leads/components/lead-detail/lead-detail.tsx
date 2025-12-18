import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft, Mail, Phone } from 'lucide-react';
import { useLead } from '../../api/get-lead';
import { useUpdateLead } from '../../api/update-lead';
import { useDeleteLead } from '../../api/delete-lead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { StatusTimeline } from '../status-timeline/status-timeline';
import { formatDate } from '@/utils/format';
import { useToast } from '@/hooks/use-toast';
import { LEAD_STATUSES } from '../../types/lead.types';

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

const getDirectionLabel = (direction: 'made' | 'received') => {
  return direction === 'made' ? 'Made (Sent)' : 'Received';
};

interface LeadDetailProps {
  leadId: string;
}

export function LeadDetail({ leadId }: LeadDetailProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: lead, isLoading } = useLead(leadId);
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const handleStatusChange = async (newStatus: string) => {
    if (!lead) return;

    try {
      await updateLead.mutateAsync({
        id: lead.id,
        data: { status: newStatus },
        previousStatus: lead.status,
      });

      toast({
        title: 'Status updated',
        description: `Lead status changed to "${newStatus}".`,
      });

      setSelectedStatus('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!lead) return;

    if (
      !window.confirm(
        `Are you sure you want to delete the lead "${lead.lead_name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteLead.mutateAsync(lead.id);
      toast({
        title: 'Lead deleted',
        description: `Successfully deleted lead "${lead.lead_name}".`,
      });
      navigate('/leads');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete lead. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          Loading lead...
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12">
          <p className="text-[var(--color-text-secondary)]">Lead not found.</p>
          <Button onClick={() => navigate('/leads')} className="mt-4">
            Back to Leads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/leads')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Button>
        <div className="flex gap-2">
          <Link to={`/leads/${lead.id}/edit`}>
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

      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          {lead.lead_name}
        </h1>
        {lead.lead_company && (
          <p className="text-lg text-[var(--color-text-secondary)] mt-1">
            {lead.lead_company}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[var(--color-text-secondary)]">
                    Direction
                  </Label>
                  <p className="text-[var(--color-text-primary)] mt-1">
                    {getDirectionLabel(lead.direction)}
                  </p>
                </div>

                <div>
                  <Label className="text-[var(--color-text-secondary)]">
                    Status
                  </Label>
                  <div className="mt-1">
                    <Badge variant={getStatusVariant(lead.status)}>
                      {lead.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-[var(--color-text-secondary)]">
                    Intro Date
                  </Label>
                  <p className="text-[var(--color-text-primary)] mt-1">
                    {formatDate(lead.intro_date)}
                  </p>
                </div>

                {lead.communication_method && (
                  <div>
                    <Label className="text-[var(--color-text-secondary)]">
                      Communication
                    </Label>
                    <p className="text-[var(--color-text-primary)] mt-1">
                      {lead.communication_method}
                    </p>
                  </div>
                )}
              </div>

              {lead.contact_info && (
                <div>
                  <Label className="text-[var(--color-text-secondary)]">
                    Contact Info
                  </Label>
                  <p className="text-[var(--color-text-primary)] mt-1">
                    {lead.contact_info}
                  </p>
                </div>
              )}

              {lead.notes && (
                <div>
                  <Label className="text-[var(--color-text-secondary)]">
                    Notes
                  </Label>
                  <p className="text-[var(--color-text-primary)] mt-1 whitespace-pre-wrap">
                    {lead.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status-update">Change Status</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger id="status-update">
                      <SelectValue placeholder={`Current: ${lead.status}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUSES.filter((s) => s !== lead.status).map(
                        (status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <StatusTimeline leadId={lead.id} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {lead.partner && (
            <Card>
              <CardHeader>
                <CardTitle>Partner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Link
                    to={`/partners/${lead.partner_id}`}
                    className="text-lg font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    {lead.partner.company_name}
                  </Link>
                </div>

                {lead.partner.contact_name && (
                  <div>
                    <Label className="text-[var(--color-text-secondary)]">
                      Contact
                    </Label>
                    <p className="text-[var(--color-text-primary)] mt-1">
                      {lead.partner.contact_name}
                    </p>
                  </div>
                )}

                {lead.partner.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[var(--color-text-secondary)]" />
                    <a
                      href={`mailto:${lead.partner.email}`}
                      className="text-[var(--color-accent)] hover:underline text-sm"
                    >
                      {lead.partner.email}
                    </a>
                  </div>
                )}

                {lead.partner.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[var(--color-text-secondary)]" />
                    <a
                      href={`tel:${lead.partner.phone}`}
                      className="text-[var(--color-accent)] hover:underline text-sm"
                    >
                      {lead.partner.phone}
                    </a>
                  </div>
                )}

                {lead.partner.services && (
                  <div>
                    <Label className="text-[var(--color-text-secondary)]">
                      Services
                    </Label>
                    <p className="text-[var(--color-text-primary)] mt-1 text-sm">
                      {lead.partner.services}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <Label className="text-[var(--color-text-secondary)]">
                  Created
                </Label>
                <p className="text-[var(--color-text-primary)] mt-1">
                  {formatDate(lead.created_at)}
                </p>
              </div>
              <div>
                <Label className="text-[var(--color-text-secondary)]">
                  Last Updated
                </Label>
                <p className="text-[var(--color-text-primary)] mt-1">
                  {formatDate(lead.updated_at)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
