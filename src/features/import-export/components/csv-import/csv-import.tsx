import { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  parsePartnersCSV,
  parseLeadsCSV,
} from '../../utils/csv-parser';
import type {
  PartnerImportRow,
  LeadImportRow,
  ImportResult,
  ImportType,
} from '../../types/import-export.types';
import type { Database } from '@/types/database.types';

type Partner = Database['public']['Tables']['partners']['Row'];

interface Props {
  type: ImportType;
  onImportComplete?: () => void;
}

export function CsvImport({ type, onImportComplete }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file',
        description: 'Please select a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);
    setImportResult(null);
    setValidationErrors([]);
    setIsProcessing(true);

    try {
      if (type === 'partners') {
        const result = await parsePartnersCSV(selectedFile);
        setPreviewData(result.data.slice(0, 5));
        setValidationErrors(
          result.errors.map((err) => `Row ${err.row}: ${err.field} - ${err.message}`)
        );
      } else {
        const result = await parseLeadsCSV(selectedFile);
        setPreviewData(result.data.slice(0, 5));
        setValidationErrors(
          result.errors.map((err) => `Row ${err.row}: ${err.field} - ${err.message}`)
        );
      }
    } catch (error) {
      toast({
        title: 'Parse error',
        description: 'Failed to parse CSV file',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setImportResult(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (type === 'partners') {
        const result = await parsePartnersCSV(file);
        if (!result.isValid) {
          toast({
            title: 'Validation failed',
            description: `Found ${result.errors.length} validation errors`,
            variant: 'destructive',
          });
          setIsProcessing(false);
          return;
        }

        const importResult = await importPartners(result.data, user.id);
        setImportResult(importResult);
      } else {
        const result = await parseLeadsCSV(file);
        if (!result.isValid) {
          toast({
            title: 'Validation failed',
            description: `Found ${result.errors.length} validation errors`,
            variant: 'destructive',
          });
          setIsProcessing(false);
          return;
        }

        const importResult = await importLeads(result.data, user.id);
        setImportResult(importResult);
      }

      toast({
        title: 'Import complete',
        description: `Successfully imported ${importResult?.success || 0} records`,
      });

      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setPreviewData([]);
    setValidationErrors([]);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="card">
      <div className="card-header">
        <h3 className="text-h3" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
          Import {type === 'partners' ? 'Partners' : 'Leads'}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Upload a CSV file to import {type === 'partners' ? 'partners' : 'leads'} data
        </p>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {/* File input */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id={`csv-upload-${type}`}
            />
            <label htmlFor={`csv-upload-${type}`}>
              <Button
                type="button"
                variant="outline"
                className="btn-secondary w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select CSV File
              </Button>
            </label>
            {file && (
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="alert alert-error">
              <AlertCircle className="h-4 w-4" />
              <div>
                <p className="font-medium">
                  Found {validationErrors.length} validation error(s)
                </p>
                <ul className="mt-2 list-disc list-inside text-sm">
                  {validationErrors.slice(0, 10).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {validationErrors.length > 10 && (
                    <li>...and {validationErrors.length - 10} more</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Preview */}
          {previewData.length > 0 && validationErrors.length === 0 && (
            <div>
              <h4 className="font-medium mb-2">Preview (first 5 rows)</h4>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      {Object.keys(previewData[0]).map((key) => (
                        <th key={key}>{key.replace(/_/g, ' ')}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value: any, i) => (
                          <td key={i}>{value || '-'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import result */}
          {importResult && (
            <div className="alert alert-success">
              <CheckCircle2 className="h-4 w-4" />
              <div>
                <p className="font-medium">Import completed</p>
                <p className="text-sm">
                  Successfully imported: {importResult.success}
                  {importResult.failed > 0 && ` | Failed: ${importResult.failed}`}
                </p>
                {importResult.errors.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={!file || validationErrors.length > 0 || isProcessing}
              className="btn-primary flex-1"
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Import Data
            </Button>
            {file && (
              <Button
                onClick={resetImport}
                variant="outline"
                className="btn-secondary"
                disabled={isProcessing}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Helper functions
async function importPartners(
  data: PartnerImportRow[],
  userId: string
): Promise<ImportResult> {
  const errors: string[] = [];
  let success = 0;
  let failed = 0;

  const partnersToInsert = data.map((row) => ({
    company_name: row.company_name,
    contact_name: row.contact_name || null,
    email: row.email || null,
    phone: row.phone || null,
    services: row.services || null,
    website: row.website || null,
    location: row.location || null,
    notes: row.notes || null,
    user_id: userId,
  }));

  const { data: insertedData, error } = await supabase
    .from('partners')
    .insert(partnersToInsert)
    .select();

  if (error) {
    failed = partnersToInsert.length;
    errors.push(error.message);
  } else {
    success = insertedData?.length || 0;
  }

  return { success, failed, errors };
}

async function importLeads(
  data: LeadImportRow[],
  userId: string
): Promise<ImportResult> {
  const errors: string[] = [];
  let success = 0;
  let failed = 0;

  // First, get all existing partners
  const { data: existingPartners } = await supabase
    .from('partners')
    .select('id, company_name')
    .eq('user_id', userId);

  const partnerMap = new Map(
    existingPartners?.map((p: Partner) => [p.company_name.toLowerCase(), p.id]) || []
  );

  // Process each lead
  for (const row of data) {
    try {
      // Find or create partner
      let partnerId = partnerMap.get(row.partner_company_name.toLowerCase());

      if (!partnerId) {
        // Create new partner
        const { data: newPartner, error: partnerError } = await supabase
          .from('partners')
          .insert({
            company_name: row.partner_company_name,
            user_id: userId,
          })
          .select()
          .single();

        if (partnerError || !newPartner) {
          failed++;
          errors.push(
            `Failed to create partner "${row.partner_company_name}": ${partnerError?.message}`
          );
          continue;
        }

        partnerId = newPartner.id;
        partnerMap.set(row.partner_company_name.toLowerCase(), partnerId);
      }

      // Insert lead
      const { error: leadError } = await supabase.from('leads').insert({
        partner_id: partnerId,
        lead_name: row.lead_name,
        lead_company: row.lead_company || null,
        direction: row.direction,
        status: row.status,
        intro_date: row.intro_date || new Date().toISOString().split('T')[0],
        contact_info: row.contact_info || null,
        communication_method: row.communication_method || null,
        notes: row.notes || null,
        user_id: userId,
      });

      if (leadError) {
        failed++;
        errors.push(`Failed to import lead "${row.lead_name}": ${leadError.message}`);
      } else {
        success++;
      }
    } catch (error) {
      failed++;
      errors.push(
        `Error importing lead "${row.lead_name}": ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  return { success, failed, errors };
}
