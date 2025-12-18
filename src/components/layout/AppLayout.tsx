import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/theme.store';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  DollarSign,
  Upload,
  Settings,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useThemeStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Partners', href: '/partners', icon: Users },
    { name: 'Leads', href: '/leads', icon: UserPlus },
    { name: 'Deals', href: '/deals', icon: DollarSign },
    { name: 'Import/Export', href: '/import-export', icon: Upload },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="sidebar w-64 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <h1 className="text-xl font-bold text-[var(--color-accent)]">Partnership Portal</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 inline-block mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-[var(--color-border)] space-y-2">
          <button
            onClick={toggleTheme}
            className="theme-toggle w-full"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="topbar px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
        </div>

        {/* Page content */}
        <main className="main-content flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
