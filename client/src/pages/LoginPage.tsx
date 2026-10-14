import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IndianRupee, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../stores/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { useApiError } from '../hooks/useApiError';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { error, clearError, handleError } = useApiError();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    clearError();
    try { await login(data.email, data.password); navigate('/', { replace: true }); }
    catch (err) { handleError(err); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1120] px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-xl shadow-emerald-900/40">
            <IndianRupee size={26} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">MONETRA</h1>
          <p className="mt-1 text-sm text-slate-500">Personal Finance, Beautifully Managed</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-black/30">
          <h2 className="mb-6 text-base font-semibold text-slate-100">Sign in to your account</h2>

          {error && <Alert message={error} onClose={clearError} className="mb-5" />}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                error={errors.password?.message}
                className="pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[34px] text-slate-600 hover:text-slate-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full mt-2" size="lg">
              Sign in
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
            <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Demo account</p>
            <p className="text-xs text-slate-600">Email: <span className="text-slate-300">demo@example.com</span></p>
            <p className="text-xs text-slate-600">Password: <span className="text-slate-300">Demo@1234</span></p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
