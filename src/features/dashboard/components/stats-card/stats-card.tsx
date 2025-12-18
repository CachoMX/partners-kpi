// Reusable stats card component for displaying metrics

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({ title, value, icon, className = '' }: StatsCardProps) {
  return (
    <div className={`card-report stat-card ${className}`}>
      {icon && <div className="mb-3">{icon}</div>}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
    </div>
  );
}
