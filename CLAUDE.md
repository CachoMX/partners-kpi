# Partnership Portal - Claude Code Prompt

Copy everything below the line and paste it into Claude Code.

---

You are Claude Code acting as a senior React/TypeScript architect.

## Goal
Create a new React app that STRICTLY follows the architecture + folder conventions from "Bulletproof React" (alan2207/bulletproof-react). Mirror its philosophy: feature-based modules, a clear app layer, shared folders, and import boundaries.

## Project Location
Save all files to: C:\Projects\zach-vieth-kpi

---

## 🎯 PROJECT DESCRIPTION (WHAT I WANT TO BUILD)

**App Name:** Partnership Portal

**Description:** 
Build a lightweight "Partnerships CRM + KPI Dashboard" for Zach to track partner relationships and the lifecycle of intros/leads. The app lets him store partners, log every intro (sent or received), update lead status over time, and see a dashboard of top partners and progress metrics—without needing a full CRM.

**Features to implement:**
1. auth - Authentication with Supabase (login, register, password reset, JWT sessions)
2. partners - Partner directory CRUD (company name, contact, services, website, phone, notes) and detail pages with related intros
3. leads - Intros/leads tracking with direction (sent/received), status pipeline (Engaged → Booked Call → Proposal Sent → Closed), and activity log
4. dashboard - KPIs overview, top partners by intros, totals by direction, status pipeline counts, date/partner filters
5. deals - Deal tracking tied to intros (deal value, commission, recurring payout, tier) - V1 optional
6. import-export - CSV import for existing spreadsheet data, export filtered views
7. settings - Lead status definitions, default commission settings, future integrations config

**Pages/Routes needed:**

| Route | Description |
|-------|-------------|
| `/` | Dashboard - Total partners, intros made vs received, leads by status, top partners, quick filters |
| `/login` | Login page |
| `/register` | Registration page |
| `/partners` | Partners list - Table with company name, contact, services, total intros |
| `/partners/new` | Create partner form |
| `/partners/:partnerId` | Partner detail - Profile, all related intros/leads, metrics, add intro action |
| `/leads` | Leads list - Master list with filters (partner, direction, status, date range) |
| `/leads/new` | Create intro/lead form |
| `/leads/:leadId` | Lead detail - Status, history timeline, notes, manual status update |
| `/deals` | Deals & commissions list (optional V1) |
| `/import-export` | CSV import/export tools |
| `/settings` | App configuration (statuses, commissions, integrations) |

**User roles:**
- Owner (Primary User): Full access - CRUD all data, view dashboards, manage settings, import/export
- Admin (Future): Manage partners/leads, view reports, cannot delete system settings
- Viewer (Future): Read-only access to dashboard and details

**External APIs/Integrations:**
- Supabase: Primary backend - Auth (email/password, JWT), Database (PostgreSQL), Row Level Security, File storage, Serverless functions
- SendGrid (optional/future): Automated follow-up emails based on lead status
- CSV Import/Export: Client-side processing for data migration

**Additional requirements:**
- Single-tenant app for V1 (one company, one primary user: Zach), future-ready for multi-user
- Authentication: Email + Password with JWT sessions via Supabase Auth
- UI: Tailwind + shadcn/ui components (tables, dialogs, dropdowns), clean CRM-like UX
- Core entities: Partner, Lead/Intro, StatusHistory, Deal (optional), Notes/Activity
- Dark mode support

---

## Tech Stack (Required)
- React 18+ with TypeScript (strict mode)
- Vite as build tool
- Supabase (Auth, Database, Storage, RLS)
- React Router v6 (routing lives in src/app and/or src/app/routes)
- TanStack Query (React Query) for server state management
- Zustand for client state management
- React Hook Form for forms
- Zod for validation/schemas
- Tailwind CSS + shadcn/ui for styling
- ESLint + Prettier (configured and passing)
- Vitest + React Testing Library for testing

---

## Styling Theme (Required)
Use the existing theme files located in the project's `styles/` folder:
- `styles/dashboard-base.css` - Base dashboard styles and layout
- `styles/theme-corporate-navy.css` - Color scheme and theme variables

**Styling Instructions:**
1. Import these CSS files in `src/index.css` AFTER Tailwind imports:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   @import '../styles/dashboard-base.css';
   @import '../styles/theme-corporate-navy.css';
   ```
2. Use the CSS variables defined in the theme throughout ALL components
3. Ensure all new components follow the established color scheme and styling patterns
4. Do NOT override or replace these theme files - extend them if needed
5. Reference the theme variables for colors, spacing, shadows, and typography

---

## Hard Requirements (Must Follow Exactly)

### 1) Project Structure
Must match Bulletproof React's architecture:

```
zach-vieth-kpi/
├── public/
├── styles/                     # Theme files (EXISTING - DO NOT MODIFY)
│   ├── dashboard-base.css
│   └── theme-corporate-navy.css
├── src/
│   ├── app/                    # Application layer
│   │   ├── routes/             # Route definitions
│   │   ├── app.tsx             # Main App component
│   │   ├── provider.tsx        # Global providers wrapper
│   │   └── router.tsx          # Router configuration
│   ├── assets/                 # Static files (images, fonts, icons)
│   ├── components/             # Shared/reusable UI components
│   │   └── ui/                 # shadcn/ui components (Button, Input, Modal, Table, etc.)
│   ├── config/                 # Global configuration, env variables
│   ├── features/               # Feature-based modules (CORE OF THE APP)
│   │   ├── auth/
│   │   ├── partners/
│   │   ├── leads/
│   │   ├── dashboard/
│   │   ├── deals/
│   │   ├── import-export/
│   │   └── settings/
│   ├── hooks/                  # Shared custom hooks
│   ├── lib/                    # Pre-configured libraries (supabase, react-query, etc.)
│   ├── stores/                 # Global state stores
│   ├── testing/                # Test utilities and mocks
│   ├── types/                  # Shared TypeScript types/interfaces
│   ├── utils/                  # Shared utility functions
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles / Tailwind + theme imports
├── .env.example                # Environment variables template
├── .eslintrc.cjs               # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration with path aliases
├── vite.config.ts              # Vite configuration
├── package.json
├── README.md
└── CLAUDE.md                   # AI assistant instructions for ongoing development
```

### 2) Feature Module Structure
For EACH feature, create this structure (only create subfolders that are actually needed):

```
src/features/[feature-name]/
├── api/              # Supabase queries, TanStack Query hooks
│   └── [name].ts     # e.g., get-partners.ts, create-lead.ts
├── components/       # Components scoped to this feature only
│   └── [name]/
│       ├── [name].tsx
│       └── [name].test.tsx
├── hooks/            # Custom hooks specific to this feature
├── stores/           # Feature-specific Zustand stores
├── types/            # TypeScript types for this feature
├── utils/            # Utility functions for this feature
└── index.ts          # Public API - exports only what other features can use
```

### 3) No Cross-Feature Imports (CRITICAL)
- Features MUST NOT import from other features
- Compose features together ONLY at the app layer (`src/app`)

### 4) Unidirectional Architecture (CRITICAL)
Enforce this dependency flow:
```
shared (components/hooks/lib/types/utils) → features → app
```

Rules:
- ✅ `features` can import from `shared folders`
- ✅ `app` can import from `features` + `shared folders`
- ❌ `shared folders` must NEVER import from `features` or `app`
- ❌ `features` must NEVER import from `app`
- ❌ `features` must NEVER import from other `features`

### 5) Path Aliases (Required in tsconfig.json)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/assets/*": ["./src/assets/*"],
      "@/components/*": ["./src/components/*"],
      "@/config/*": ["./src/config/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

### 6) ESLint Boundary Rules (Required)
Configure `import/no-restricted-paths` to enforce architecture boundaries (block cross-feature imports, enforce unidirectional flow).

### 7) Supabase Setup
Create in `src/lib/supabase.ts`:
- Supabase client configuration
- Auth helpers
- Type-safe database queries

## File Naming Conventions
- Components: PascalCase (`PartnerCard.tsx`)
- Hooks: camelCase with 'use' prefix (`usePartners.ts`)
- API files: kebab-case (`get-partners.ts`, `create-lead.ts`)
- Utils/helpers: camelCase (`formatDate.ts`)
- Types: kebab-case (`partner.types.ts`, `lead.types.ts`)
- Stores: kebab-case (`auth.store.ts`)

## Component File Structure
```typescript
// 1. External imports
import { useState } from 'react';

// 2. Internal imports (using path aliases)
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

// 3. Types/Interfaces
interface Props {
  partnerId: string;
}

// 4. Constants
const STATUS_OPTIONS = ['Engaged', 'Booked Call', 'Proposal Sent', 'Closed'];

// 5. Component definition (named export)
export function PartnerDetail({ partnerId }: Props) {
  // ...
}
```

## Database Schema (Supabase)
Include migrations or type definitions for:
- `partners` - id, company_name, contact_name, email, phone, services, website, notes, created_at, updated_at
- `leads` - id, partner_id, direction (made/received), lead_name, lead_company, contact_info, intro_date, communication_method, status, notes, created_at, updated_at
- `status_history` - id, lead_id, status, changed_at, notes
- `deals` (optional) - id, lead_id, deal_value, commission_percent, is_recurring, tier, status, created_at

## Deliverables

1. **Generate all files and folders** for all 7 features listed

2. **Ensure these commands work:**
   - `npm install`
   - `npm run dev`
   - `npm run build`
   - `npm run lint` (passes with no errors)

3. **Include comprehensive README.md** explaining:
   - Project overview
   - Folder structure with descriptions
   - How to add a new feature
   - Environment setup (Supabase)

4. **Include CLAUDE.md** (see template below) with ongoing development instructions

5. **Include .env.example**:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_APP_NAME=Partnership Portal
   ```

6. **Include Supabase types** in `src/types/database.types.ts`

---

## CLAUDE.md Template (Generate this file for ongoing development)

The generated `CLAUDE.md` file MUST include all of the following:

```markdown
# CLAUDE.md - Partnership Portal Development Guide

## Project Overview
Partnership Portal - A CRM + KPI Dashboard for tracking partner relationships and intro/lead lifecycle.

## Architecture: Bulletproof React
This project follows the Bulletproof React architecture. ALL development must adhere to these rules.

### Folder Structure
```
src/
├── app/          # Routes, providers, app entry (imports from features + shared)
├── components/   # Shared UI components (shadcn/ui)
├── config/       # Environment and app configuration
├── features/     # Feature modules (auth, partners, leads, dashboard, deals, import-export, settings)
├── hooks/        # Shared custom hooks
├── lib/          # Pre-configured libraries (supabase, react-query)
├── stores/       # Global Zustand stores
├── types/        # Shared TypeScript types
└── utils/        # Shared utility functions
```

### Feature Module Structure
```
src/features/[feature-name]/
├── api/          # TanStack Query hooks + Supabase queries
├── components/   # Feature-scoped components
├── hooks/        # Feature-scoped hooks
├── stores/       # Feature-scoped Zustand stores
├── types/        # Feature-scoped types
├── utils/        # Feature-scoped utilities
└── index.ts      # Public API exports
```

### Import Rules (CRITICAL)
```
✅ ALLOWED:
- features → shared (components, hooks, lib, types, utils)
- app → features + shared

❌ FORBIDDEN:
- features → other features (NO cross-feature imports!)
- features → app
- shared → features
- shared → app
```

### Path Aliases
Always use path aliases for imports:
- `@/components/*` - Shared components
- `@/features/*` - Feature modules
- `@/hooks/*` - Shared hooks
- `@/lib/*` - Libraries (supabase, react-query)
- `@/types/*` - Shared types
- `@/utils/*` - Shared utilities

## Styling
### Theme Files (DO NOT MODIFY)
- `styles/dashboard-base.css` - Base layout styles
- `styles/theme-corporate-navy.css` - Color scheme and CSS variables

### Styling Rules
1. Import theme in `src/index.css` after Tailwind
2. Use CSS variables from theme for all colors
3. Use Tailwind utilities + shadcn/ui components
4. Extend theme if needed, never override

### CSS Variable Reference
Refer to `styles/theme-corporate-navy.css` for available variables:
- Colors: `--color-primary`, `--color-secondary`, etc.
- Spacing, shadows, typography as defined in theme

## Tech Stack
- React 18 + TypeScript (strict)
- Vite
- Supabase (Auth, Database, Storage)
- TanStack Query (server state)
- Zustand (client state)
- React Hook Form + Zod
- Tailwind CSS + shadcn/ui

## File Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- API: `kebab-case.ts`
- Types: `kebab-case.types.ts`
- Stores: `kebab-case.store.ts`

## Adding a New Feature
1. Create folder: `src/features/[feature-name]/`
2. Add subfolders as needed: `api/`, `components/`, `hooks/`, `types/`
3. Create `index.ts` with public exports
4. Add routes in `src/app/routes/`
5. NEVER import from other features

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Database Entities
- `partners` - Partner companies
- `leads` - Intros/leads with status pipeline
- `status_history` - Lead status changes
- `deals` - Deal tracking (optional)
```

---

## Start Now
Based on the Project Description above, create the complete application following Bulletproof React architecture. Do not ask clarifying questions - use sensible defaults for anything not specified.

**Before generating code:**
1. Review the existing files created in v0.app to understand the current UI/components
2. Analyze `current_sheet.csv` in the root path to understand the real data structure
3. Use the CSV columns to inform the database schema and TypeScript types
4. Preserve any good patterns/components from v0.app that fit the Bulletproof architecture
5. Review and use the theme CSS files in `styles/` folder for consistent styling

**Then proceed to:**
1. Print the complete final folder tree
2. Output the complete contents of EACH file
3. Migrate/refactor v0.app code into the proper Bulletproof structure
4. Do not omit any file required to run the app
