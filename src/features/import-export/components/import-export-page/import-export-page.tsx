import { useState } from 'react';
import { FileUp, FileDown, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  generateSamplePartnersCSV,
  generateSampleLeadsCSV,
  downloadCSV,
} from '../../utils/csv-generator';
import { CsvImport } from '../csv-import/csv-import';
import { CsvExport } from '../csv-export/csv-export';

type TabType = 'import' | 'export';

export function ImportExportPage() {
  const [activeTab, setActiveTab] = useState<TabType>('import');

  const handleDownloadSamplePartners = () => {
    const csvContent = generateSamplePartnersCSV();
    downloadCSV(csvContent, 'sample-partners.csv');
  };

  const handleDownloadSampleLeads = () => {
    const csvContent = generateSampleLeadsCSV();
    downloadCSV(csvContent, 'sample-leads.csv');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Import & Export</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Import data from CSV files or export your data for backup and analysis
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="nav-tabs mb-6">
        <button
          onClick={() => setActiveTab('import')}
          className={`nav-tab ${activeTab === 'import' ? 'active' : ''}`}
        >
          <FileUp className="h-4 w-4 mr-2" />
          Import
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`nav-tab ${activeTab === 'export' ? 'active' : ''}`}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      <div className="grid gap-6">
        {activeTab === 'import' && (
          <>
            {/* Instructions */}
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Import Instructions
                </h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Partners CSV Format</h4>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Required columns: <code>company_name</code>
                    </p>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Optional columns: <code>contact_name</code>,{' '}
                      <code>email</code>, <code>phone</code>, <code>services</code>,{' '}
                      <code>website</code>, <code>location</code>, <code>notes</code>
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadSamplePartners}
                      className="btn-secondary"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Sample Partners CSV
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Leads CSV Format</h4>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Required columns: <code>partner_company_name</code>,{' '}
                      <code>lead_name</code>, <code>direction</code> (made/received),{' '}
                      <code>status</code>
                    </p>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Optional columns: <code>lead_company</code>,{' '}
                      <code>intro_date</code> (YYYY-MM-DD), <code>contact_info</code>,{' '}
                      <code>communication_method</code>, <code>notes</code>
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadSampleLeads}
                      className="btn-secondary"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Sample Leads CSV
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Important Notes</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      <li>CSV files must include a header row with column names</li>
                      <li>
                        For leads import, if a partner doesn't exist, it will be created
                        automatically
                      </li>
                      <li>Dates should be in YYYY-MM-DD format (e.g., 2024-01-15)</li>
                      <li>Direction must be either "made" or "received"</li>
                      <li>
                        Email addresses and website URLs will be validated before import
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Import Forms */}
            <div className="grid lg:grid-cols-2 gap-6">
              <CsvImport type="partners" />
              <CsvImport type="leads" />
            </div>
          </>
        )}

        {activeTab === 'export' && (
          <>
            {/* Export Instructions */}
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Export Instructions
                </h3>
              </div>
              <div className="card-content">
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Export your data as CSV files for backup, analysis, or migration to
                    other systems.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <li>Partners export includes all partner information and metadata</li>
                    <li>
                      Leads export includes lead details along with associated partner
                      information
                    </li>
                    <li>Files are named with the current date for easy organization</li>
                    <li>
                      Exported files can be re-imported using the Import feature above
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Export Forms */}
            <div className="grid lg:grid-cols-2 gap-6">
              <CsvExport type="partners" />
              <CsvExport type="leads" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
