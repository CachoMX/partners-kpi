// API exports
export { useDeals } from './api/get-deals';
export { useGetDeal } from './api/get-deal';
export { useCreateDeal } from './api/create-deal';
export { useUpdateDeal } from './api/update-deal';
export { useDeleteDeal } from './api/delete-deal';

// Component exports
export { DealsList } from './components/deals-list/deals-list';
export { DealForm } from './components/deal-form/deal-form';
export { DealDetail } from './components/deal-detail/deal-detail';

// Type exports
export type {
  Deal,
  DealStatus,
  DealTier,
  CreateDealInput,
  UpdateDealInput,
  DealFilters,
} from './types/deal.types';

export { DEAL_STATUSES, DEAL_TIERS, RECURRING_FREQUENCIES } from './types/deal.types';
