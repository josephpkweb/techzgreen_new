import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, CheckCircle2, Clock, XCircle, Gift, Tag, Star, QrCode, Share2, X as XIcon } from 'lucide-react';
import { GCoinIcon } from '../components/GCoin';
import { ZLeaf } from '../components/ZLeaf';
import { QRCode } from 'react-qr-code';
import Barcode from 'react-barcode';
import { useToast } from '../components/Toast';
import type { Submission } from '../types';

/* ── Premium Voucher Modal ── */
function VoucherModal({ uv, scanCode, isUsed, onClose }: { uv: any; scanCode: string; isUsed: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'qr'|'barcode'>('qr');
  const { toast } = useToast();
  const v = uv.vouchers;
  const isFlat = v?.discount_type === 'flat';
  const discountLabel = isFlat ? `₹${v?.discount_value} OFF` : `${v?.discount_value}% OFF`;
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const msg = `🌿 I got a ${discountLabel} voucher for ${v?.brand_name} on TechzGreen!\nRedeem eco-friendly rewards at: https://techzgreen.in/rewards\nCode: ${scanCode}`;
    if (navigator.share) {
      try { await navigator.share({ title: `${v?.brand_name} Voucher - TechzGreen`, text: msg, url: 'https://techzgreen.in/rewards' }); }
      catch {}
    } else {
      await navigator.clipboard.writeText(msg);
      toast('Voucher details copied to clipboard!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div ref={ticketRef} className="relative w-full max-w-sm" onClick={e => e.stopPropagation()}>
        {/* Ticket body */}
        <div className={`rounded-3xl overflow-hidden shadow-2xl ${isUsed ? 'grayscale opacity-70' : ''}`}>
          {/* Top section — dark green */}
          <div className="bg-gradient-to-br from-[#0d2611] via-[#1a3d1f] to-[#2e7d32] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-10" />
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-amber-400 font-black text-[11px] uppercase tracking-widest mb-1">{v?.brand_name}</p>
                  <h2 className="text-white font-black text-2xl leading-tight">{v?.title}</h2>
                </div>
                <div className="bg-amber-400 text-[#0d2611] font-black text-sm px-3 py-1.5 rounded-xl flex-shrink-0">{discountLabel}</div>
              </div>
              {v?.description && <p className="text-white/60 text-xs leading-relaxed">{v.description}</p>}
              {isUsed && <div className="mt-3 bg-red-500/20 border border-red-400/30 rounded-xl px-3 py-1.5 text-red-300 text-xs font-bold text-center">✗ REDEEMED</div>}
            </div>
          </div>

          {/* Ticket tear line */}
          <div className="bg-[#1a3d1f] flex items-center relative h-6">
            <div className="absolute -left-3 w-6 h-6 bg-black/60 rounded-full" />
            <div className="absolute -right-3 w-6 h-6 bg-black/60 rounded-full" />
            <div className="w-full border-t-2 border-dashed border-white/20 mx-6" />
          </div>

          {/* Bottom section — white */}
          <div className="bg-white p-6">
            {!isUsed ? (
              <>
                {/* Toggle */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-4">
                  {(['qr','barcode'] as const).map(m => (
                    <button key={m} onClick={() => setMode(m)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold transition-colors cursor-pointer ${mode === m ? 'bg-[#2e7d32] text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                      {m === 'qr' ? <QrCode className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
                      {m === 'qr' ? 'QR Code' : 'Barcode'}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center items-center bg-gray-50 rounded-2xl p-4 min-h-[120px]">
                  {mode === 'qr'
                    ? <QRCode value={scanCode} size={100} level="M" />
                    : <Barcode value={scanCode} width={1.2} height={55} fontSize={9} displayValue background="#f9fafb" lineColor="#1a3d1f" />
                  }
                </div>
                <p className="text-center font-mono font-black text-[#1a3d1f] text-sm tracking-widest mt-3 bg-gray-100 rounded-xl py-2 px-3">{scanCode}</p>
                <p className="text-center text-[10px] text-gray-400 mt-2">Show QR or barcode at store to redeem</p>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm">Redeemed on {uv.used_at ? new Date(uv.used_at).toLocaleDateString('en-IN') : '—'}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold text-sm py-3 rounded-2xl transition-colors cursor-pointer">
                <Share2 className="w-4 h-4" /> Share Voucher
              </button>
              <button onClick={onClose}
                className="w-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors cursor-pointer">
                <XIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Compact grid card (click to open modal) ── */
function MyVoucherCard({ uv, scanCode, isUsed }: { uv: any; scanCode: string; isUsed: boolean }) {
  const [open, setOpen] = useState(false);
  const v = uv.vouchers;
  const isFlat = v?.discount_type === 'flat';
  const discountLabel = isFlat ? `₹${v?.discount_value} OFF` : `${v?.discount_value}% OFF`;

  return (
    <>
      <button onClick={() => setOpen(true)}
        className={`w-full text-left bg-gradient-to-br from-[#1a3d1f] to-[#2e7d32] rounded-2xl p-4 shadow-md relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform ${isUsed ? 'opacity-50 grayscale' : ''}`}>
        <div className="absolute right-0 top-0 h-full w-20 bg-white/5 rounded-full blur-xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-amber-400 font-black text-[10px] uppercase tracking-wider truncate">{v?.brand_name}</p>
            <span className="bg-amber-400 text-[#0d2611] font-black text-[10px] px-2 py-0.5 rounded-lg flex-shrink-0">{discountLabel}</span>
          </div>
          <p className="text-white font-black text-base leading-tight truncate mb-1">{v?.title}</p>
          <p className="text-white/50 text-[10px]">{isUsed ? '✗ Used' : 'Tap to view & share'}</p>
        </div>
      </button>
      {open && <VoucherModal uv={uv} scanCode={scanCode} isUsed={isUsed} onClose={() => setOpen(false)} />}
    </>
  );
}

export default function Rewards() {
  const { user, totalPoints, refreshPoints } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'earn' | 'store' | 'vouchers'>('earn');

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
      toast('Please select an image file (JPG, PNG, WEBP).', 'warning');
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
      toast(error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const totalEarned = submissions.filter((s: any) => s.status === 'approved').reduce((sum: number, s: any) => sum + (s.points_awarded || 0), 0);

  const buyVoucher = async (voucher: any) => {
    if (!user) return;
    if (totalPoints < voucher.points_cost) { toast('Not enough Z Coins!', 'error'); return; }
    
    // Check limit
    const limit = voucher.user_limit || 1;
    const boughtCount = myVouchers.filter((v: any) => v.voucher_id === voucher.id).length;
    if (boughtCount >= limit) {
      toast(`Limit reached! Max ${limit} per user.`, 'warning');
      return;
    }

    if (voucher.end_date && new Date(voucher.end_date) < new Date()) {
      toast('This voucher has expired.', 'warning');
      return;
    }

    setBuying(true);
    try {
      const { error: ledgerError } = await supabase.from('points_ledger').insert({ user_id: user.id, points_change: -voucher.points_cost, description: `Purchased voucher: ${voucher.title}` });
      if (ledgerError) throw ledgerError;
      const genCode = () => Array.from({ length: 10 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');
      const qr_code = genCode();
      const { error: voucherError } = await supabase.from('user_vouchers').insert({ user_id: user.id, voucher_id: voucher.id, qr_code });
      if (voucherError) throw voucherError;
      await fetchMyVouchers();
      await refreshPoints();
      toast('Voucher activated! Check My Vouchers tab.', 'success');
    } catch (err: any) {
      toast('Failed to purchase: ' + err.message, 'error');
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="fade-in bottom-nav-safe">
      <Helmet>
        <title>Earn Z Coins by Uploading Waste Photos | TechzGreen</title>
        <meta name="description" content="Submit plastic waste photos and earn green reward points. Redeem points for eco-friendly products or partner vouchers on TechzGreen." />
        <link rel="canonical" href="https://techzgreen.in/rewards" />
        <meta property="og:title" content="Earn Z Coins by Uploading Waste Photos | TechzGreen" />
        <meta property="og:description" content="Submit plastic waste photos and earn green reward points. Redeem points for eco-friendly products or partner vouchers." />
        <meta property="og:url" content="https://techzgreen.in/rewards" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://techzgreen.in/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">

        {/* ── Hero ── */}
        <div className="glass-panel-dark mt-4 sm:mt-5 p-4 sm:p-5 relative overflow-hidden rounded-2xl mb-5">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex-shrink-0"><GCoinIcon size={36} /></div>
            <div className="flex-grow min-w-0">
              <h1 className="text-base font-black text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>Z Coins</h1>
              <p className="text-[rgba(200,230,201,0.7)] text-[11px] leading-snug">Submit waste · earn coins · redeem vouchers</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <div className="stat-box-dark px-3 py-2 flex flex-col items-center gap-0.5">
                <p className="stat-num !text-lg text-center">{totalEarned}</p>
                <p className="stat-label text-center !text-[9px]">Earned</p>
              </div>
              <div className="stat-box-dark px-3 py-2 flex flex-col items-center gap-0.5">
                <p className="stat-num !text-lg text-center">{totalPoints}</p>
                <p className="stat-label text-center !text-[9px]">Balance</p>
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
            <UploadCloud className="w-4 h-4 hidden sm:block" /> Earn
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${activeTab === 'store' ? 'bg-[#ffb300] text-black shadow-sm' : 'text-[#5f7a60] hover:text-[#2e7d32]'}`}
          >
            <Tag className="w-4 h-4 hidden sm:block" /> Store
          </button>
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${activeTab === 'vouchers' ? 'bg-[#2e7d32] text-white shadow-sm' : 'text-[#5f7a60] hover:text-[#2e7d32]'}`}
          >
            <Gift className="w-4 h-4 hidden sm:block" /> My Vouchers
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
                      <ZLeaf className="w-10 h-10 mx-auto mb-2 opacity-50" color="green" />
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

        {/* ── STORE TAB ── */}
        {activeTab === 'store' && (
          <div className="fade-in pb-4">
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
                  <div key={v.id} className={`glass-panel p-4 sm:p-6 flex flex-col relative overflow-hidden group transition-colors ${isExpired ? 'opacity-75 grayscale-[0.5]' : 'hover:border-[#ffb300]'}`}>
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
                      <span className="font-bold text-[#ffb300] flex items-center gap-1"><GCoinIcon size={22} /> {v.points_cost} Z Coins</span>
                      <button
                        onClick={() => buyVoucher(v)}
                        disabled={buying || totalPoints < v.points_cost || !canBuyMore || isExpired}
                        className={`text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors disabled:cursor-not-allowed cursor-pointer whitespace-nowrap ${isExpired ? 'bg-gray-500' : 'bg-[#2e7d32] hover:bg-[#1b5e20] disabled:opacity-50'}`}
                      >
                        {isExpired ? 'Expired' : !canBuyMore ? 'Limit Reached' : totalPoints >= v.points_cost ? 'Activate' : 'Not Enough'}
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
          </div>
        )}

        {/* ── MY VOUCHERS TAB ── */}
        {activeTab === 'vouchers' && (
          <div className="fade-in pb-4">
            {/* My Vouchers */}
            <div>
              <h2 className="text-lg font-bold text-[#1a3d1f] mb-4 flex items-center gap-2"><Gift className="text-[#2e7d32] w-5 h-5" />My Vouchers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myVouchers.map(uv => {
                  // Use short qr_code if set, fallback to row id for legacy rows
                  const scanCode = uv.qr_code || uv.id;
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
