// Public API for partners feature
export { PartnersList } from './components/partners-list/partners-list';
export { PartnerForm } from './components/partner-form/partner-form';
export { PartnerDetail } from './components/partner-detail/partner-detail';

export { useGetPartners } from './api/get-partners';
export { useGetPartner } from './api/get-partner';
export { useCreatePartner } from './api/create-partner';
export { useUpdatePartner } from './api/update-partner';
export { useDeletePartner } from './api/delete-partner';

export type { Partner, CreatePartnerDTO, UpdatePartnerDTO } from './types/partner.types';
