import { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  StickyNote,
  Plus,
  ArrowRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useGetPartner } from '../../api/get-partner';
import { useDeletePartner } from '../../api/delete-partner';
import { useLeads } from '@/features/leads/api/get-leads';
import { PartnerLeadsFilters } from '../partner-leads-filters/partner-leads-filters';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function PartnerDetail() {
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  const { data: partner, isLoading, error } = useGetPartner(partnerId);
  const { data: relatedLeads, isLoading: leadsLoading } = useLeads({ partner_id: partnerId });
  const deletePartnerMutation = useDeletePartner();

  // Filter leads based on filters
  const filteredLeads = useMemo(() => {
    if (!relatedLeads) return [];

    return relatedLeads.filter((lead) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = lead.lead_name.toLowerCase().includes(query);
        const matchesCompany = lead.lead_company?.toLowerCase().includes(query);
        if (!matchesName && !matchesCompany) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && lead.status !== statusFilter) {
        return false;
      }

      // Direction filter
      if (directionFilter !== 'all' && lead.direction !== directionFilter) {
        return false;
      }

      // Date range filter
      if (dateFromFilter && lead.intro_date < dateFromFilter) {
        return false;
      }

      if (dateToFilter && lead.intro_date > dateToFilter) {
        return false;
      }

      return true;
    });
  }, [relatedLeads, searchQuery, statusFilter, directionFilter, dateFromFilter, dateToFilter]);

  const handleDelete = async () => {
    if (!partner) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${partner.company_name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePartnerMutation.mutateAsync(partner.id);
      toast({
        title: 'Partner deleted',
        description: `${partner.company_name} has been deleted successfully.`,
      });
      navigate('/partners');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete partner. Please try again.',
        variant: 'destructive',
      });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="skeleton skeleton-title mb-6"></div>
        <div className="card">
          <div className="skeleton" style={{ width: '100%', height: '300px' }}></div>
        </div>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="main-content">
        <div className="alert alert-danger">
          <strong>Error:</strong> {error ? (error as Error).message : 'Partner not found'}
        </div>
        <Button className="btn btn-secondary mt-4" onClick={() => navigate('/partners')}>
          <ArrowLeft size={16} />
          Back to Partners
        </Button>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="mb-6">
        <Button className="btn btn-ghost mb-4" onClick={() => navigate('/partners')}>
          <ArrowLeft size={16} />
          Back to Partners
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-h1">{partner.company_name}</h1>
          <div className="flex gap-3">
            <Button
              className="btn btn-secondary"
              onClick={() => navigate(`/partners/${partner.id}/edit`)}
            >
              <Pencil size={16} />
              Edit
            </Button>
            <Button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 size={16} />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-h2 mb-4">Partner Information</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
          {partner.contact_name && (
            <div>
              <div className="text-small mb-1" style={{ color: 'var(--color-text-secondary)' }}>Contact Name</div>
              <div className="text-body" style={{ margin: 0 }}>
                {partner.contact_name}
              </div>
            </div>
          )}

          {partner.email && (
            <div>
              <div className="text-small mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Email
              </div>
              <div className="text-body" style={{ margin: 0 }}>
                <a href={`mailto:${partner.email}`} style={{ color: 'var(--color-accent)' }}>{partner.email}</a>
              </div>
            </div>
          )}

          {partner.phone && (
            <div>
              <div className="text-small mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Phone
              </div>
              <div className="text-body" style={{ margin: 0 }}>
                <a href={`tel:${partner.phone}`} style={{ color: 'var(--color-accent)' }}>{partner.phone}</a>
              </div>
            </div>
          )}

          {partner.website && (
            <div>
              <div className="text-small mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                <Globe size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Website
              </div>
              <div className="text-body" style={{ margin: 0 }}>
                <a href={partner.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                  {partner.website}
                </a>
              </div>
            </div>
          )}

          {partner.location && (
            <div>
              <div className="text-small mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Location
              </div>
              <div className="text-body" style={{ margin: 0 }}>
                {partner.location}
              </div>
            </div>
          )}

          {partner.services && (
            <div>
              <div className="text-small mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                <Briefcase size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Services
              </div>
              <div className="text-body" style={{ margin: 0 }}>
                {partner.services}
              </div>
            </div>
          )}
        </div>

        {partner.notes && (
          <div className="mt-4" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
            <div className="text-small mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              <StickyNote size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Notes
            </div>
            <div
              className="text-body"
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                backgroundColor: 'var(--color-bg-elevated)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {partner.notes}
            </div>
          </div>
        )}
      </div>

      {/* Related Leads Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h2" style={{ margin: 0 }}>
            Related Intros & Leads
            {relatedLeads && relatedLeads.length > 0 && (
              <span className="text-small ml-2" style={{ color: 'var(--color-text-secondary)', fontWeight: 'normal' }}>
                ({filteredLeads.length} of {relatedLeads.length} {relatedLeads.length === 1 ? 'intro' : 'intros'})
              </span>
            )}
          </h2>
          <Button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/leads/new?partnerId=${partner.id}`)}
          >
            <Plus size={16} />
            Add Intro
          </Button>
        </div>

        {/* Filters */}
        {relatedLeads && relatedLeads.length > 0 && (
          <PartnerLeadsFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            directionFilter={directionFilter}
            onDirectionChange={setDirectionFilter}
            dateFromFilter={dateFromFilter}
            onDateFromChange={setDateFromFilter}
            dateToFilter={dateToFilter}
            onDateToChange={setDateToFilter}
          />
        )}

        {leadsLoading ? (
          <div className="text-center" style={{ padding: 'var(--space-6)' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading leads...</p>
          </div>
        ) : filteredLeads.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filteredLeads.map((lead) => (
              <Link
                key={lead.id}
                to={`/leads/${lead.id}`}
                style={{
                  display: 'block',
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                      <h3 className="text-h3" style={{ margin: 0, color: 'var(--color-text-primary)' }}>
                        {lead.lead_name}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: lead.direction === 'made' ? 'var(--color-accent)' : 'var(--color-success)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {lead.direction === 'made' ? (
                          <>
                            <ArrowRight size={12} />
                            Made
                          </>
                        ) : (
                          <>
                            <ArrowDownLeft size={12} />
                            Received
                          </>
                        )}
                      </span>
                    </div>
                    {lead.lead_company && (
                      <p className="text-small" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
                        {lead.lead_company}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                      <span className="text-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Status: <strong style={{ color: 'var(--color-text-primary)' }}>{lead.status}</strong>
                      </span>
                      <span className="text-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Date: {new Date(lead.intro_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : relatedLeads && relatedLeads.length > 0 ? (
          <div
            className="alert alert-info"
            style={{
              textAlign: 'center',
              padding: 'var(--space-6)',
            }}
          >
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              No intros match your current filters. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div
            className="alert alert-info"
            style={{
              textAlign: 'center',
              padding: 'var(--space-6)',
            }}
          >
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              No intros or leads yet. Click "Add Intro" to create one.
            </p>
          </div>
        )}
      </div>

      <div className="text-small mt-6" style={{ color: 'var(--color-text-secondary)' }}>
        <div>
          Created: {new Date(partner.created_at).toLocaleDateString()} at{' '}
          {new Date(partner.created_at).toLocaleTimeString()}
        </div>
        <div>
          Last updated: {new Date(partner.updated_at).toLocaleDateString()} at{' '}
          {new Date(partner.updated_at).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
