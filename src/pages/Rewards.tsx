import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, CheckCircle2, Leaf, Clock, XCircle, Gift, Tag, Star, QrCode } from 'lucide-react';
import { GCoinIcon } from '../components/GCoin';
import QRCode from 'react-qr-code';
import Barcode from 'react-barcode';
import type { Submission } from '../types';

// MyVoucherCard: compact card showing QR or Barcode
function MyVoucherCard({ uv, scanCode, isUsed }: { uv: any; scanCode: string; isUsed: boolean }) {
  const [displayMode, setDisplayMode] = useState<'qr' | 'barcode'>('qr');
  const v = uv.vouchers;
  const isFlat = v?.discount_type === 'flat';
  const discountLabel = isFlat ? `₹${v?.discount_value} OFF` : `${v?.discount_value}% OFF`;

  return (
    <div className={`bg-gradient-to-r from-[#1a3d1f] to-[#2e7d32] rounded-xl p-3.5 text-white shadow-md relative overflow-hidden ${isUsed ? 'opacity-50 grayscale' : ''}`}>
      <div className="absolute right-0 top-0 h-full w-24 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-amber-300 font-bold text-[10px] uppercase tracking-wider truncate">{v?.brand_name}</p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="bg-white/20 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">{discountLabel}</span>
            {isUsed && <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">Used</span>}
          </div>
        </div>
        <h3 className="font-black text-sm leading-tight mb-0.5 truncate">{v?.title}</h3>

        {/* QR / Barcode toggle */}
        {!isUsed && (
          <>
            <div className="flex rounded-md overflow-hidden border border-white/20 mb-2 mt-2">
              <button
                onClick={() => setDisplayMode('qr')}
                className={`flex-1 flex items-center justify-center gap-1 py-1 text-[10px] font-bold transition-colors cursor-pointer ${displayMode === 'qr' ? 'bg-white text-[#1a3d1f]' : 'text-white/70 hover:text-white'}`}
              >
                <QrCode className="w-2.5 h-2.5" /> QR Code
              </button>
              <button
                onClick={() => setDisplayMode('barcode')}
                className={`flex-1 flex items-center justify-center gap-1 py-1 text-[10px] font-bold transition-colors cursor-pointer ${displayMode === 'barcode' ? 'bg-white text-[#1a3d1f]' : 'text-white/70 hover:text-white'}`}
              >
                <Tag className="w-2.5 h-2.5" /> Barcode
              </button>
            </div>
            <div className="bg-white rounded-lg p-2 flex justify-center items-center overflow-hidden">
              {displayMode === 'qr' ? (
                <QRCode value={scanCode} size={80} level="M" />
              ) : (
                <Barcode
                  value={scanCode}
                  width={1.0}
                  height={45}
                  fontSize={8}
                  displayValue
                  background="#ffffff"
                  lineColor="#1a3d1f"
                />
              )}
            </div>
            <p className="text-center text-[9px] text-white/50 mt-1.5">Show this at the store to redeem</p>
          </>
        )}
        {isUsed && (
          <div className="bg-white/10 rounded-lg p-2 text-center text-xs text-white/60 mt-2">
            Redeemed · {uv.used_at ? new Date(uv.used_at).toLocaleDateString('en-IN') : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Rewards() {
  const { user, totalPoints, refreshPoints } = useAuth();
  const [activeTab, setActiveTab] = useState<'earn' | 'redeem'>('earn');

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [vouchers, setVouchers] = useState<any[]>([]);
  const [myVouchers, setMyVouchers] = useState<any[]>([]);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
      fetchVouchers();
      fetchMyVouchers();
      refreshPoints();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    if (!user) return;
    const { data } = await supabase.from('waste_submissions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setSubmissions(data as Submission[]);
  };

  const fetchVouchers = async () => {
    const { data } = await supabase.from('vouchers').select('*').eq('is_active', true);
    if (data) setVouchers(data);
  };

  const fetchMyVouchers = async () => {
    if (!user) return;
    // Client-side cleanup: delete used vouchers older than 1 day
    // (fallback when pg_cron not available)
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from('user_vouchers')
      .delete()
      .eq('user_id', user.id)
      .not('used_at', 'is', null)
      .lt('used_at', cutoff);

    const { data } = await supabase
      .from('user_vouchers')
      .select('*, vouchers(*)')
      .eq('user_id', user.id)
      .order('redeemed_at', { ascending: false });
    if (data) setMyVouchers(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && !f.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP).');
      e.target.value = '';
      return;
    }
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;
    setUploading(true);
    try {
      const nameParts = file.name.split('.');
      const fileExt = nameParts.length > 1 ? nameParts.pop() : file.type.split('/')[1] || 'jpg';
      const filePath = `${user.id}_${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('waste-images').upload(filePath, file, { cacheControl: '31536000' });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('waste-images').getPublicUrl(filePath);
      const { error: dbError } = await supabase.from('waste_submissions').insert({ user_id: user.id, image_url: publicUrl, status: 'pending' });
      if (dbError) throw dbError;
      setFile(null);
      setPreview(null);
      fetchSubmissions();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const totalEarned = submissions.filter((s: any) => s.status === 'approved').reduce((sum: number, s: any) => sum + (s.points_awarded || 0), 0);

  const buyVoucher = async (voucher: any) => {
    if (!user) return;
    if (totalPoints < voucher.points_cost) { alert("Not enough points!"); return; }
    
    // Check limit
    const limit = voucher.user_limit || 1;
    const boughtCount = myVouchers.filter((v: any) => v.voucher_id === voucher.id).length;
    if (boughtCount >= limit) {
      alert(`Limit reached! You can only buy this voucher ${limit} time(s).`);
      return;
    }

    if (voucher.end_date && new Date(voucher.end_date) < new Date()) {
      alert("This voucher has expired.");
      return;
    }

    setBuying(true);
    try {
      const { error: ledgerError } = await supabase.from('points_ledger').insert({ user_id: user.id, points_change: -voucher.points_cost, description: `Purchased voucher: ${voucher.title}` });
      if (ledgerError) throw ledgerError;
      const { error: voucherError } = await supabase.from('user_vouchers').insert({ user_id: user.id, voucher_id: voucher.id });
      if (voucherError) throw voucherError;
      await fetchMyVouchers();
      await refreshPoints();
      alert("Voucher purchased successfully! You can see it in 'My Vouchers'.");
    } catch (err: any) {
      alert("Failed to purchase: " + err.message);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="fade-in bottom-nav-safe">
      <Helmet>
        <title>Earn G Coins by Uploading Waste Photos | TechzGreen</title>
        <meta name="description" content="Submit plastic waste photos and earn green reward points. Redeem points for eco-friendly products or partner vouchers on TechzGreen." />
        <link rel="canonical" href="https://techzgreen.in/rewards" />
        <meta property="og:title" content="Earn G Coins by Uploading Waste Photos | TechzGreen" />
        <meta property="og:description" content="Submit plastic waste photos and earn green reward points. Redeem points for eco-friendly products or partner vouchers." />
        <meta property="og:url" content="https://techzgreen.in/rewards" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://techzgreen.in/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">

        {/* ── Hero ── */}
        <div className="glass-panel-dark mt-4 sm:mt-6 p-5 sm:p-8 relative overflow-hidden rounded-2xl mb-5">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
          <div className="relative z-10 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GCoinIcon size={32} />
                <h1 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>G Coins</h1>
              </div>
              <p className="text-[rgba(200,230,201,0.8)] text-xs sm:text-sm leading-relaxed max-w-sm">
                Submit waste photos to earn · redeem for vouchers & discounts!
              </p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <div className="stat-box-dark px-4 py-3 flex items-center gap-2">
                <GCoinIcon size={28} />
                <div>
                  <p className="stat-num text-2xl">{totalEarned}</p>
                  <p className="stat-label">Earned</p>
                </div>
              </div>
              <div className="stat-box-dark px-4 py-3 flex items-center gap-2">
                <GCoinIcon size={28} />
                <div>
                  <p className="stat-num text-2xl">{totalPoints}</p>
                  <p className="stat-label">Balance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex mb-5 bg-white/60 rounded-xl p-1 border border-[rgba(46,125,50,0.12)]">
          <button
            onClick={() => setActiveTab('earn')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${activeTab === 'earn' ? 'bg-[#2e7d32] text-white shadow-sm' : 'text-[#5f7a60] hover:text-[#2e7d32]'}`}
          >
            <UploadCloud className="w-4 h-4" /> Earn
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${activeTab === 'redeem' ? 'bg-[#ffb300] text-black shadow-sm' : 'text-[#5f7a60] hover:text-[#2e7d32]'}`}
          >
            <Gift className="w-4 h-4" /> Redeem
          </button>
        </div>

        {/* ── EARN TAB ── */}
        {activeTab === 'earn' && (
          <div className="fade-in pb-4">
            {/* Desktop: 2-col; Mobile: stacked */}
            <div className="sm:grid sm:grid-cols-2 sm:gap-6 space-y-5 sm:space-y-0">

              {/* Upload Card */}
              <div className="glass-panel p-5 sm:p-6 h-fit">
                <h2 className="text-lg font-bold text-[#1a3d1f] mb-4">Upload Evidence</h2>
                <form onSubmit={handleUpload} className="space-y-5">
                  <label className="block cursor-pointer">
                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${preview ? 'border-[#2e7d32] bg-[rgba(46,125,50,0.04)]' : 'border-[rgba(46,125,50,0.25)] hover:border-[#2e7d32] hover:bg-[rgba(46,125,50,0.03)]'}`}>
                      {preview ? (
                        <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-cover" />
                      ) : (
                        <>
                          <UploadCloud className="w-12 h-12 text-[rgba(46,125,50,0.4)] mx-auto mb-3" />
                          <p className="text-[#5f7a60] font-semibold">Click to browse or drag image here</p>
                          <p className="text-xs text-[#5f7a60] mt-1 opacity-70">JPG, PNG or WEBP accepted</p>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  {file && (
                    <p className="text-sm text-[#2e7d32] font-semibold bg-[rgba(46,125,50,0.08)] px-3 py-2 rounded-lg">
                      ✓ {file.name}
                    </p>
                  )}
                  <button type="submit" disabled={!file || uploading} className="btn-accent w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    {uploading ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Uploading...</> : <><UploadCloud className="w-4 h-4" /> Submit to Earn</>}
                  </button>
                </form>
              </div>

              {/* History */}
              <div className="glass-panel p-5 sm:p-6">
                <h2 className="text-lg font-bold text-[#1a3d1f] mb-4">Your History</h2>
                <div className="space-y-3 max-h-[360px] sm:max-h-[480px] overflow-y-auto pr-1">
                  {submissions.length === 0 && (
                    <div className="glass-panel p-8 text-center">
                      <Leaf className="w-10 h-10 text-[rgba(46,125,50,0.25)] mx-auto mb-2" />
                      <p className="text-[#5f7a60] font-medium">No submissions yet. Start earning!</p>
                    </div>
                  )}
                  {submissions.map((sub: any) => (
                    <div key={sub.id} className="glass-card p-4 flex gap-4 items-center">
                      <img src={sub.image_url} alt="Waste" loading="lazy" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="text-xs text-[#5f7a60] mb-1">{new Date(sub.created_at).toLocaleDateString()}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {sub.status === 'pending' && <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg"><Clock className="w-3 h-3" />Pending</span>}
                          {sub.status === 'approved' && <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg"><CheckCircle2 className="w-3 h-3" />Approved</span>}
                          {sub.status === 'rejected' && <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg"><XCircle className="w-3 h-3" />Rejected</span>}
                        </div>
                        {sub.status === 'approved' && (
                          <p className="text-sm font-black text-[#2e7d32] mt-1.5 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-[#ffb300] text-[#ffb300]" />+{sub.points_awarded} Points
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── REDEEM TAB ── */}
        {activeTab === 'redeem' && (
          <div className="fade-in space-y-6 pb-4">
            {/* Voucher Store */}
            <div>
              <h2 className="text-lg font-bold text-[#1a3d1f] mb-4 flex items-center gap-2"><Tag className="text-[#ffb300] w-5 h-5" />Voucher Store</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vouchers.map(v => {
                const isFlat = v.discount_type === 'flat';
                const discountLabel = isFlat ? `₹${v.discount_value} OFF` : `${v.discount_value}% OFF`;
                const limit = v.user_limit || 1;
                const boughtCount = myVouchers.filter((mv: any) => mv.voucher_id === v.id).length;
                const canBuyMore = boughtCount < limit;
                const isExpired = v.end_date && new Date(v.end_date) < new Date();
                
                return (
                  <div key={v.id} className={`glass-panel p-6 flex flex-col relative overflow-hidden group transition-colors ${isExpired ? 'opacity-75 grayscale-[0.5]' : 'hover:border-[#ffb300]'}`}>
                    {/* Voucher image */}
                    {v.image_url && <img src={v.image_url} alt={v.title} className="w-full h-28 object-cover rounded-xl mb-4" />}
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                    <div className="flex items-start justify-between gap-2 relative z-10">
                      <h3 className="font-bold text-xl text-[#1a3d1f]">{v.brand_name}</h3>
                      <span className={`text-xs font-black px-2 py-1 rounded-lg whitespace-nowrap flex-shrink-0 ${isFlat ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {discountLabel}
                      </span>
                    </div>
                    <p className="text-[#2e7d32] font-black text-xl mt-1 mb-2 relative z-10">{v.title}</p>
                    <p className="text-[#5f7a60] text-sm flex-grow relative z-10">{v.description}</p>
                    
                    <div className="mt-2 relative z-10">
                      <p className="text-xs font-bold text-[#ffb300]">
                        Limit: {boughtCount} / {limit} redeemed
                      </p>
                      {v.end_date && (
                        <p className={`text-xs font-bold mt-1 ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
                          Ends: {new Date(v.end_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[rgba(46,125,50,0.1)] flex items-center justify-between relative z-10">
                      <span className="font-bold text-[#ffb300] flex items-center gap-1"><GCoinIcon size={22} /> {v.points_cost} G Coins</span>
                      <button
                        onClick={() => buyVoucher(v)}
                        disabled={buying || totalPoints < v.points_cost || !canBuyMore || isExpired}
                        className={`text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:cursor-not-allowed cursor-pointer ${isExpired ? 'bg-gray-500' : 'bg-[#2e7d32] hover:bg-[#1b5e20] disabled:opacity-50'}`}
                      >
                        {isExpired ? 'Expired' : !canBuyMore ? 'Limit Reached' : totalPoints >= v.points_cost ? 'Activate Voucher' : 'Not enough G Coins'}
                      </button>
                    </div>
                  </div>
                );
              })}
                {vouchers.length === 0 && (
                  <div className="col-span-3 text-center py-10 text-gray-500">No vouchers available right now.</div>
                )}
              </div>
            </div>

            {/* My Vouchers */}
            <div>
              <h2 className="text-lg font-bold text-[#1a3d1f] mb-4 flex items-center gap-2"><Gift className="text-[#2e7d32] w-5 h-5" />My Vouchers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myVouchers.map(uv => {
                  // Always use row id as scan code — partner lookup checks qr_code then id
                  const scanCode = uv.id;
                  const isUsed = !!uv.used_at; // used_at is set on redemption
                  return (
                    <MyVoucherCard key={uv.id} uv={uv} scanCode={scanCode} isUsed={isUsed} />
                  );
                })}
                {myVouchers.length === 0 && (
                  <div className="col-span-2 glass-panel p-8 text-center">
                    <Gift className="w-10 h-10 text-[rgba(46,125,50,0.25)] mx-auto mb-2" />
                    <p className="text-[#5f7a60] font-medium">You haven't bought any vouchers yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
