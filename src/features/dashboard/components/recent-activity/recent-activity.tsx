import { Link } from 'react-router-dom';
import type { RecentLead } from '../../types/dashboard.types';

interface RecentActivityProps {
  leads: RecentLead[];
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Engaged':
      return 'tag-primary';
    case 'Booked Call':
      return 'tag-warning';
    case 'Proposal Sent':
      return 'tag-success';
    case 'Closed':
      return 'tag-success';
    default:
      return 'tag-default';
  }
};

const getDirectionBadge = (direction: 'made' | 'received'): JSX.Element => {
  if (direction === 'made') {
    return (
      <span className="tag tag-primary" style={{ fontSize: '11px' }}>
        Sent
      </span>
    );
  }
  return (
    <span className="tag tag-success" style={{ fontSize: '11px' }}>
      Received
    </span>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

export function RecentActivity({ leads }: RecentActivityProps) {
  if (leads.length === 0) {
    return (
      <div className="card">
        <h3 className="text-h3">Recent Activity</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>No recent leads yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3" style={{ margin: 0 }}>
          Recent Activity
        </h3>
        <Link to="/leads" className="text-small" style={{ color: 'var(--color-accent)' }}>
          View all →
        </Link>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Partner</th>
              <th>Direction</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <Link
                    to={`/leads/${lead.id}`}
                    style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                  >
                    <div className="font-semibold">{lead.lead_name}</div>
                    {lead.lead_company && (
                      <div className="text-small" style={{ color: 'var(--color-text-secondary)' }}>{lead.lead_company}</div>
                    )}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/partners/${lead.partner.id}`}
                    style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                  >
                    {lead.partner.company_name}
                  </Link>
                </td>
                <td>{getDirectionBadge(lead.direction)}</td>
                <td>
                  <span className={`tag ${getStatusColor(lead.status)}`}>{lead.status}</span>
                </td>
                <td className="text-small" style={{ color: 'var(--color-text-secondary)' }}>{formatDate(lead.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
