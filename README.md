# Partnership Portal

A modern Partnership CRM + KPI Dashboard built with React, TypeScript, and Supabase. Track partner relationships, manage intro/lead pipelines, and monitor key performance metrics.

## Architecture

This project follows the **Bulletproof React** architecture pattern for scalable, maintainable React applications.

### Key Principles

- **Feature-based organization**: Code is organized by business features, not technical layers
- **Import boundaries**: Strict rules prevent cross-feature dependencies
- **Unidirectional data flow**: Enforced through ESLint rules
- **Type safety**: Full TypeScript coverage with strict mode

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Supabase** - Backend (Auth, Database, Storage, RLS)
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Router v6** - Routing
- **React Hook Form + Zod** - Forms and validation
- **Tailwind CSS + shadcn/ui** - Styling
- **Vitest + React Testing Library** - Testing

## Project Structure

```
src/
├── app/                    # Application layer
│   ├── routes/             # Route definitions
│   ├── app.tsx             # Main App component
│   ├── provider.tsx        # Global providers
│   └── router.tsx          # Router configuration
├── assets/                 # Static files
├── components/             # Shared UI components
│   └── ui/                 # shadcn/ui components
├── config/                 # Global configuration
├── features/               # Feature modules (CORE)
│   ├── auth/               # Authentication
│   ├── partners/           # Partner management
│   ├── leads/              # Intro/lead tracking
│   ├── dashboard/          # KPI dashboard
│   ├── deals/              # Deal & commission tracking
│   ├── import-export/      # CSV import/export
│   └── settings/           # App configuration
├── hooks/                  # Shared custom hooks
├── lib/                    # Pre-configured libraries
├── stores/                 # Global Zustand stores
├── types/                  # Shared TypeScript types
└── utils/                  # Shared utility functions
```

### Feature Module Structure

Each feature follows this structure:

```
features/[feature-name]/
├── api/              # TanStack Query hooks + Supabase queries
├── components/       # Feature-scoped components
├── hooks/            # Feature-scoped hooks
├── stores/           # Feature-scoped Zustand stores
├── types/            # Feature-scoped types
├── utils/            # Feature-scoped utilities
└── index.ts          # Public API exports
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   cd C:\Projects\zach-vieth-kpi
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run database migrations**

   Apply the SQL migration in `supabase/migrations/001_initial_schema.sql` to your Supabase project via the Supabase dashboard SQL editor.

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run type-check` - Check TypeScript types

## Import Rules

The project enforces strict import boundaries:

✅ **ALLOWED:**
- `features → shared` (components, hooks, lib, types, utils)
- `app → features + shared`

❌ **FORBIDDEN:**
- `features → other features` (NO cross-feature imports!)
- `features → app`
- `shared → features`
- `shared → app`

These rules are enforced via ESLint configuration.

## Adding a New Feature

1. **Create feature folder structure**

   ```bash
   src/features/[feature-name]/
   ├── api/
   ├── components/
   ├── types/
   └── index.ts
   ```

2. **Create API hooks** in `api/`

   ```typescript
   import { useQuery } from '@tanstack/react-query';
   import { supabase } from '@/lib/supabase';

   export const useGetItems = () => {
     return useQuery({
       queryKey: ['items'],
       queryFn: async () => {
         const { data, error } = await supabase.from('items').select('*');
         if (error) throw error;
         return data;
       },
     });
   };
   ```

3. **Create components** in `components/`

4. **Export public API** in `index.ts`

   ```typescript
   export { ItemsList } from './components/items-list/items-list';
   export { useGetItems } from './api/get-items';
   export type * from './types/item.types';
   ```

5. **Add routes** in `src/app/routes/`

6. **NEVER import from other features** - compose at the app layer instead

## Styling

### Theme Files

The project uses existing theme CSS files:

- `styles/dashboard-base.css` - Base layout and component styles
- `styles/theme-corporate-navy.css` - Corporate navy color scheme

These files are imported in `src/index.css` and should NOT be modified.

### CSS Variables

Use CSS variables from the theme for all colors:

```css
var(--color-primary)
var(--color-accent)
var(--color-bg-card)
var(--color-text-primary)
/* See theme-corporate-navy.css for all variables */
```

### Tailwind + shadcn/ui

Components use Tailwind utility classes and shadcn/ui primitives. The Tailwind config maps theme CSS variables to Tailwind tokens.

## Database Schema

### Tables

- **partners** - Partner companies (name, contact, services, notes)
- **leads** - Intros/leads (direction, status, dates, partner relationship)
- **status_history** - Lead status change timeline
- **deals** - Deal tracking (value, commission, recurring status)

### Row Level Security (RLS)

All tables have RLS policies that ensure users can only access their own data.

## Contributing

1. Follow the Bulletproof React architecture
2. Respect import boundaries (enforced by ESLint)
3. Write TypeScript with strict mode
4. Add tests for new features
5. Run `npm run lint` and `npm run type-check` before committing

## File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `PartnerCard.tsx`)
- Hooks: `useCamelCase.ts` (e.g., `usePartners.ts`)
- API files: `kebab-case.ts` (e.g., `get-partners.ts`)
- Types: `kebab-case.types.ts` (e.g., `partner.types.ts`)
- Stores: `kebab-case.store.ts` (e.g., `auth.store.ts`)

## License

MIT

## Support

For issues or questions, please refer to CLAUDE.md for development guidelines.
