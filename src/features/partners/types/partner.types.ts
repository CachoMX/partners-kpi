// Partner type definitions
export interface Partner {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  services: string | null;
  website: string | null;
  location: string | null;
  notes: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type CreatePartnerDTO = Omit<
  Partner,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

export type UpdatePartnerDTO = Partial<CreatePartnerDTO>;

// Partner with intro/lead count
export interface PartnerWithStats extends Partner {
  intro_count?: number;
}
