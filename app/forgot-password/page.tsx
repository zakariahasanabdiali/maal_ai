'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react';

import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [sent, setSent] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 900));
    setSent(values.email);
    toast.success('Reset link sent');
  };

  if (sent) {
    return (
      <AuthShell
        title="Check your inbox"
        description={`We sent a password reset link to ${sent}.`}
        footer={
          <button
            onClick={() => router.push('/login')}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Back to sign in
          </button>
        }
      >
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-success/10 text-success">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <p className="text-sm text-muted-foreground">
            The link expires in 30 minutes. If you don&apos;t see it, check your
            spam folder.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <a href="/reset-password">Open reset form (demo)</a>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot password?"
      description="Enter your email and we'll send you a reset link."
      footer={
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-9"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending link…
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
