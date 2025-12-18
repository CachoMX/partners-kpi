# Settings Feature Module

Complete settings and user profile management for the Partnership Portal.

## Overview

The Settings feature provides a centralized location for users to manage their account, configure application preferences, view lead status pipeline, and manage their data.

## Structure

```
src/features/settings/
├── components/
│   ├── settings-page/
│   │   └── settings-page.tsx          # Main settings page with all sections
│   ├── lead-status-settings/
│   │   └── lead-status-settings.tsx   # Lead status pipeline display
│   └── user-profile/
│       └── user-profile.tsx           # User profile and password management
├── types/
│   └── settings.types.ts              # TypeScript interfaces
├── utils/
│   └── lead-statuses.ts               # Default lead status configurations
├── index.ts                           # Public API exports
└── README.md                          # This file
```

## Features

### 1. User Profile Management

**File:** `components/user-profile/user-profile.tsx`

- Display user email (from Supabase Auth)
- Show account creation date
- Change password functionality with validation
- Sign out button

**Password Change:**
- Minimum 6 characters required
- Password confirmation required
- Real-time validation with Zod schema
- Success/error toast notifications

### 2. Lead Status Pipeline

**File:** `components/lead-status-settings/lead-status-settings.tsx`

Displays the default lead statuses used throughout the application:

- **Engaged** - Initial contact made, conversation started
- **Booked Call** - Call or meeting scheduled
- **Proposal Sent** - Proposal or offer sent to lead
- **Closed** - Deal closed successfully

**V1:** Read-only display
**Future:** Add, edit, delete, and reorder custom statuses

### 3. Application Preferences

**File:** `components/settings-page/settings-page.tsx`

- **Theme Toggle:** Switch between light and dark modes using the global theme store
- **Default Lead Status:** Select the default status for newly created leads
- **Email Notifications:** Toggle for future email notification feature (UI only)

### 4. Data Management

**Database Statistics:**
- Total Partners count
- Total Leads count
- Storage used (placeholder for future implementation)

**Import/Export:**
- Link to the Import/Export feature page
- Allows users to backup and restore their data

**Danger Zone:**
- Clear all data functionality
- Multi-step confirmation process to prevent accidental deletion
- Deletes all partners and leads permanently

## Types

**File:** `types/settings.types.ts`

```typescript
export interface LeadStatusConfig {
  value: string;          // Status identifier
  label: string;          // Display name
  color: string;          // CSS class for tag color
  description: string;    // Explanation of the status
}

export interface AppSettings {
  defaultLeadStatus: string;     // Default status for new leads
  emailNotifications: boolean;    // Email notification preference
  theme: 'light' | 'dark';       // Application theme
}

export interface UserProfile {
  email: string;          // User's email address
  created_at: string;     // Account creation timestamp
}

export interface ChangePasswordFormData {
  newPassword: string;    // New password
  confirmPassword: string; // Password confirmation
}

export interface DataStats {
  partnersCount: number;  // Total number of partners
  leadsCount: number;     // Total number of leads
  storageUsed: string;    // Storage usage (placeholder)
}
```

## Utilities

**File:** `utils/lead-statuses.ts`

Exports `DEFAULT_LEAD_STATUSES` constant containing the predefined lead status configurations.

## Dependencies

### Internal Dependencies
- `@/lib/supabase` - Supabase client and auth helpers
- `@/hooks/use-auth` - Authentication state and methods
- `@/hooks/use-toast` - Toast notification system
- `@/stores/theme.store` - Global theme state management
- `@/components/ui/*` - shadcn/ui components (Button, Input, Label, Select, etc.)

### External Dependencies
- `react-hook-form` - Form state management
- `@hookform/resolvers/zod` - Zod integration for form validation
- `zod` - Schema validation
- `react-router-dom` - Navigation (Link component)

## Usage

### Importing the Settings Page

```typescript
import { SettingsPage } from '@/features/settings';

// In router configuration
{
  path: 'settings',
  element: <SettingsPage />,
}
```

### Importing Lead Status Configurations

```typescript
import { DEFAULT_LEAD_STATUSES } from '@/features/settings';

// Use in dropdowns, forms, etc.
DEFAULT_LEAD_STATUSES.forEach(status => {
  console.log(status.label, status.description);
});
```

## Implementation Details

### Password Change Flow

1. User clicks "Change Password" button
2. Form appears with new password and confirm password fields
3. User enters passwords
4. Form validates:
   - Minimum 6 characters
   - Passwords match
5. On submit, calls `auth.updatePassword()`
6. Shows success/error toast
7. Resets form on success

### Data Clearing Flow

1. User clicks "Delete All Data" button
2. First confirmation dialog appears
3. Second confirmation dialog appears
4. User must type "DELETE" in a prompt
5. If confirmed:
   - Deletes all leads (foreign key constraint)
   - Deletes all partners
   - Reloads statistics
6. Shows success toast

### Theme Toggle

Uses the global Zustand store (`@/stores/theme.store`) to toggle between light and dark themes. The theme is persisted to localStorage.

## Security Considerations

1. **Password Updates:**
   - Uses Supabase Auth's secure password update method
   - Requires new password to be at least 6 characters
   - Client-side validation only (Supabase handles server-side security)

2. **Data Deletion:**
   - Multi-step confirmation process
   - Requires user to type "DELETE" to confirm
   - Cannot be undone

3. **User Authentication:**
   - All operations require authenticated user
   - Uses Supabase Row Level Security (RLS)

## Future Enhancements

1. **Custom Lead Statuses:**
   - Add custom statuses
   - Edit status names and colors
   - Reorder pipeline stages
   - Delete unused statuses

2. **Email Notifications:**
   - Implement SendGrid integration
   - Configure notification preferences
   - Set up automated follow-up reminders

3. **Profile Picture:**
   - Upload and manage avatar
   - Use Supabase Storage

4. **Two-Factor Authentication:**
   - Enable 2FA for additional security
   - Use Supabase Auth 2FA features

5. **Account Deletion:**
   - Allow users to permanently delete their account
   - Export data before deletion

6. **Storage Management:**
   - Calculate actual storage usage
   - File upload management
   - Storage quota tracking

7. **Audit Log:**
   - Track all settings changes
   - View history of account modifications

## Testing

### Manual Testing Checklist

- [ ] User email displays correctly
- [ ] Account creation date displays correctly
- [ ] Password change form validates input
- [ ] Password change succeeds with valid input
- [ ] Password change shows error with invalid input
- [ ] Sign out button works
- [ ] Theme toggle switches between light/dark
- [ ] Theme persists after page reload
- [ ] Default lead status dropdown works
- [ ] Lead status pipeline displays all statuses
- [ ] Database statistics load correctly
- [ ] Import/Export link navigates correctly
- [ ] Clear data confirmation flow works
- [ ] Data deletion succeeds and updates stats
- [ ] All toast notifications display correctly

### Unit Testing (Future)

Create tests for:
- Password validation schema
- Form submission handlers
- Data stats loading
- Theme toggle functionality

## Architecture Compliance

This feature module follows Bulletproof React architecture:

✅ Feature-based folder structure
✅ Components scoped to feature
✅ No cross-feature imports
✅ Public API through index.ts
✅ Unidirectional dependency flow (shared → features → app)
✅ Path aliases for imports
✅ TypeScript strict mode
✅ Consistent naming conventions

## Styling

Uses the existing theme system:

- Theme CSS variables from `styles/theme-corporate-navy.css`
- Base styles from `styles/dashboard-base.css`
- Classes: `.card`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.form-group`, `.form-input`, `.text-h2`, `.text-h3`, `.alert`, `.tag`, etc.

## Routes

- `/settings` - Main settings page

## Contributing

When adding new settings sections:

1. Create a new component in `components/`
2. Import and use in `settings-page.tsx`
3. Add types to `types/settings.types.ts` if needed
4. Add utilities to `utils/` if needed
5. Update this README
6. Follow Bulletproof React architecture
7. Use existing theme classes
8. Handle errors gracefully with toast notifications
