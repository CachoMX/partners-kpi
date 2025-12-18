# Partnership Portal - Setup Instructions

## ✅ Status: Almost Ready!

Your development environment is running on **http://localhost:3001/**

## 🔧 Final Setup Step: Apply Database Migration

You need to run the SQL migration to create your database tables.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/xmbnzwklgpscecjfizyn
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl+Enter)

You should see: "Success. No rows returned"

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Link your project
supabase link --project-ref xmbnzwklgpscecjfizyn

# Apply migration
supabase db push
```

## 📊 Database Tables Created

After running the migration, you'll have:

- ✅ **partners** - Partner companies with contacts
- ✅ **leads** - Intros/leads with status pipeline
- ✅ **status_history** - Automatic status change tracking
- ✅ **deals** - Deal and commission tracking
- ✅ **RLS Policies** - Row-level security enabled
- ✅ **Indexes** - Performance optimizations
- ✅ **Triggers** - Auto-update timestamps and status history

## 🧪 Test the Setup

1. Visit http://localhost:3001/
2. You should see the login page
3. Click "Register" to create an account
4. Login with your new credentials

## 📝 Environment Variables

Your `.env` file has been configured with:

```
VITE_SUPABASE_URL=https://xmbnzwklgpscecjfizyn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_APP_NAME=Partnership Portal
```

## 🚀 Available Commands

```bash
npm run dev          # Start dev server (RUNNING)
npm run build        # Build for production
npm run lint         # Check code quality
npm run format       # Format code with Prettier
npm run test         # Run tests
```

## 🎯 What's Working

✅ Development server running
✅ Environment variables configured
✅ Dependencies installed
✅ Bulletproof React architecture
✅ Auth feature complete (login/register)
✅ Supabase client configured
✅ Theme styles loaded

## 📋 Next Steps After Migration

Once the database migration is applied:

1. **Test Authentication**
   - Register a new account at http://localhost:3001/register
   - Login at http://localhost:3001/login
   - Verify auth state persists

2. **Build Remaining Features**
   - Partners CRUD (list, create, edit, detail pages)
   - Leads tracking (status pipeline)
   - Dashboard (KPIs and metrics)
   - Import/Export (CSV handling)

3. **Follow the Pattern**
   - Copy structure from `src/features/auth/`
   - Create API hooks with TanStack Query
   - Build components
   - Export via `index.ts`
   - Add routes in `src/app/router.tsx`

## 🐛 Troubleshooting

**If you see "AuthApiError":**
- Make sure you've run the database migration
- Check Supabase dashboard for any errors

**If styles look broken:**
- Check browser console for errors
- Verify `styles/` folder exists with theme files

**If imports fail:**
- Run `npm run type-check` to verify TypeScript
- Check that path aliases are working

## 📖 Documentation

- [README.md](README.md) - Full project documentation
- [CLAUDE.md](CLAUDE.md) - Development guidelines
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Detailed feature status

## ✨ Architecture Highlights

This project follows **Bulletproof React** architecture:

- 🔐 **Features are isolated** - No cross-feature imports
- 🎯 **Unidirectional data flow** - shared → features → app
- 🔒 **Import boundaries enforced** - ESLint prevents violations
- 📦 **Feature modules** - Self-contained with public API
- 🎨 **Consistent styling** - Corporate navy theme
- 🔑 **Type-safe** - Full TypeScript coverage
- 🚀 **Modern stack** - Vite, React 18, TanStack Query

---

**Ready to code!** Apply the migration and start building features. 🎉
