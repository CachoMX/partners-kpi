export interface PartnerImportRow {
  company_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  services?: string;
  website?: string;
  location?: string;
  notes?: string;
}

export interface LeadImportRow {
  partner_company_name: string;
  lead_name: string;
  lead_company?: string;
  direction: 'made' | 'received';
  status: string;
  intro_date?: string;
  contact_info?: string;
  communication_method?: string;
  notes?: string;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ParsedCSVData<T> {
  data: T[];
  errors: ValidationError[];
  isValid: boolean;
}

export type ImportType = 'partners' | 'leads';
export type ExportType = 'partners' | 'leads';
