import { useStatusHistory } from '../../api/get-status-history';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/utils/format';

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

interface StatusTimelineProps {
  leadId: string;
}

export function StatusTimeline({ leadId }: StatusTimelineProps) {
  const { data: history, isLoading } = useStatusHistory(leadId);

  if (isLoading) {
    return (
      <div className="text-[var(--color-text-secondary)] text-sm">
        Loading history...
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-[var(--color-text-secondary)] text-sm">
        No status history yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
        Status History
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-[var(--color-border)]" />

        {/* Timeline items */}
        <div className="space-y-6">
          {history.map((item, index) => (
            <div key={item.id} className="relative pl-10">
              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1 w-[30px] h-[30px] rounded-full border-4 border-[var(--color-bg-card)] ${
                  index === 0
                    ? 'bg-[var(--color-accent)]'
                    : 'bg-[var(--color-bg-elevated)]'
                }`}
              />

              {/* Content */}
              <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <Badge variant={getStatusVariant(item.status)}>
                    {item.status}
                  </Badge>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {formatDateTime(item.changed_at)}
                  </span>
                </div>

                {item.notes && (
                  <p className="text-sm text-[var(--color-text-primary)] mt-2">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
