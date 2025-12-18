import Papa from 'papaparse';
import { format } from 'date-fns';
import type { Database } from '@/types/database.types';

type Partner = Database['public']['Tables']['partners']['Row'];
type Lead = Database['public']['Tables']['leads']['Row'];

export interface LeadWithPartner extends Lead {
  partner?: Partner;
}

/**
 * Generate CSV content from partners data
 */
export function generatePartnersCSV(partners: Partner[]): string {
  const csvData = partners.map((partner) => ({
    company_name: partner.company_name,
    contact_name: partner.contact_name || '',
    email: partner.email || '',
    phone: partner.phone || '',
    services: partner.services || '',
    website: partner.website || '',
    location: partner.location || '',
    notes: partner.notes || '',
    created_at: format(new Date(partner.created_at), 'yyyy-MM-dd'),
  }));

  return Papa.unparse(csvData, {
    quotes: true,
    header: true,
  });
}

/**
 * Generate CSV content from leads data
 */
export function generateLeadsCSV(leads: LeadWithPartner[]): string {
  const csvData = leads.map((lead) => ({
    partner_company_name: lead.partner?.company_name || 'Unknown',
    lead_name: lead.lead_name,
    lead_company: lead.lead_company || '',
    direction: lead.direction,
    status: lead.status,
    intro_date: format(new Date(lead.intro_date), 'yyyy-MM-dd'),
    contact_info: lead.contact_info || '',
    communication_method: lead.communication_method || '',
    notes: lead.notes || '',
    created_at: format(new Date(lead.created_at), 'yyyy-MM-dd'),
  }));

  return Papa.unparse(csvData, {
    quotes: true,
    header: true,
  });
}

/**
 * Trigger download of CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Generate sample partners CSV
 */
export function generateSamplePartnersCSV(): string {
  const sampleData = [
    {
      company_name: 'Acme Corporation',
      contact_name: 'John Doe',
      email: 'john@acme.com',
      phone: '555-1234',
      services: 'Software Development, Consulting',
      website: 'https://acme.com',
      location: 'New York, NY',
      notes: 'Great partner for enterprise clients',
    },
    {
      company_name: 'Tech Solutions Inc',
      contact_name: 'Jane Smith',
      email: 'jane@techsolutions.com',
      phone: '555-5678',
      services: 'IT Services, Cloud Solutions',
      website: 'https://techsolutions.com',
      location: 'San Francisco, CA',
      notes: 'Specializes in cloud migrations',
    },
  ];

  return Papa.unparse(sampleData, {
    quotes: true,
    header: true,
  });
}

/**
 * Generate sample leads CSV
 */
export function generateSampleLeadsCSV(): string {
  const sampleData = [
    {
      partner_company_name: 'Acme Corporation',
      lead_name: 'Alice Johnson',
      lead_company: 'Johnson Enterprises',
      direction: 'made',
      status: 'Engaged',
      intro_date: '2024-01-15',
      contact_info: 'alice@johnsonent.com',
      communication_method: 'Email',
      notes: 'Interested in consulting services',
    },
    {
      partner_company_name: 'Tech Solutions Inc',
      lead_name: 'Bob Williams',
      lead_company: 'Williams Corp',
      direction: 'received',
      status: 'Booked Call',
      intro_date: '2024-01-20',
      contact_info: 'bob@williamscorp.com',
      communication_method: 'Phone',
      notes: 'Looking for IT support',
    },
  ];

  return Papa.unparse(sampleData, {
    quotes: true,
    header: true,
  });
}
