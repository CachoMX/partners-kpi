import { format as dateFnsFormat, parseISO } from 'date-fns';

export const formatDate = (
  date: string | Date,
  formatStr: string = 'MMM dd, yyyy'
): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return dateFnsFormat(parsedDate, formatStr);
};

export const formatDateTime = (
  date: string | Date,
  formatStr: string = 'MMM dd, yyyy HH:mm'
): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return dateFnsFormat(parsedDate, formatStr);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatPercent = (value: number): string => {
  return `${value}%`;
};

export const truncate = (str: string, length: number = 50): string => {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
