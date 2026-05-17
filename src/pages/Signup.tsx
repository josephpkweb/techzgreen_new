import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ZLeaf } from '../components/ZLeaf';
import { supabase } from '../lib/supabase';
import { UserPlus, Phone, User } from 'lucide-react';

export default function Signup() {
  // Step 1: collect name + phone. Step 2: Google OAuth redirect
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Name is required.'); return; }
    if (!phone.trim() || !/^\+?[\d\s\-]{7,15}$/.test(phone.trim())) {
      setError('Enter a valid phone number.'); return;
    }
    setStep(2);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      // Store name+phone temporarily so the OAuth callback can use them
      sessionStorage.setItem('signup_name', name.trim());
      sessionStorage.setItem('signup_phone', phone.trim());

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/',
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-12">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2e7d32] rounded-2xl mb-4 shadow-lg">
            <ZLeaf className="w-8 h-8" color="white" />
          </div>
          <h1 className="text-3xl font-black text-[#1a3d1f]">Join TechzGreen</h1>
          <p className="text-[#5f7a60] mt-1 text-sm">Start your eco-rewards journey today</p>
        </div>

        <div className="glass-panel p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
          )}

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${step >= 1 ? 'bg-[#2e7d32] text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
            <div className={`flex-1 h-0.5 rounded transition-all ${step >= 2 ? 'bg-[#2e7d32]' : 'bg-gray-200'}`} />
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${step >= 2 ? 'bg-[#2e7d32] text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
          </div>

          {/* ── Step 1: Name + Phone ── */}
          {step === 1 && (
            <form onSubmit={handleContinue} className="space-y-4">
              <p className="text-sm font-bold text-[#2d4a30]">Tell us about yourself</p>

              <div>
                <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="input-glass"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="input-glass"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
                <p className="text-[10px] text-[#5f7a60] mt-1">Used for account recovery and eco-event updates only.</p>
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 !py-3">
                <UserPlus className="w-4 h-4" /> Continue
              </button>
            </form>
          )}

          {/* ── Step 2: Google Sign-in ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-[rgba(46,125,50,0.06)] border border-[rgba(46,125,50,0.2)] rounded-xl px-4 py-3">
                <p className="text-xs text-[#5f7a60] font-semibold uppercase tracking-wide mb-1">Registering as</p>
                <p className="font-black text-[#1a3d1f]">{name}</p>
                <p className="text-xs text-[#5f7a60]">{phone}</p>
              </div>

              <p className="text-sm font-bold text-[#2d4a30]">Complete with Google</p>
              <p className="text-xs text-[#5f7a60]">
                We only support sign-in via Gmail to keep your account secure.
              </p>

              <button
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 font-bold py-3 px-4 rounded-xl transition-all shadow-sm text-gray-700 cursor-pointer disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                {loading ? 'Redirecting to Google…' : 'Sign up with Google'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-[#5f7a60] hover:text-[#2e7d32] font-semibold transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          <p className="text-center text-sm text-[#5f7a60]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2e7d32] font-bold hover:underline cursor-pointer">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
