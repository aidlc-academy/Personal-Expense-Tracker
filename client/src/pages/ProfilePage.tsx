import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../stores/AuthContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { useApiError } from '../hooks/useApiError';
import * as usersApi from '../api/users.api';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  currency: z.string().length(3, 'Currency code must be 3 letters').toUpperCase(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const profileError = useApiError();
  const passwordError = useApiError();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', currency: user?.currency ?? 'INR' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    profileError.clearError(); setProfileSuccess(false);
    try { await usersApi.updateProfile(data); await refreshUser(); setProfileSuccess(true); }
    catch (err) { profileError.handleError(err); }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    passwordError.clearError(); setPasswordSuccess(false);
    try {
      await usersApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      passwordForm.reset();
      setPasswordSuccess(true);
    } catch (err) { passwordError.handleError(err); }
  };

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account details and preferences" />

      {/* max-w-2xl keeps it comfortable on wide screens.
          The parent AppLayout wrapper already provides pb-nav (≥64px + safe-area)
          so all three cards are reachable on mobile without the nav covering them. */}
      <div className="p-4 lg:p-6 max-w-2xl space-y-5">

        {/* ── Profile Information ────────────────── */}
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Profile Information</h2>
              <p className="text-xs text-slate-500">Update your display name and currency</p>
            </div>
          </div>

          {profileError.error && <Alert message={profileError.error} onClose={profileError.clearError} className="mb-4" />}
          {profileSuccess && <Alert variant="success" message="Profile updated successfully" onClose={() => setProfileSuccess(false)} className="mb-4" />}

          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} noValidate className="space-y-4">
            <Input label="Full name" type="text" autoComplete="name"
              error={profileForm.formState.errors.name?.message}
              {...profileForm.register('name')} />
            <Input label="Email address" type="email" value={user?.email ?? ''} disabled
              helperText="Email address cannot be changed" />
            <Input label="Currency code" placeholder="INR" maxLength={3}
              error={profileForm.formState.errors.currency?.message}
              helperText="3-letter ISO 4217 code — e.g. INR, USD, EUR"
              {...profileForm.register('currency')} />
            <div className="flex justify-end pt-1">
              <Button type="submit" loading={profileForm.formState.isSubmitting}>
                <CheckCircle size={15} /> Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* ── Change Password ────────────────────── */}
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Lock size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Change Password</h2>
              <p className="text-xs text-slate-500">Use a strong password with uppercase letters and numbers</p>
            </div>
          </div>

          {passwordError.error && <Alert message={passwordError.error} onClose={passwordError.clearError} className="mb-4" />}
          {passwordSuccess && <Alert variant="success" message="Password changed successfully" onClose={() => setPasswordSuccess(false)} className="mb-4" />}

          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} noValidate className="space-y-4">
            <Input label="Current password" type="password" autoComplete="current-password"
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register('currentPassword')} />
            <Input label="New password" type="password" autoComplete="new-password"
              helperText="Min 8 characters, one uppercase letter, one number"
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register('newPassword')} />
            <Input label="Confirm new password" type="password" autoComplete="new-password"
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register('confirmPassword')} />
            <div className="flex justify-end pt-1">
              <Button type="submit" loading={passwordForm.formState.isSubmitting}>
                <Lock size={15} /> Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* ── Account Information ────────────────── */}
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-700/60 text-slate-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Account Information</h2>
              <p className="text-xs text-slate-500">Your membership details</p>
            </div>
          </div>
          <dl className="divide-y divide-slate-800">
            {[
              { label: 'User ID',          value: `#${user?.id}`        },
              { label: 'Member since',     value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
              { label: 'Default currency', value: user?.currency ?? 'INR' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
                <dd className="text-sm font-medium text-slate-300 font-tabular">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

      </div>
    </div>
  );
}
