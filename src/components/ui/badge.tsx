import * as React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'secondary';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        {
          'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]':
            variant === 'default',
          'bg-[var(--color-success-subtle)] text-[var(--color-success)]':
            variant === 'success',
          'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]':
            variant === 'danger',
          'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]':
            variant === 'warning',
          'bg-[var(--color-accent-subtle)] text-[var(--color-info)]':
            variant === 'info',
          'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]':
            variant === 'secondary',
        },
        className
      )}
      {...props}
    />
  );
}
