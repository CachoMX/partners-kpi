import Papa from 'papaparse';
import type {
  PartnerImportRow,
  LeadImportRow,
  ValidationError,
  ParsedCSVData,
} from '../types/import-export.types';

/**
 * Parse partners CSV file
 */
export function parsePartnersCSV(
  file: File
): Promise<ParsedCSVData<PartnerImportRow>> {
  return new Promise((resolve) => {
    Papa.parse<PartnerImportRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase().replace(/\s+/g, '_'),
      complete: (results) => {
        const errors: ValidationError[] = [];
        const validData: PartnerImportRow[] = [];

        results.data.forEach((row, index) => {
          const rowErrors = validatePartnerRow(row, index + 1);
          if (rowErrors.length > 0) {
            errors.push(...rowErrors);
          } else {
            validData.push(row);
          }
        });

        resolve({
          data: validData,
          errors,
          isValid: errors.length === 0,
        });
      },
      error: (error) => {
        resolve({
          data: [],
          errors: [
            {
              row: 0,
              field: 'file',
              message: `Failed to parse CSV: ${error.message}`,
            },
          ],
          isValid: false,
        });
      },
    });
  });
}

/**
 * Parse leads CSV file
 */
export function parseLeadsCSV(
  file: File
): Promise<ParsedCSVData<LeadImportRow>> {
  return new Promise((resolve) => {
    Papa.parse<LeadImportRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase().replace(/\s+/g, '_'),
      complete: (results) => {
        const errors: ValidationError[] = [];
        const validData: LeadImportRow[] = [];

        results.data.forEach((row, index) => {
          const rowErrors = validateLeadRow(row, index + 1);
          if (rowErrors.length > 0) {
            errors.push(...rowErrors);
          } else {
            validData.push(row);
          }
        });

        resolve({
          data: validData,
          errors,
          isValid: errors.length === 0,
        });
      },
      error: (error) => {
        resolve({
          data: [],
          errors: [
            {
              row: 0,
              field: 'file',
              message: `Failed to parse CSV: ${error.message}`,
            },
          ],
          isValid: false,
        });
      },
    });
  });
}

/**
 * Validate a partner row
 */
export function validatePartnerRow(
  row: any,
  rowNumber: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!row.company_name || row.company_name.trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'company_name',
      message: 'Company name is required',
    });
  }

  // Email validation (if provided)
  if (row.email && row.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(row.email)) {
      errors.push({
        row: rowNumber,
        field: 'email',
        message: 'Invalid email format',
      });
    }
  }

  // Website validation (if provided)
  if (row.website && row.website.trim() !== '') {
    try {
      new URL(row.website);
    } catch {
      errors.push({
        row: rowNumber,
        field: 'website',
        message: 'Invalid URL format',
      });
    }
  }

  return errors;
}

/**
 * Validate a lead row
 */
export function validateLeadRow(row: any, rowNumber: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!row.partner_company_name || row.partner_company_name.trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'partner_company_name',
      message: 'Partner company name is required',
    });
  }

  if (!row.lead_name || row.lead_name.trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'lead_name',
      message: 'Lead name is required',
    });
  }

  if (!row.direction || row.direction.trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'direction',
      message: 'Direction is required',
    });
  } else if (row.direction !== 'made' && row.direction !== 'received') {
    errors.push({
      row: rowNumber,
      field: 'direction',
      message: 'Direction must be either "made" or "received"',
    });
  }

  if (!row.status || row.status.trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'status',
      message: 'Status is required',
    });
  }

  // Date validation (if provided)
  if (row.intro_date && row.intro_date.trim() !== '') {
    const date = new Date(row.intro_date);
    if (isNaN(date.getTime())) {
      errors.push({
        row: rowNumber,
        field: 'intro_date',
        message: 'Invalid date format (use YYYY-MM-DD)',
      });
    }
  }

  return errors;
}
