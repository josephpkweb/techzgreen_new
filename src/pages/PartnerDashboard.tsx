import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  Handshake, LogOut, QrCode, History, BarChart3,
  CheckCircle2, XCircle, AlertTriangle, Loader2,
  Receipt, TrendingDown, IndianRupee
} from 'lucide-react';
import QRScanner from '../components/QRScanner';

type SubTab = 'scan' | 'vouchers' | 'history' | 'analytics';

interface RedemptionResult {
  status: 'valid' | 'used' | 'invalid';
  userVoucher?: any;
  voucher?: any;
  message?: string;
}

interface BillState {
  bill: string;
  confirming: boolean;
  confirmed: boolean;
  finalAmount: number;
  discount: number;
}

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const { user, profileRole, loading, signOut } = useAuth();
  const [subTab, setSubTab] = useState<SubTab>('scan');
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [lookupResult, setLookupResult] = useState<RedemptionResult | null>(null);
  const [looking, setLooking] = useState(false);
  const [billState, setBillState] = useState<BillState | null>(null);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    totalRedemptions: 0,
    totalDiscount: 0,
    totalBilled: 0,
    settlementOwed: 0,
  });
  const [activeVouchers, setActiveVouchers] = useState<any[]>([]);
  const [scanKey, setScanKey] = useState(0); // force reset scanner

  // Auth guard
  useEffect(() => {
    if (loading) return;
    if (!user || profileRole !== 'partner') {
      navigate('/partner/login');
    }
  }, [user, profileRole, loading, navigate]);

  // Load partner profile
  useEffect(() => {
    if (user && profileRole === 'partner') {
      loadPartnerProfile();
    }
  }, [user, profileRole]);

  const loadPartnerProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('partner_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (data) setPartnerProfile(data);
  };

  const loadHistory = useCallback(async () => {
    if (!partnerProfile) return;
    const { data } = await supabase
      .from('user_vouchers')
      .select('*, vouchers(title, brand_name, discount_type, discount_value)')
      .eq('used_by_partner_id', partnerProfile.id)
      .not('used_at', 'is', null)
      .order('used_at', { ascending: false });
    if (data) setRedemptions(data);
  }, [partnerProfile]);

  const loadActiveVouchers = useCallback(async () => {
    if (!partnerProfile) return;
    // Fetch all unredeemed user_vouchers with their voucher data,
    // then filter client-side by partner_id (PostgREST can't filter on related table columns)
    const { data, error } = await supabase
      .from('user_vouchers')
      .select('*, vouchers(*)')
      .is('used_at', null);
    if (error) { console.error('loadActiveVouchers:', error); return; }
    const filtered = (data || []).filter(
      (uv: any) => uv.vouchers?.partner_id === partnerProfile.id
    );
    setActiveVouchers(filtered);
  }, [partnerProfile]);


  const loadAnalytics = useCallback(async () => {
    if (!partnerProfile) return;
    const { data } = await supabase
      .from('user_vouchers')
      .select('bill_amount, final_amount, settlement_amount')
      .eq('used_by_partner_id', partnerProfile.id)
      .not('used_at', 'is', null);
    if (data) {
      const totals = data.reduce((acc, row) => ({
        totalRedemptions: acc.totalRedemptions + 1,
        totalBilled: acc.totalBilled + (Number(row.bill_amount) || 0),
        totalDiscount: acc.totalDiscount + (Number(row.settlement_amount) || 0),
        settlementOwed: acc.settlementOwed + (Number(row.settlement_amount) || 0),
      }), { totalRedemptions: 0, totalBilled: 0, totalDiscount: 0, settlementOwed: 0 });
      setAnalytics(totals);
    }
  }, [partnerProfile]);

  useEffect(() => {
    if (subTab === 'history') loadHistory();
    if (subTab === 'vouchers') loadActiveVouchers();
    if (subTab === 'analytics') { loadHistory(); loadAnalytics(); }
  }, [subTab, partnerProfile, loadHistory, loadActiveVouchers, loadAnalytics]);

  // Look up a scanned code
  const handleScan = async (code: string) => {
    if (!partnerProfile) return;
    setLooking(true);
    setLookupResult(null);
    setBillState(null);
    try {
      // Search by qr_code first; fallback to id (covers old rows where qr_code is NULL)
      let data: any = null;

      const byQr = await supabase
        .from('user_vouchers')
        .select('*, vouchers(*)')
        .eq('qr_code', code)
        .maybeSingle();

      if (byQr.error) throw byQr.error;

      if (byQr.data) {
        data = byQr.data;
      } else {
        // Fallback: try matching by row id (user's QR displayed uv.id)
        const byId = await supabase
          .from('user_vouchers')
          .select('*, vouchers(*)')
          .eq('id', code)
          .maybeSingle();
        if (byId.error) throw byId.error;
        data = byId.data;
      }

      if (!data) {
        setLookupResult({ status: 'invalid', message: 'Voucher not found. Check the code and try again.' });
        return;
      }

      if (data.used_at) {
        setLookupResult({
          status: 'used',
          userVoucher: data,
          voucher: data.vouchers,
          message: `Already redeemed on ${new Date(data.used_at).toLocaleString('en-IN')}`
        });
        return;
      }

      // Check voucher is linked to this partner (if partner restriction set)
      if (data.vouchers?.partner_id && data.vouchers.partner_id !== partnerProfile.id) {
        setLookupResult({ status: 'invalid', message: 'This voucher is not valid at your store.' });
        return;
      }

      // Check voucher expiration
      if (data.vouchers?.end_date) {
        const endDate = new Date(data.vouchers.end_date);
        if (new Date() > endDate) {
          setLookupResult({ status: 'invalid', message: `This voucher expired on ${endDate.toLocaleDateString('en-IN')}.` });
          return;
        }
      }

      setLookupResult({ status: 'valid', userVoucher: data, voucher: data.vouchers });
    } catch (err: any) {
      setLookupResult({ status: 'invalid', message: err.message });
    } finally {
      setLooking(false);
    }
  };


  // Calculate discount
  const calcDiscount = (bill: number, voucher: any): { discount: number; final: number } => {
    if (!bill || bill <= 0) return { discount: 0, final: bill };
    if (voucher.discount_type === 'flat') {
      const discount = Math.min(voucher.discount_value, bill);
      return { discount, final: bill - discount };
    } else {
      const discount = (bill * voucher.discount_value) / 100;
      return { discount: Math.round(discount * 100) / 100, final: Math.round((bill - discount) * 100) / 100 };
    }
  };

  const handleBillChange = (val: string) => {
    const bill = parseFloat(val) || 0;
    const { discount, final } = calcDiscount(bill, lookupResult?.voucher);
    setBillState({ bill: val, confirming: false, confirmed: false, finalAmount: final, discount });
  };

  // Confirm redemption — atomic update
  const handleConfirmRedemption = async () => {
    if (!lookupResult?.userVoucher || !partnerProfile || !billState) return;
    const bill = parseFloat(billState.bill);
    if (!bill || bill <= 0) { alert('Enter a valid bill amount.'); return; }

    setBillState(s => s ? { ...s, confirming: true } : s);
    try {
      const { error } = await supabase
        .from('user_vouchers')
        .update({
          used_at: new Date().toISOString(),
          used_by_partner_id: partnerProfile.id,
          bill_amount: bill,
          final_amount: billState.finalAmount,
          settlement_amount: billState.discount,
        })
        .eq('id', lookupResult.userVoucher.id)
        .is('used_at', null); // prevents double-redemption race

      if (error) throw error;
      setBillState(s => s ? { ...s, confirming: false, confirmed: true } : s);
    } catch (err: any) {
      alert('Redemption failed: ' + err.message);
      setBillState(s => s ? { ...s, confirming: false } : s);
    }
  };

  const resetScan = () => {
    setLookupResult(null);
    setBillState(null);
    setScanKey(k => k + 1);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/partner/login');
  };

  if (loading || !partnerProfile) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 text-[#2e7d32] animate-spin" />
      </div>
    );
  }

  const discountLabel = (v: any) =>
    v.discount_type === 'flat' ? `₹${v.discount_value} OFF` : `${v.discount_value}% OFF`;

  return (
    <div className="min-h-screen bg-[#f0f7f0]">
      <Helmet>
        <title>Partner Dashboard – TechzGreen</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Partner Header */}
      <div className="bg-[#1a3d1f] px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 p-2 rounded-xl">
              <Handshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm">{partnerProfile.company_name}</p>
              <p className="text-[rgba(200,230,201,0.7)] text-xs">Partner Portal</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-red-300 hover:text-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Sub-tabs */}
        <div className="flex gap-2 mb-6 bg-white/60 rounded-xl p-1 border border-[rgba(46,125,50,0.12)]">
          {[
            { id: 'scan' as SubTab, icon: <QrCode className="w-4 h-4" />, label: 'Scan & Redeem' },
            { id: 'vouchers' as SubTab, icon: <Receipt className="w-4 h-4" />, label: 'Active Vouchers' },
            { id: 'history' as SubTab, icon: <History className="w-4 h-4" />, label: 'History' },
            { id: 'analytics' as SubTab, icon: <BarChart3 className="w-4 h-4" />, label: 'Analytics' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                subTab === tab.id ? 'bg-[#2e7d32] text-white shadow-sm' : 'text-[#5f7a60] hover:text-[#2e7d32]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── SCAN TAB ── */}
        {subTab === 'scan' && (
          <div className="space-y-5">
            {/* Scanner */}
            {!lookupResult && (
              <div className="glass-panel p-6">
                <h2 className="text-lg font-bold text-[#1a3d1f] mb-4 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#2e7d32]" /> Scan Voucher
                </h2>
                {looking ? (
                  <div className="flex items-center justify-center py-8 gap-3 text-[#5f7a60]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#2e7d32]" />
                    Looking up voucher...
                  </div>
                ) : (
                  <QRScanner key={scanKey} onResult={handleScan} />
                )}
              </div>
            )}

            {/* Result: INVALID */}
            {lookupResult?.status === 'invalid' && (
              <div className="glass-panel p-6 space-y-4">
                <div className="flex items-center gap-3 text-red-600">
                  <XCircle className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <p className="font-black text-lg">Invalid Voucher</p>
                    <p className="text-sm text-[#5f7a60]">{lookupResult.message}</p>
                  </div>
                </div>
                <button onClick={resetScan} className="btn-primary w-full !py-2.5">Scan Another</button>
              </div>
            )}

            {/* Result: ALREADY USED */}
            {lookupResult?.status === 'used' && (
              <div className="glass-panel p-6 space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <AlertTriangle className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <p className="font-black text-lg">Voucher Already Used</p>
                    <p className="text-sm text-[#5f7a60]">{lookupResult.message}</p>
                    <p className="text-xs font-bold text-[#2d4a30] mt-1">
                      {lookupResult.voucher?.brand_name} – {lookupResult.voucher?.title}
                    </p>
                  </div>
                </div>
                <button onClick={resetScan} className="btn-primary w-full !py-2.5">Scan Another</button>
              </div>
            )}

            {/* Result: VALID — Bill Entry */}
            {lookupResult?.status === 'valid' && !billState?.confirmed && (
              <div className="glass-panel p-6 space-y-5">
                {/* Voucher Info */}
                <div className="bg-gradient-to-r from-[#1a3d1f] to-[#2e7d32] rounded-2xl p-5 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                        {lookupResult.voucher?.brand_name}
                      </p>
                      <h3 className="font-black text-xl">{lookupResult.voucher?.title}</h3>
                      <p className="text-green-100 text-sm mt-1">{lookupResult.voucher?.description}</p>
                    </div>
                    <span className="bg-[#ffb300] text-black font-black text-sm px-3 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0">
                      {discountLabel(lookupResult.voucher)}
                    </span>
                  </div>
                </div>

                {/* Valid badge */}
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 font-bold text-sm">Valid voucher — not yet redeemed</p>
                </div>

                {/* Bill input */}
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-2">
                    <Receipt className="w-4 h-4 inline mr-1" /> Enter Bill Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5f7a60] font-bold">₹</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={billState?.bill || ''}
                      onChange={e => handleBillChange(e.target.value)}
                      placeholder="Enter purchase amount"
                      className="input-glass pl-8"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Calculation preview */}
                {billState && parseFloat(billState.bill) > 0 && (
                  <div className="bg-[rgba(46,125,50,0.06)] border border-[rgba(46,125,50,0.15)] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5f7a60]">Bill Amount</span>
                      <span className="font-bold text-[#1a3d1f]">₹{parseFloat(billState.bill).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5f7a60]">Discount Applied</span>
                      <span className="font-bold text-green-600">− ₹{billState.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-[rgba(46,125,50,0.15)] pt-2 mt-1">
                      <span className="font-black text-[#1a3d1f]">Customer Pays</span>
                      <span className="font-black text-[#2e7d32] text-lg">₹{billState.finalAmount.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-[#5f7a60] pt-1 border-t border-[rgba(46,125,50,0.1)]">
                      TechzGreen settles: <strong className="text-[#2e7d32]">₹{billState.discount.toFixed(2)}</strong>
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={resetScan} className="flex-1 py-2.5 rounded-xl border border-[rgba(46,125,50,0.2)] text-[#5f7a60] font-bold text-sm hover:bg-gray-50 cursor-pointer">
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRedemption}
                    disabled={!billState || parseFloat(billState.bill) <= 0 || billState.confirming}
                    className="flex-2 flex-1 btn-primary !py-2.5 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {billState?.confirming
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                      : <><CheckCircle2 className="w-4 h-4" /> Confirm Redemption</>
                    }
                  </button>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {billState?.confirmed && (
              <div className="glass-panel p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9 text-green-600" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-[#1a3d1f]">Voucher Redeemed!</h3>
                  <p className="text-[#5f7a60] text-sm mt-1">Transaction recorded successfully.</p>
                </div>
                <div className="bg-[rgba(46,125,50,0.06)] border border-[rgba(46,125,50,0.15)] rounded-xl p-4 space-y-2 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5f7a60]">Bill Amount</span>
                    <span className="font-bold">₹{parseFloat(billState.bill).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5f7a60]">Customer Paid</span>
                    <span className="font-black text-[#2e7d32]">₹{billState.finalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-[rgba(46,125,50,0.15)] pt-2">
                    <span className="text-[#5f7a60]">TechzGreen Owes You</span>
                    <span className="font-black text-amber-600">₹{billState.discount.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={resetScan} className="btn-primary w-full !py-3">
                  Scan Next Voucher
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── ACTIVE VOUCHERS TAB ── */}
        {subTab === 'vouchers' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#1a3d1f] flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#2e7d32]" /> Active Vouchers ({activeVouchers.length})
            </h2>
            {activeVouchers.length === 0 ? (
              <div className="glass-panel p-10 text-center text-[#5f7a60]">
                No active vouchers pending redemption.
              </div>
            ) : (
              activeVouchers.map(v => (
                <div key={v.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-black text-[#1a3d1f] text-sm truncate">
                      {v.vouchers?.brand_name} – {v.vouchers?.title}
                    </p>
                    <p className="text-xs text-[#5f7a60] mt-0.5">
                      Voucher ID: {v.id.substring(0, 8)}...
                    </p>
                    <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-2 inline-block text-[#2e7d32] border border-gray-200">
                      {v.qr_code}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSubTab('scan');
                      handleScan(v.qr_code);
                    }}
                    className="btn-primary !py-2 !px-4 text-sm whitespace-nowrap"
                  >
                    Match & Redeem
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {subTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#1a3d1f] flex items-center gap-2">
              <History className="w-5 h-5 text-[#2e7d32]" /> Redemption History ({redemptions.length})
            </h2>
            {redemptions.length === 0 ? (
              <div className="glass-panel p-10 text-center text-[#5f7a60]">
                No redemptions yet.
              </div>
            ) : (
              redemptions.map(r => (
                <div key={r.id} className="glass-card p-4 flex items-center gap-4">
                  <div className="bg-green-100 text-green-700 p-2.5 rounded-xl flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-[#1a3d1f] text-sm truncate">
                      {r.vouchers?.brand_name} – {r.vouchers?.title}
                    </p>
                    <p className="text-xs text-[#5f7a60] mt-0.5">
                      {r.used_at ? new Date(r.used_at).toLocaleString('en-IN') : '—'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-[#2e7d32] text-sm">₹{Number(r.final_amount).toFixed(2)}</p>
                    <p className="text-xs text-amber-600 font-bold">−₹{Number(r.settlement_amount).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {subTab === 'analytics' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#1a3d1f] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#2e7d32]" /> Analytics
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Redemptions', value: analytics.totalRedemptions.toString(), icon: <QrCode className="w-5 h-5" />, color: 'text-[#2e7d32]' },
                { label: 'Total Billed', value: `₹${analytics.totalBilled.toFixed(2)}`, icon: <IndianRupee className="w-5 h-5" />, color: 'text-[#2e7d32]' },
                { label: 'Total Discount Given', value: `₹${analytics.totalDiscount.toFixed(2)}`, icon: <TrendingDown className="w-5 h-5" />, color: 'text-amber-600' },
                { label: 'TechzGreen Owes You', value: `₹${analytics.settlementOwed.toFixed(2)}`, icon: <Receipt className="w-5 h-5" />, color: 'text-amber-600' },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="glass-panel p-5 text-center">
                  <div className={`flex justify-center mb-2 ${color}`}>{icon}</div>
                  <p className={`font-black text-xl ${color}`} style={{ fontFamily: 'Outfit,sans-serif' }}>{value}</p>
                  <p className="text-xs text-[#5f7a60] mt-1 font-medium">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent 5 */}
            {redemptions.length > 0 && (
              <div className="glass-panel p-5">
                <h3 className="font-bold text-[#1a3d1f] text-sm mb-3">Recent Activity</h3>
                <div className="space-y-2">
                  {redemptions.slice(0, 5).map(r => (
                    <div key={r.id} className="flex items-center justify-between text-sm">
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-[#1a3d1f] truncate text-xs">{r.vouchers?.title}</p>
                        <p className="text-[10px] text-[#5f7a60]">{r.used_at ? new Date(r.used_at).toLocaleDateString('en-IN') : '—'}</p>
                      </div>
                      <div className="flex-shrink-0 text-right ml-3">
                        <p className="font-bold text-[#2e7d32] text-xs">₹{Number(r.final_amount).toFixed(0)}</p>
                        <p className="text-[10px] text-amber-600">−₹{Number(r.settlement_amount).toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
