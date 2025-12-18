import { createBrowserRouter, RouterProvider, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { LoginPage, RegisterPage } from './routes/auth';
import { AppLayout } from '@/components/layout/AppLayout';

// Import Partners feature components
import { PartnersList, PartnerForm, PartnerDetail } from '@/features/partners';

// Import Leads feature components
import { LeadsList, LeadForm, LeadDetail } from '@/features/leads';

// Import Dashboard feature component
import { DashboardOverview } from '@/features/dashboard';

// Import Import/Export feature component
import { ImportExportPage } from '@/features/import-export';

// Import Settings feature component
import { SettingsPage } from '@/features/settings';

// Import Deals feature components
import { DealsList, DealForm, DealDetail } from '@/features/deals';

// Route wrappers to extract params
function PartnerDetailWrapper() {
  const { partnerId } = useParams();
  return <PartnerDetail partnerId={partnerId!} />;
}

function PartnerEditWrapper() {
  const { partnerId } = useParams();
  return <PartnerForm partnerId={partnerId!} />;
}

function LeadDetailWrapper() {
  const { leadId } = useParams();
  return <LeadDetail leadId={leadId!} />;
}

function LeadEditWrapper() {
  const { leadId } = useParams();
  return <LeadForm leadId={leadId!} />;
}

function DealDetailWrapper() {
  const { dealId } = useParams();
  return <DealDetail dealId={dealId!} />;
}

function DealEditWrapper() {
  const { dealId } = useParams();
  return <DealForm dealId={dealId!} />;
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <div className="text-center">
          <div className="skeleton skeleton-avatar mx-auto mb-4"></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },
      // Partners routes
      {
        path: 'partners',
        element: <PartnersList />,
      },
      {
        path: 'partners/new',
        element: <PartnerForm />,
      },
      {
        path: 'partners/:partnerId',
        element: <PartnerDetailWrapper />,
      },
      {
        path: 'partners/:partnerId/edit',
        element: <PartnerEditWrapper />,
      },
      // Leads routes
      {
        path: 'leads',
        element: <LeadsList />,
      },
      {
        path: 'leads/new',
        element: <LeadForm />,
      },
      {
        path: 'leads/:leadId',
        element: <LeadDetailWrapper />,
      },
      {
        path: 'leads/:leadId/edit',
        element: <LeadEditWrapper />,
      },
      // Deals routes
      {
        path: 'deals',
        element: <DealsList />,
      },
      {
        path: 'deals/new',
        element: <DealForm />,
      },
      {
        path: 'deals/:dealId',
        element: <DealDetailWrapper />,
      },
      {
        path: 'deals/:dealId/edit',
        element: <DealEditWrapper />,
      },
      // Other routes
      {
        path: 'import-export',
        element: <ImportExportPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
