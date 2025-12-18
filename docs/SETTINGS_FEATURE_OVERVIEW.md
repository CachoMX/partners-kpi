# Settings Feature - Visual Overview

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                         SETTINGS                             │
│  Manage your account, preferences, and application settings  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ USER PROFILE                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Email:  [user@example.com]  (disabled)                     │
│  Your email address is used for authentication              │
│                                                              │
│  Member Since:  [January 1, 2024]  (disabled)               │
│                                                              │
│  ─────────────────────────────────────────────               │
│                                                              │
│  Password                                                    │
│  [Change Password]                                           │
│                                                              │
│  (When clicked, shows form:)                                │
│  New Password:       [__________]                            │
│  Confirm Password:   [__________]                            │
│  [Update Password]  [Cancel]                                 │
│                                                              │
│  ─────────────────────────────────────────────               │
│                                                              │
│  Account Actions                                             │
│  [Sign Out]                                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ APPLICATION PREFERENCES                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Theme:                                                      │
│  [🌙 Dark Mode]  Currently using dark theme                 │
│                                                              │
│  Default Lead Status:                                        │
│  [Engaged ▼]                                                 │
│  New leads will be created with this status by default      │
│                                                              │
│  Email Notifications:                                        │
│  ☐ Send email notifications for lead updates                │
│  (Coming soon - email notifications not yet implemented)    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ LEAD STATUS PIPELINE                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  These are the status stages for tracking leads through     │
│  the pipeline. Custom statuses will be available in a       │
│  future update.                                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [Engaged]  Initial contact made, conversation started│   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [Booked Call]  Call or meeting scheduled            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [Proposal Sent]  Proposal or offer sent to lead     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [Closed]  Deal closed successfully                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ℹ️ Coming Soon: Ability to add custom statuses,      │   │
│  │   reorder pipeline stages, and customize colors.    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ DATA MANAGEMENT                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Database Statistics                                         │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │     42     │  │     156    │  │    N/A     │            │
│  │   Total    │  │   Total    │  │  Storage   │            │
│  │  Partners  │  │   Leads    │  │   Used     │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                              │
│  Import & Export                                             │
│  Import data from CSV or export your current data for       │
│  backup                                                      │
│  [Go to Import/Export]                                       │
│                                                              │
│  ─────────────────────────────────────────────               │
│                                                              │
│  🚨 DANGER ZONE                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Clear All Data                                        │   │
│  │                                                        │   │
│  │ This will permanently delete all partners and leads  │   │
│  │ from your database. This action cannot be undone.    │   │
│  │ Please make sure you have exported your data before  │   │
│  │ proceeding.                                            │   │
│  │                                                        │   │
│  │ [Delete All Data]                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
SettingsPage
├── User Profile Section (Card)
│   └── UserProfile Component
│       ├── Email Display (Input - disabled)
│       ├── Member Since Display (Input - disabled)
│       ├── Password Section
│       │   ├── Change Password Button
│       │   └── Password Change Form (conditional)
│       │       ├── New Password Input
│       │       ├── Confirm Password Input
│       │       ├── Update Button
│       │       └── Cancel Button
│       └── Account Actions
│           └── Sign Out Button
│
├── Application Preferences Section (Card)
│   ├── Theme Toggle Button
│   ├── Default Lead Status Select
│   └── Email Notifications Checkbox
│
├── Lead Status Pipeline Section (Card)
│   └── LeadStatusSettings Component
│       ├── Description Text
│       ├── Status List
│       │   ├── Engaged Card
│       │   ├── Booked Call Card
│       │   ├── Proposal Sent Card
│       │   └── Closed Card
│       └── Info Alert (Coming Soon)
│
└── Data Management Section (Card)
    ├── Database Statistics
    │   ├── Partners Count Stat Card
    │   ├── Leads Count Stat Card
    │   └── Storage Used Stat Card
    ├── Import/Export Link
    └── Danger Zone
        └── Clear All Data Alert
            └── Delete Button
```

## State Management

### Local State (React.useState)
- `showPasswordForm` - Controls password form visibility
- `isChangingPassword` - Loading state for password change
- `defaultLeadStatus` - Selected default status
- `emailNotifications` - Notification preference
- `dataStats` - Database statistics
- `isLoadingStats` - Loading state for stats
- `isClearingData` - Loading state for data deletion

### Form State (React Hook Form)
- `newPassword` - New password field
- `confirmPassword` - Confirm password field
- Form errors and validation state

### Global State (Zustand)
- `theme` - Current theme (light/dark) from `@/stores/theme.store`
- `user` - Current user from `@/features/auth/stores/auth.store`

## Data Flow

```
┌──────────────┐
│  User Action │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Component Handler│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Validation     │  (Zod schema for forms)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Supabase API    │  (auth, database)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  State Update    │  (useState, form reset)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Toast Notification│ (Success/Error)
└──────────────────┘
```

## User Interactions

### 1. Change Password
```
Click "Change Password"
  ↓
Form appears with 2 inputs
  ↓
User enters passwords
  ↓
Client-side validation (Zod)
  ↓
Submit → Supabase auth.updatePassword()
  ↓
Success → Toast + Form reset
Error → Toast with error message
```

### 2. Toggle Theme
```
Click theme toggle button
  ↓
Zustand store updates theme
  ↓
Document attribute changes: data-theme="dark/light"
  ↓
CSS variables update globally
  ↓
LocalStorage persists preference
```

### 3. Clear All Data
```
Click "Delete All Data"
  ↓
Confirm dialog #1: "Are you sure?"
  ↓
Confirm dialog #2: "Last chance!"
  ↓
Prompt: Type "DELETE"
  ↓
Validate typed text === "DELETE"
  ↓
Delete all leads (foreign key first)
  ↓
Delete all partners
  ↓
Reload statistics
  ↓
Success toast
```

## Validation Rules

### Password Change
- **New Password:**
  - Required
  - Minimum 6 characters
  - Type: string

- **Confirm Password:**
  - Required
  - Must match new password
  - Type: string

### Data Deletion
- Requires 3 separate confirmations
- Must type "DELETE" exactly (case-sensitive)
- No cancellation after deletion starts

## API Endpoints Used

### Supabase Auth
- `auth.getUser()` - Get current user profile
- `auth.updatePassword(password)` - Change password
- `auth.signOut()` - Sign out user

### Supabase Database
- `supabase.from('partners').select('*', { count: 'exact', head: true })` - Get partners count
- `supabase.from('leads').select('*', { count: 'exact', head: true })` - Get leads count
- `supabase.from('leads').delete().neq('id', '...')` - Delete all leads
- `supabase.from('partners').delete().neq('id', '...')` - Delete all partners

## Toast Notifications

| Action | Success Message | Error Message |
|--------|----------------|---------------|
| Change Password | "Password updated successfully" | "Failed to update password" |
| Sign Out | "You have been signed out successfully" | "Failed to sign out" |
| Clear Data | "All data has been deleted" | "Failed to clear data" |
| Clear Data Cancel | "Data deletion cancelled" | - |

## Responsive Behavior

- Statistics cards use CSS Grid with `auto-fit`
- Min card width: 200px
- Stacks vertically on mobile
- Full width on mobile for all sections
- Button text remains visible on all screen sizes

## Accessibility

- All form inputs have associated labels
- Disabled inputs are clearly marked
- Button states change on hover/disabled
- Error messages displayed inline with form fields
- Color-coded status badges with text labels
- High contrast theme colors
- Keyboard navigation supported

## Performance Optimizations

- Statistics loaded once on mount
- Form validation client-side first
- Debounced/throttled operations where needed
- Lazy loading of unused components
- Minimal re-renders with proper state management

## Security Measures

1. **Authentication:** All operations require authenticated user
2. **Row Level Security:** Supabase RLS policies enforce data isolation
3. **Password Validation:** Client + server-side validation
4. **Confirmation Dialogs:** Prevent accidental data deletion
5. **No Sensitive Data Display:** Passwords never shown in UI
6. **Secure Password Update:** Uses Supabase Auth secure method

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid support required
- CSS Variables support required
- LocalStorage required for theme persistence
- ES6+ JavaScript features used

## Known Limitations

1. Storage calculation not implemented (shows "N/A")
2. Email notifications UI only (not functional)
3. Lead statuses read-only (custom statuses coming soon)
4. No account deletion feature
5. No profile picture upload
6. No two-factor authentication

## Future Considerations

- Implement custom lead status management
- Add profile picture upload with Supabase Storage
- Calculate actual storage usage
- Implement email notifications with SendGrid
- Add account deletion with data export
- Add two-factor authentication
- Add audit log for settings changes
- Add password strength indicator
- Add password history prevention
- Add session management (view/revoke active sessions)
