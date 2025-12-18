export interface UserProfile {
  id: string;
  full_name: string | null;
  business_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileInput {
  full_name?: string;
  business_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
}

export interface UpdateEmailInput {
  newEmail: string;
}

export interface DeleteAccountConfirmation {
  confirmText: string;
}
