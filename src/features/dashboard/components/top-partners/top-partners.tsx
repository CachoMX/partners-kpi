import { Link } from 'react-router-dom';
import type { TopPartner } from '../../types/dashboard.types';

interface TopPartnersProps {
  partners: TopPartner[];
}

export function TopPartners({ partners }: TopPartnersProps) {
  if (partners.length === 0) {
    return (
      <div className="card">
        <h3 className="text-h3">Top Partners</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>No partners with intros yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-h3 mb-4">Top Partners</h3>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Company</th>
              <th className="text-right">Intros</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner, index) => (
              <tr key={partner.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className={`tag ${index < 3 ? 'tag-primary' : 'tag-default'}`}>
                      #{index + 1}
                    </span>
                  </div>
                </td>
                <td>
                  <Link
                    to={`/partners/${partner.id}`}
                    style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                  >
                    {partner.company_name}
                  </Link>
                </td>
                <td className="text-right">
                  <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>{partner.intro_count}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
