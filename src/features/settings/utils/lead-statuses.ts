import type { LeadStatusConfig } from '../types/settings.types';

export const DEFAULT_LEAD_STATUSES: LeadStatusConfig[] = [
  {
    value: 'Engaged',
    label: 'Engaged',
    color: 'tag-primary',
    description: 'Initial contact made, conversation started',
  },
  {
    value: 'Booked Call',
    label: 'Booked Call',
    color: 'tag-warning',
    description: 'Call or meeting scheduled',
  },
  {
    value: 'Proposal Sent',
    label: 'Proposal Sent',
    color: 'tag-default',
    description: 'Proposal or offer sent to lead',
  },
  {
    value: 'Closed',
    label: 'Closed',
    color: 'tag-success',
    description: 'Deal closed successfully',
  },
];
