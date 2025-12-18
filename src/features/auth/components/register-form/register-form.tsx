import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRegister } from '../../api/register';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      toast({
        title: 'Account created!',
        description: 'You can now sign in with your credentials.',
      });

      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error?.message || 'An error occurred during registration.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-group">
        <Label htmlFor="email" style={{ color: 'var(--color-text-secondary)' }}>Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            borderColor: errors.email ? 'var(--color-danger)' : 'var(--color-border)'
          }}
        />
        {errors.email && (
          <p className="text-sm mt-1" style={{ color: 'var(--color-danger)' }}>
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="form-group">
        <Label htmlFor="password" style={{ color: 'var(--color-text-secondary)' }}>Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            borderColor: errors.password ? 'var(--color-danger)' : 'var(--color-border)'
          }}
        />
        {errors.password && (
          <p className="text-sm mt-1" style={{ color: 'var(--color-danger)' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="form-group">
        <Label htmlFor="confirmPassword" style={{ color: 'var(--color-text-secondary)' }}>Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            borderColor: errors.confirmPassword ? 'var(--color-danger)' : 'var(--color-border)'
          }}
        />
        {errors.confirmPassword && (
          <p className="text-sm mt-1" style={{ color: 'var(--color-danger)' }}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting || registerMutation.isPending}
      >
        {isSubmitting || registerMutation.isPending ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}
