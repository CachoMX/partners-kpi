# Import/Export Feature

Complete CSV import and export functionality for the Partnership Portal.

## Overview

This feature module provides comprehensive CSV import/export capabilities for Partners and Leads data, following the Bulletproof React architecture.

## Structure

```
import-export/
├── components/
│   ├── csv-import/
│   │   └── csv-import.tsx         # CSV file upload and import
│   ├── csv-export/
│   │   └── csv-export.tsx         # Export data to CSV
│   └── import-export-page/
│       └── import-export-page.tsx # Main page component
├── utils/
│   ├── csv-parser.ts              # Parse CSV files
│   └── csv-generator.ts           # Generate CSV from data
├── types/
│   └── import-export.types.ts     # TypeScript types
├── index.ts                       # Public API
└── README.md                      # This file
```

## Features

### CSV Import for Partners
- Upload CSV file with partner data
- Validate data before import
- Preview parsed data (first 5 rows)
- Bulk insert to Supabase
- Progress indicator and error reporting

**Expected CSV columns:**
- `company_name` (required)
- `contact_name` (optional)
- `email` (optional, validated)
- `phone` (optional)
- `services` (optional)
- `website` (optional, validated)
- `location` (optional)
- `notes` (optional)

### CSV Import for Leads
- Upload CSV file with leads data
- Automatically match or create partners by company name
- Validate all required fields
- Preview and confirm before import
- Bulk insert with detailed error reporting

**Expected CSV columns:**
- `partner_company_name` (required) - will lookup or create partner
- `lead_name` (required)
- `lead_company` (optional)
- `direction` (required) - must be "made" or "received"
- `status` (required)
- `intro_date` (optional) - format: YYYY-MM-DD
- `contact_info` (optional)
- `communication_method` (optional)
- `notes` (optional)

### CSV Export for Partners
- Export all partners to CSV
- Includes all fields and metadata
- Filename: `partners-YYYY-MM-DD.csv`
- Auto-download to browser

### CSV Export for Leads
- Export all leads with partner information
- Includes partner company name
- Filename: `leads-YYYY-MM-DD.csv`
- Auto-download to browser

## Usage

### Import Data

```typescript
import { CsvImport } from '@/features/import-export';

// In your component
<CsvImport
  type="partners"
  onImportComplete={() => {
    // Refresh data or show success message
  }}
/>
```

### Export Data

```typescript
import { CsvExport } from '@/features/import-export';

// In your component
<CsvExport type="leads" />
```

### Complete Page

```typescript
import { ImportExportPage } from '@/features/import-export';

// Use in router
<Route path="/import-export" element={<ImportExportPage />} />
```

## Sample CSV Files

The feature includes sample CSV generators for testing:

```typescript
import {
  generateSamplePartnersCSV,
  generateSampleLeadsCSV,
  downloadCSV
} from '@/features/import-export/utils/csv-generator';

// Download sample partners CSV
const csv = generateSamplePartnersCSV();
downloadCSV(csv, 'sample-partners.csv');
```

## Validation

### Partners Validation
- Company name is required
- Email format validation (if provided)
- URL format validation for website (if provided)

### Leads Validation
- Partner company name is required
- Lead name is required
- Direction must be "made" or "received"
- Status is required
- Date format validation (YYYY-MM-DD)

## Error Handling

The import process provides detailed error reporting:
- Row-level validation errors with field names
- Parse errors for invalid CSV format
- Database insertion errors with specific messages
- Success/failure counts

## Dependencies

- **papaparse**: CSV parsing and generation
- **date-fns**: Date formatting
- **@supabase/supabase-js**: Database operations

## Architecture Compliance

This module follows Bulletproof React architecture:
- ✅ Feature-based folder structure
- ✅ No cross-feature imports
- ✅ Public API through index.ts
- ✅ Uses shared components from @/components
- ✅ Uses shared utilities from @/lib and @/hooks
- ✅ Proper TypeScript typing
- ✅ Theme CSS integration

## Testing

### Manual Testing Checklist

1. **Partners Import**
   - [ ] Upload valid CSV
   - [ ] Upload CSV with validation errors
   - [ ] Upload CSV with invalid format
   - [ ] Upload large file (100+ rows)
   - [ ] Download sample CSV

2. **Leads Import**
   - [ ] Upload valid CSV with existing partners
   - [ ] Upload CSV that creates new partners
   - [ ] Upload CSV with invalid direction
   - [ ] Upload CSV with invalid dates
   - [ ] Download sample CSV

3. **Partners Export**
   - [ ] Export with data
   - [ ] Export with no data
   - [ ] Verify CSV format
   - [ ] Verify all fields included

4. **Leads Export**
   - [ ] Export with data
   - [ ] Export with no data
   - [ ] Verify partner info included
   - [ ] Verify CSV format

## Notes

- CSV files must include header row
- Column headers are case-insensitive and spaces/underscores are normalized
- Partner lookup for leads is case-insensitive
- If a partner doesn't exist during lead import, it will be created automatically
- Exports include all data for the authenticated user only (RLS enforced)
