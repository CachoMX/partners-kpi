export const env = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Partnership Portal',
    description:
      import.meta.env.VITE_APP_DESCRIPTION ||
      'Partnership CRM + KPI Dashboard',
  },
} as const;

// Validate required environment variables
function validateEnv() {
  const required = {
    'VITE_SUPABASE_URL': env.supabase.url,
    'VITE_SUPABASE_ANON_KEY': env.supabase.anonKey,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(', ')}. Please check your .env file.`
    );
  }
}

validateEnv();
