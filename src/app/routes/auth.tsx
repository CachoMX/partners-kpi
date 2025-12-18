import { LoginForm } from '@/features/auth';
import { RegisterForm } from '@/features/auth';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary))' }}>
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-h1 mb-2" style={{ color: 'var(--color-text-primary)' }}>Partnership Portal</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 className="text-h2 mb-6">Login</h2>
          <LoginForm />

          <div className="divider" style={{ margin: 'var(--space-6) 0' }}></div>

          <div className="text-center">
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 'var(--font-semibold)' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Track partnerships, intros, and deals in one place
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary))' }}>
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-h1 mb-2" style={{ color: 'var(--color-text-primary)' }}>Partnership Portal</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Create your account to get started</p>
        </div>

        {/* Register Card */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 className="text-h2 mb-6">Create Account</h2>
          <RegisterForm />

          <div className="divider" style={{ margin: 'var(--space-6) 0' }}></div>

          <div className="text-center">
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 'var(--font-semibold)' }}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Free to use • Secure authentication • Your data stays private
          </p>
        </div>
      </div>
    </div>
  );
}
