import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Handshake, LogIn, Eye, EyeOff, ClipboardList, CheckCircle2 } from 'lucide-react';

export default function PartnerLogin() {
  const navigate = useNavigate();
  const { user, profileRole } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  
  // Track application status if logged in as user
  const [appStatus, setAppStatus] = useState<'none' | 'pending' | 'rejected' | 'approved'>('none');

  useEffect(() => {
    if (user && profileRole === 'partner') {
      navigate('/partner/dashboard');
    } else if (user && profileRole === 'user') {
      checkApplicationStatus();
    }
  }, [user, profileRole, navigate]);

  const checkApplicationStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('partner_profiles')
      .select('status')
      .eq('user_id', user.id)
      .single();
    if (data) {
      setAppStatus(data.status as any);
    }
  };

  const handleApply = async () => {
    setLoading(true); setError(null); setStatusMsg(null);
    try {
      if (!user) throw new Error('Must be logged in to apply.');
      const { error: insertErr } = await supabase.from('partner_profiles').insert({
        user_id: user.id,
        company_name: companyName,
        contact_email: email || user.email,
        status: 'pending'
      });
      if (insertErr) throw insertErr;
      setAppStatus('pending');
      setStatusMsg('Application submitted successfully! Waiting for approval.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setStatusMsg(null);
    try {
      if (isRegister) {
        // Sign up first
        const { data, error: authErr } = await supabase.auth.signUp({ email, password });
        if (authErr) {
          if (authErr.message.includes('already registered')) {
            // Try to login instead to apply
            const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
            if (signInErr) throw new Error('Account exists. Invalid password to login and apply.');
            // Proceed to apply
            const { error: insertErr } = await supabase.from('partner_profiles').insert({
              user_id: signInData.user.id,
              company_name: companyName,
              contact_email: email,
              status: 'pending'
            });
            if (insertErr) throw insertErr;
            setAppStatus('pending');
            return;
          }
          throw authErr;
        }
        if (!data.user) throw new Error('Signup failed.');
        
        // Wait briefly for profile trigger
        await new Promise(r => setTimeout(r, 1000));
        
        const { error: insertErr } = await supabase.from('partner_profiles').insert({
          user_id: data.user.id,
          company_name: companyName,
          contact_email: email,
          status: 'pending'
        });
        if (insertErr) throw insertErr;
        setAppStatus('pending');
        setStatusMsg('Registration successful! Waiting for admin approval.');
        setIsRegister(false);
        setPassword('');

      } else {
        // Login
        const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
        if (authErr) throw authErr;
        if (!data.user) throw new Error('Login failed.');
        
        // useEffect handles the redirect or status check
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#f0f7f0]">
      <Helmet>
        <title>Partner Portal – TechzGreen</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2e7d32] mb-4 shadow-lg">
            <Handshake className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#1a3d1f]">Partner Portal</h1>
          <p className="text-[#5f7a60] text-sm mt-1">TechzGreen Collaboration Partners</p>
        </div>

        <div className="glass-panel p-8">
          {error && <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">⚠ {error}</div>}
          {statusMsg && <div className="mb-5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">✅ {statusMsg}</div>}

          {user && profileRole === 'user' ? (
            <div className="text-center space-y-4">
              {appStatus === 'pending' && (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-2"><ClipboardList className="w-6 h-6" /></div>
                  <h2 className="text-lg font-bold text-[#1a3d1f]">Application Pending</h2>
                  <p className="text-sm text-[#5f7a60]">Your partner application is under review. Please check back later.</p>
                </>
              )}
              {appStatus === 'rejected' && (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-2"><Handshake className="w-6 h-6" /></div>
                  <h2 className="text-lg font-bold text-[#1a3d1f]">Application Rejected</h2>
                  <p className="text-sm text-[#5f7a60]">Your application was not approved at this time.</p>
                </>
              )}
              {appStatus === 'approved' && (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2"><CheckCircle2 className="w-6 h-6" /></div>
                  <h2 className="text-lg font-bold text-[#1a3d1f]">Application Approved!</h2>
                  <p className="text-sm text-[#5f7a60]">Your partner account is ready.</p>
                  <button onClick={() => window.location.reload()} className="btn-primary w-full !py-3 mt-4">Go to Dashboard</button>
                </>
              )}
              {appStatus === 'none' && (
                <div className="text-left">
                  <h2 className="text-lg font-bold text-[#1a3d1f] mb-4">Apply for Partner Access</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Company Name</label>
                      <input required value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. EcoBrand" className="input-glass w-full" />
                    </div>
                    <button onClick={handleApply} disabled={loading} className="btn-primary w-full !py-3 flex items-center justify-center gap-2">
                      {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Submit Application
                    </button>
                  </div>
                </div>
              )}
              <button onClick={() => supabase.auth.signOut()} className="text-sm text-red-500 hover:underline mt-4">Sign out</button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-6 p-1 bg-[rgba(46,125,50,0.05)] rounded-xl">
                <button type="button" onClick={() => setIsRegister(false)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isRegister ? 'bg-white text-[#2e7d32] shadow-sm' : 'text-[#5f7a60] hover:text-[#1a3d1f]'}`}>Login</button>
                <button type="button" onClick={() => setIsRegister(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isRegister ? 'bg-white text-[#2e7d32] shadow-sm' : 'text-[#5f7a60] hover:text-[#1a3d1f]'}`}>Apply</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div>
                    <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Company Name</label>
                    <input required value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. EcoBrand" className="input-glass" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Partner Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="partner@company.com" className="input-glass" autoComplete="email" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input-glass pr-10" autoComplete={isRegister ? "new-password" : "current-password"} />
                    <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f7a60] hover:text-[#1a3d1f]">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full !py-3 flex items-center justify-center gap-2 mt-2">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : isRegister ? 'Submit Application' : <><LogIn className="w-4 h-4" /> Sign In</>}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#5f7a60] mt-6">
          Regular user?{' '}
          <Link to="/login" className="text-[#2e7d32] font-bold hover:underline">Go to main login</Link>
        </p>
      </div>
    </div>
  );
}
