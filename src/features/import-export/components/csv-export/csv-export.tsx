import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  generatePartnersCSV,
  generateLeadsCSV,
  downloadCSV,
} from '../../utils/csv-generator';
import type { ExportType } from '../../types/import-export.types';
import type { Database } from '@/types/database.types';

type Partner = Database['public']['Tables']['partners']['Row'];
type Lead = Database['public']['Tables']['leads']['Row'];

interface LeadWithPartner extends Lead {
  partner?: Partner;
}

interface Props {
  type: ExportType;
}

export function CsvExport({ type }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (type === 'partners') {
        await exportPartners(user.id);
      } else {
        await exportLeads(user.id);
      }

      toast({
        title: 'Export complete',
        description: `${type === 'partners' ? 'Partners' : 'Leads'} exported successfully`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="card">
      <div className="card-header">
        <h3 className="text-h3" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
          Export {type === 'partners' ? 'Partners' : 'Leads'}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Download all {type === 'partners' ? 'partners' : 'leads'} as a CSV file
        </p>
      </div>
      <div className="card-content">
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="btn-primary w-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

// Helper functions
async function exportPartners(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('user_id', userId)
    .order('company_name');

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('No partners found to export');
  }

  const csvContent = generatePartnersCSV(data);
  const filename = `partners-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  downloadCSV(csvContent, filename);
}

async function exportLeads(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      partner:partners(*)
    `)
    .eq('user_id', userId)
    .order('intro_date', { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('No leads found to export');
  }

  // Transform data to include partner info
  const leadsWithPartner: LeadWithPartner[] = data.map((lead: any) => ({
    ...lead,
    partner: Array.isArray(lead.partner) ? lead.partner[0] : lead.partner,
  }));

  const csvContent = generateLeadsCSV(leadsWithPartner);
  const filename = `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  downloadCSV(csvContent, filename);
}
