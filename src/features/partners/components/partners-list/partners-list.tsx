import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { useGetPartners } from '../../api/get-partners';
import { useDeletePartner } from '../../api/delete-partner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function PartnersList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: partners, isLoading, error } = useGetPartners();
  const deletePartnerMutation = useDeletePartner();

  const handleDelete = async (partnerId: string, companyName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${companyName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(partnerId);
    try {
      await deletePartnerMutation.mutateAsync(partnerId);
      toast({
        title: 'Partner deleted',
        description: `${companyName} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete partner. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-h1">Partners</h1>
          <div className="skeleton" style={{ width: '150px', height: '40px' }}></div>
        </div>
        <div className="card">
          <div className="skeleton skeleton-text" style={{ width: '100%', height: '200px' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="alert alert-danger">
          <strong>Error loading partners:</strong> {(error as Error).message}
        </div>
      </div>
    );
  }

  const isEmpty = !partners || partners.length === 0;

  return (
    <div className="main-content">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-h1">Partners</h1>
        <Button
          className="btn btn-primary"
          onClick={() => navigate('/partners/new')}
        >
          <Plus size={16} />
          Add Partner
        </Button>
      </div>

      {isEmpty ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
          <h2 className="text-h2">No partners yet</h2>
          <p className="text-body text-secondary mb-4">
            Get started by adding your first partner.
          </p>
          <Button
            className="btn btn-primary"
            onClick={() => navigate('/partners/new')}
          >
            <Plus size={16} />
            Add Your First Partner
          </Button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Services</th>
                <th>Location</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.id}>
                  <td>
                    <Link
                      to={`/partners/${partner.id}`}
                      style={{
                        color: 'var(--color-accent)',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      {partner.company_name}
                    </Link>
                  </td>
                  <td>{partner.contact_name || '-'}</td>
                  <td>
                    {partner.email ? (
                      <a href={`mailto:${partner.email}`}>{partner.email}</a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{partner.phone || '-'}</td>
                  <td>{partner.services || '-'}</td>
                  <td>{partner.location || '-'}</td>
                  <td>
                    <div className="flex gap-2 justify-center">
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => navigate(`/partners/${partner.id}`)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/partners/${partner.id}/edit`)}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(partner.id, partner.company_name)}
                        disabled={deletingId === partner.id}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
