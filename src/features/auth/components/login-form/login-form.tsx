import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '../../api/login';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      // Navigate to dashboard after successful login
      navigate('/', { replace: true });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Login failed. Please check your credentials.',
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

      <Button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting || loginMutation.isPending}
      >
        {isSubmitting || loginMutation.isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
