// Auto-generated types based on Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      partners: {
        Row: {
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
        };
        Insert: {
          id?: string;
          company_name: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          services?: string | null;
          website?: string | null;
          location?: string | null;
          notes?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          services?: string | null;
          website?: string | null;
          location?: string | null;
          notes?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          partner_id: string;
          direction: 'made' | 'received';
          lead_name: string;
          lead_company: string | null;
          contact_info: string | null;
          intro_date: string;
          communication_method: string | null;
          status: string;
          notes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          partner_id: string;
          direction: 'made' | 'received';
          lead_name: string;
          lead_company?: string | null;
          contact_info?: string | null;
          intro_date?: string;
          communication_method?: string | null;
          status?: string;
          notes?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          partner_id?: string;
          direction?: 'made' | 'received';
          lead_name?: string;
          lead_company?: string | null;
          contact_info?: string | null;
          intro_date?: string;
          communication_method?: string | null;
          status?: string;
          notes?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      status_history: {
        Row: {
          id: string;
          lead_id: string;
          status: string;
          changed_at: string;
          notes: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          status: string;
          changed_at?: string;
          notes?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          status?: string;
          changed_at?: string;
          notes?: string | null;
          user_id?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          lead_id: string;
          deal_value: number | null;
          commission_percent: number | null;
          is_recurring: boolean;
          tier: string | null;
          status: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          deal_value?: number | null;
          commission_percent?: number | null;
          is_recurring?: boolean;
          tier?: string | null;
          status?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          deal_value?: number | null;
          commission_percent?: number | null;
          is_recurring?: boolean;
          tier?: string | null;
          status?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
