import { DEFAULT_LEAD_STATUSES } from '../../utils/lead-statuses';

export function LeadStatusSettings() {
  return (
    <div>
      <p className="text-small mb-4" style={{ color: 'var(--color-text-secondary)' }}>
        These are the status stages for tracking your leads through the pipeline.
        Custom statuses will be available in a future update.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {DEFAULT_LEAD_STATUSES.map((status) => (
          <div
            key={status.value}
            className="card flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-4">
              <div className={`tag ${status.color}`}>{status.label}</div>
              <div>
                <p className="text-small" style={{ color: 'var(--color-text-secondary)' }}>
                  {status.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 alert alert-info">
        <p className="text-small" style={{ color: 'var(--color-text-primary)' }}>
          <strong>Coming Soon:</strong> Ability to add custom statuses, reorder
          pipeline stages, and customize colors.
        </p>
      </div>
    </div>
  );
}
