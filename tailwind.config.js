/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--color-border))',
        input: 'hsl(var(--color-border))',
        ring: 'hsl(var(--color-accent))',
        background: 'hsl(var(--color-bg-primary))',
        foreground: 'hsl(var(--color-text-primary))',
        primary: {
          DEFAULT: 'hsl(var(--color-accent))',
          foreground: 'hsl(var(--color-btn-primary-text))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-bg-secondary))',
          foreground: 'hsl(var(--color-text-secondary))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--color-danger))',
          foreground: 'hsl(var(--color-btn-primary-text))',
        },
        muted: {
          DEFAULT: 'hsl(var(--color-bg-elevated))',
          foreground: 'hsl(var(--color-text-muted))',
        },
        accent: {
          DEFAULT: 'hsl(var(--color-accent))',
          foreground: 'hsl(var(--color-btn-primary-text))',
        },
        popover: {
          DEFAULT: 'hsl(var(--color-bg-card))',
          foreground: 'hsl(var(--color-text-primary))',
        },
        card: {
          DEFAULT: 'hsl(var(--color-bg-card))',
          foreground: 'hsl(var(--color-text-primary))',
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
