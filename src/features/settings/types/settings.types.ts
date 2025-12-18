export interface LeadStatusConfig {
  value: string;
  label: string;
  color: string; // tag class name
  description: string;
}

export interface AppSettings {
  defaultLeadStatus: string;
  emailNotifications: boolean;
  theme: 'light' | 'dark';
}

export interface UserProfile {
  email: string;
  created_at: string;
}

export interface ChangePasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface DataStats {
  partnersCount: number;
  leadsCount: number;
  storageUsed: string;
}
