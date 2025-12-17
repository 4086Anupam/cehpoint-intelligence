import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { saveUser, isAuthenticated } from '@/lib/storage';
import { Sparkles, MailCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const authed = await isAuthenticated();
        if (mounted && authed) {
          router.replace('/discovery');
        }
      } catch (error) {
        console.error('Auth check failed', error);
      }
    };

    checkAuth();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: isSignup,
          emailRedirectTo: undefined, // Explicitly disable magic link redirect
          data: { 
            companyName: companyName || email.split('@')[0],
            full_name: companyName || email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      setOtpSent(true);
      toast.success('📧 OTP sent! Check your email for a 6-digit code.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      const supabaseUser = data.user ?? data.session?.user;
      if (!supabaseUser) {
        throw new Error('Unable to fetch user after verification.');
      }

      const appUser = {
        id: supabaseUser.id,
        email: supabaseUser.email || email,
        companyName:
          (supabaseUser.user_metadata as Record<string, any>)?.companyName ||
          companyName ||
          supabaseUser.email?.split('@')[0] ||
          '',
        createdAt: supabaseUser.created_at || new Date().toISOString(),
      };

      saveUser(appUser);
      toast.success('✅ Authentication successful!');
      router.replace('/discovery');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid or expired OTP';
      toast.error(message);
      setOtp(''); // Clear OTP on error
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsSignup(!isSignup);
    setCompanyName('');
    setOtp('');
    setOtpSent(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 page-transition">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Cehpoint
            </h1>
          </div>
          <p className="text-gray-600 text-lg">AI-Powered IT & Security Solutions</p>
        </div>

        <Card>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {otpSent ? 'Check your email' : isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {otpSent
                ? 'Enter the OTP we sent to your email to continue.'
                : isSignup
                  ? 'Start your journey to smarter business solutions'
                  : 'Continue discovering tailored solutions'}
            </p>
          </div>

          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@company.com"
              required
            />

            {isSignup && !otpSent && (
              <Input
                label="Company Name"
                value={companyName}
                onChange={setCompanyName}
                placeholder="Your Company Name"
                required
              />
            )}

            {otpSent && (
              <div>
                <Input
                  label="One-Time Passcode"
                  type="text"
                  value={otp}
                  onChange={(val) => setOtp(val.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 -mb-2">
                  Check your email inbox (and spam folder) for the OTP code
                </p>
              </div>
            )}

            <Button type="submit" fullWidth size="lg" className="mt-4" disabled={loading}>
              {loading
                ? 'Please wait...'
                : otpSent
                  ? 'Verify OTP'
                  : isSignup
                    ? 'Send OTP to Email'
                    : 'Send OTP to Email'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <button
              onClick={handleToggleMode}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignup
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </button>

            {otpSent && (
              <button
                onClick={() => {
                  setOtp('');
                  setOtpSent(false);
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Didn&apos;t receive the code? Resend
              </button>
            )}
          </div>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MailCheck className="w-4 h-4 text-blue-600" />
              <span>Secure email OTP</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Supabase Auth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
