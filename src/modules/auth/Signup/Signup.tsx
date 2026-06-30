import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@shared/components';
import { useSignup, useVerifyOTP, useResendOTP } from '@/hooks/useAuth';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { GoogleIcon } from '@shared/components/icons/GoogleIcon';
import styles from './Signup.module.css';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  referralCode: z.string().optional(),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type SignupForm = z.infer<typeof signupSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function Signup() {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const referralFromUrl = searchParams.get('ref') || '';

  const { mutate: signup, isPending: signupPending } = useSignup();
  const { mutate: verifyOTP, isPending: verifyPending } = useVerifyOTP();
  const { mutate: resendOTP, isPending: resendPending } = useResendOTP();
  const { ref: cardRef, handleKeyDown } = useFocusTrap<HTMLDivElement>();

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { referralCode: referralFromUrl },
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

  const onSignup = (data: SignupForm) => {
    signup(data, {
      onSuccess: () => {
        setEmail(data.email);
        setStep('otp');
      },
    });
  };

  const onVerify = (data: OTPForm) => {
    verifyOTP({ email, otp: data.otp });
  };

  return (
    <>
      <Helmet>
        <title>Sign up — STORE</title>
      </Helmet>
      <div className={styles.card} ref={cardRef} onKeyDown={handleKeyDown}>
        {step === 'form' ? (
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>Create your account</h1>
              <p className={styles.subtitle}>Start shopping in minutes</p>
            </div>

            {/* Social signup first */}
            <Button
              type="button"
              variant="secondary"
              fullWidth
              size="lg"
              leftIcon={<GoogleIcon />}
              onClick={() => { window.location.href = '/api/auth/google'; }}
            >
              Continue with Google
            </Button>

            <div className={styles.divider}>
              <span className={styles.dividerText}>or</span>
            </div>

            <form onSubmit={signupForm.handleSubmit(onSignup)} className={styles.form}>
              <div className={styles.row}>
                <Input
                  label="Full name"
                  placeholder="John Doe"
                  autoComplete="name"
                  autoFocus
                  error={signupForm.formState.errors.name?.message}
                  {...signupForm.register('name')}
                />
                <Input
                  label="Phone (optional)"
                  type="tel"
                  placeholder="+91 9876543210"
                  {...signupForm.register('phone')}
                />
              </div>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={signupForm.formState.errors.email?.message}
                {...signupForm.register('email')}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                error={signupForm.formState.errors.password?.message}
                rightIcon={
                  <button type="button" className={styles.eyeToggle} onClick={() => setShowPassword((p) => !p)} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                {...signupForm.register('password')}
              />
              <Input
                label="Referral code (optional)"
                placeholder="ABC123"
                {...signupForm.register('referralCode')}
              />
              <Button type="submit" fullWidth loading={signupPending} size="lg">
                Create account
              </Button>
            </form>

            <p className={styles.footer}>
              Already have an account?{' '}
              <Link to="/login" className={styles.link}>
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>Verify your email</h1>
              <p className={styles.subtitle}>
                Enter the 6-digit code sent to <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={otpForm.handleSubmit(onVerify)} className={styles.form} autoComplete="off">
              {/* Hidden field to absorb Chrome autofill */}
              <input type="email" name="hidden-email" autoComplete="email" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
              <Input
                label="Verification code"
                type="tel"
                placeholder="000000"
                maxLength={6}
                autoComplete="off"
                id="otp-input"
                error={otpForm.formState.errors.otp?.message}
                {...otpForm.register('otp')}
              />
              <Button type="submit" fullWidth loading={verifyPending} size="lg">
                Verify & Create Account
              </Button>
              <Button
                type="button"
                variant="ghost"
                fullWidth
                size="sm"
                loading={resendPending}
                onClick={() => resendOTP({ email, type: 'signup' })}
              >
                Resend code
              </Button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

