import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEFAULT_LEAD_STATUSES } from '@/features/settings';

interface PartnerLeadsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  directionFilter: string;
  onDirectionChange: (value: string) => void;
  dateFromFilter: string;
  onDateFromChange: (value: string) => void;
  dateToFilter: string;
  onDateToChange: (value: string) => void;
}

export function PartnerLeadsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  directionFilter,
  onDirectionChange,
  dateFromFilter,
  onDateFromChange,
  dateToFilter,
  onDateToChange,
}: PartnerLeadsFiltersProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)',
        padding: 'var(--space-4)',
        backgroundColor: 'var(--color-bg-elevated)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Search */}
      <div>
        <Label htmlFor="search" style={{ fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
          Search
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by name or company..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div>
        <Label htmlFor="status" style={{ fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
          Status
        </Label>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger id="status">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {DEFAULT_LEAD_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Direction Filter */}
      <div>
        <Label htmlFor="direction" style={{ fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
          Direction
        </Label>
        <Select value={directionFilter} onValueChange={onDirectionChange}>
          <SelectTrigger id="direction">
            <SelectValue placeholder="All directions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All directions</SelectItem>
            <SelectItem value="made">Made</SelectItem>
            <SelectItem value="received">Received</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date From */}
      <div>
        <Label htmlFor="dateFrom" style={{ fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
          From Date
        </Label>
        <Input
          id="dateFrom"
          type="date"
          value={dateFromFilter}
          onChange={(e) => onDateFromChange(e.target.value)}
        />
      </div>

      {/* Date To */}
      <div>
        <Label htmlFor="dateTo" style={{ fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
          To Date
        </Label>
        <Input
          id="dateTo"
          type="date"
          value={dateToFilter}
          onChange={(e) => onDateToChange(e.target.value)}
        />
      </div>
    </div>
  );
}
