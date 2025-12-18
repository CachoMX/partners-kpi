# Dashboard Feature

The Dashboard feature provides a comprehensive overview of partnership and lead metrics for the Partnership Portal.

## Structure

```
src/features/dashboard/
├── api/
│   └── get-dashboard-stats.ts    # TanStack Query hooks for fetching dashboard data
├── components/
│   ├── dashboard-overview/
│   │   └── dashboard-overview.tsx # Main dashboard component
│   ├── stats-card/
│   │   └── stats-card.tsx         # Reusable metric card component
│   ├── top-partners/
│   │   └── top-partners.tsx       # Top partners by intro count
│   └── recent-activity/
│       └── recent-activity.tsx    # Recent leads activity feed
├── types/
│   └── dashboard.types.ts         # TypeScript type definitions
└── index.ts                       # Public API exports
```

## Components

### DashboardOverview

Main component that displays the complete dashboard view.

**Features:**
- Overview statistics (Total Partners, Total Leads, Intros Made/Received)
- Lead Pipeline breakdown by status
- Top Partners by intro count
- Recent Activity feed

**Usage:**
```tsx
import { DashboardOverview } from '@/features/dashboard';

function App() {
  return <DashboardOverview />;
}
```

### StatsCard

Reusable component for displaying a single metric.

**Props:**
```typescript
interface StatsCardProps {
  title: string;           // Label for the metric
  value: number | string;  // The metric value
  icon?: React.ReactNode;  // Optional icon
  className?: string;      // Additional CSS classes
}
```

**Usage:**
```tsx
import { StatsCard } from '@/features/dashboard';

<StatsCard title="Total Partners" value={42} />
```

### TopPartners

Displays a ranked list of partners by intro count.

**Props:**
```typescript
interface TopPartnersProps {
  partners: TopPartner[];
}
```

**Usage:**
```tsx
import { TopPartners } from '@/features/dashboard';

<TopPartners partners={topPartners} />
```

### RecentActivity

Shows the most recent leads created.

**Props:**
```typescript
interface RecentActivityProps {
  leads: RecentLead[];
}
```

**Usage:**
```tsx
import { RecentActivity } from '@/features/dashboard';

<RecentActivity leads={recentLeads} />
```

## API Hooks

### useGetDashboardStats

Fetches aggregate statistics for the dashboard.

**Returns:**
```typescript
{
  totalPartners: number;
  totalLeads: number;
  leadsMade: number;
  leadsReceived: number;
  statusBreakdown: {
    engaged: number;
    bookedCall: number;
    proposalSent: number;
    closed: number;
  };
}
```

**Usage:**
```tsx
import { useGetDashboardStats } from '@/features/dashboard';

function Component() {
  const { data: stats, isLoading, error } = useGetDashboardStats();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{stats.totalPartners} partners</div>;
}
```

### useGetTopPartners

Fetches the top partners ranked by number of intros.

**Returns:**
```typescript
TopPartner[] // Array of top 10 partners
```

**Usage:**
```tsx
import { useGetTopPartners } from '@/features/dashboard';

const { data: topPartners } = useGetTopPartners();
```

### useGetRecentLeads

Fetches the 5 most recent leads.

**Returns:**
```typescript
RecentLead[] // Array of recent leads with partner data
```

**Usage:**
```tsx
import { useGetRecentLeads } from '@/features/dashboard';

const { data: recentLeads } = useGetRecentLeads();
```

## Types

### DashboardStats
```typescript
interface DashboardStats {
  totalPartners: number;
  totalLeads: number;
  leadsMade: number;
  leadsReceived: number;
  statusBreakdown: {
    engaged: number;
    bookedCall: number;
    proposalSent: number;
    closed: number;
  };
}
```

### TopPartner
```typescript
interface TopPartner {
  id: string;
  company_name: string;
  intro_count: number;
}
```

### RecentLead
```typescript
interface RecentLead {
  id: string;
  lead_name: string;
  lead_company: string | null;
  status: string;
  direction: 'made' | 'received';
  intro_date: string;
  created_at: string;
  partner: {
    id: string;
    company_name: string;
  };
}
```

## Styling

The dashboard uses the following CSS classes from the theme:

- `.main-content` - Main content wrapper with padding
- `.card-grid` - Responsive grid layout for cards
- `.card-report` - Stat card with hover effects
- `.stat-card` - Centered stat display
- `.stat-value` - Large metric value
- `.stat-label` - Metric label text
- `.card` - Standard card container
- `.table-wrapper` - Scrollable table container
- `.table` - Styled table
- `.tag` - Status badges
- `.skeleton` - Loading skeleton animations

## Data Flow

1. **Dashboard Mount** → Triggers 3 parallel queries:
   - `useGetDashboardStats()` - Aggregate metrics
   - `useGetTopPartners()` - Top 10 partners
   - `useGetRecentLeads()` - 5 recent leads

2. **Loading State** → Shows skeleton loaders while data fetches

3. **Success State** → Renders:
   - 4 stat cards (Partners, Leads, Made, Received)
   - Pipeline breakdown (4 status cards)
   - Top Partners table
   - Recent Activity table

4. **Error State** → Shows error alert with message

## Database Queries

### Stats Query
- Counts partners by user_id
- Fetches all leads for calculations
- Groups by direction (made/received)
- Groups by status (Engaged, Booked Call, Proposal Sent, Closed)

### Top Partners Query
- Counts leads per partner_id
- Joins with partners table
- Orders by intro count descending
- Limits to top 10

### Recent Leads Query
- Fetches last 5 leads by created_at
- Joins with partners table
- Orders by created_at descending

## Performance

- All queries run in parallel for fast loading
- TanStack Query caching reduces redundant requests
- Query keys: `['dashboard', 'stats']`, `['dashboard', 'top-partners']`, `['dashboard', 'recent-leads']`
- Data is automatically refetched on window focus
- Stale time can be configured per query

## Future Enhancements

Potential improvements:
- Date range filters for stats
- Export dashboard as PDF/CSV
- Configurable metric cards
- Real-time updates via subscriptions
- Additional charts (pie, bar, line)
- Partner comparison view
- Goal tracking and progress
- Conversion funnel visualization
