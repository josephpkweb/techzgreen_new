import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Package, ShoppingBag, ChevronRight, Clock, CheckCircle2,
  AlertTriangle, ArrowLeft, Truck, MapPin, Star, ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react';

type Order = {
  id: string;
  created_at: string;
  status: 'paid' | 'pending' | 'failed' | string;
  total_amount: number;
  points_used: number;
  points_discount_amount: number;
  delivery_status?: string | null;
  order_items: { quantity: number; price_at_time: number; products: { name: string } | null }[];
  user_addresses?: {
    fullname: string; street: string; city: string; state: string; zip_code: string;
  } | null;
};

// Flipkart-style delivery stages
const DELIVERY_STAGES = [
  { key: 'placed',      label: 'Order Placed',       icon: <CheckCircle2 className="w-4 h-4" /> },
  { key: 'confirmed',   label: 'Order Confirmed',     icon: <Star className="w-4 h-4" /> },
  { key: 'shipped',     label: 'Shipped',             icon: <Package className="w-4 h-4" /> },
  { key: 'out',         label: 'Out for Delivery',    icon: <Truck className="w-4 h-4" /> },
  { key: 'delivered',   label: 'Delivered',           icon: <MapPin className="w-4 h-4" /> },
];

function getStageIndex(deliveryStatus: string | null | undefined, paymentStatus: string): number {
  if (paymentStatus !== 'paid') return -1; // not started
  if (!deliveryStatus || deliveryStatus === 'placed') return 0;
  const idx = DELIVERY_STAGES.findIndex(s => s.key === deliveryStatus);
  return idx >= 0 ? idx : 0;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'paid') return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="w-3 h-3" /> Paid
    </span>
  );
  if (status === 'failed') return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
      <AlertTriangle className="w-3 h-3" /> Failed
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3 animate-pulse" /> Pending
    </span>
  );
}

function TrackingTimeline({ order }: { order: Order }) {
  const activeIdx = getStageIndex(order.delivery_status, order.status);

  if (order.status === 'failed') return (
    <div className="flex items-center gap-2 py-3 px-1">
      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
      <p className="text-sm text-red-600 font-semibold">Payment failed. Order not processed.</p>
    </div>
  );

  if (order.status !== 'paid') return (
    <div className="flex items-center gap-2 py-3 px-1">
      <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 animate-pulse" />
      <p className="text-sm text-amber-700 font-semibold">Awaiting payment confirmation…</p>
    </div>
  );

  return (
    <div className="relative mt-1">
      {/* Progress bar behind dots */}
      <div className="absolute top-[18px] left-[18px] right-[18px] h-0.5 bg-[rgba(46,125,50,0.12)] z-0" />
      <div
        className="absolute top-[18px] left-[18px] h-0.5 bg-[#2e7d32] z-0 transition-all duration-700"
        style={{ width: activeIdx === 0 ? '0%' : `${(activeIdx / (DELIVERY_STAGES.length - 1)) * 100}%` }}
      />

      <div className="relative z-10 flex justify-between">
        {DELIVERY_STAGES.map((stage, i) => {
          const done = i <= activeIdx;
          const active = i === activeIdx;
          return (
            <div key={stage.key} className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                done
                  ? 'bg-[#2e7d32] border-[#2e7d32] text-white'
                  : 'bg-white border-[rgba(46,125,50,0.2)] text-[rgba(46,125,50,0.3)]'
              } ${active ? 'ring-4 ring-[rgba(46,125,50,0.15)] scale-110' : ''}`}>
                {stage.icon}
              </div>
              <p className={`text-[10px] font-bold text-center leading-tight ${done ? 'text-[#2e7d32]' : 'text-[rgba(46,125,50,0.35)]'}`}>
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    supabase
      .from('orders')
      .select('*, order_items(quantity, price_at_time, products(name)), user_addresses(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
        setLoading(false);
      });
  }, [user]);

  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-28 sm:pb-10 fade-in">
      <Helmet>
        <title>My Orders · TechzGreen</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/profile')} className="p-2 rounded-xl bg-[rgba(46,125,50,0.08)] hover:bg-[rgba(46,125,50,0.15)] text-[#2e7d32] transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1a3d1f]" style={{ fontFamily: 'Outfit,sans-serif' }}>My Orders</h1>
          {!loading && <p className="text-xs text-[#5f7a60] mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && orders.length === 0 && (
        <div className="glass-panel p-12 text-center">
          <ShoppingBag className="w-14 h-14 text-[rgba(46,125,50,0.2)] mx-auto mb-4" />
          <h2 className="text-lg font-black text-[#1a3d1f] mb-2">No Orders Yet</h2>
          <p className="text-sm text-[#5f7a60] mb-6">You haven't placed any orders.</p>
          <Link to="/shop" className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2">
            Browse Shop <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Orders */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const expanded = expandedId === order.id;
            const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' });
            const timeStr = new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            const itemCount = order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
            const isPending = order.status === 'pending';

            return (
              <div key={order.id} className="glass-card overflow-hidden">
                {/* Top row */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-b border-[rgba(46,125,50,0.07)] bg-[rgba(46,125,50,0.02)] cursor-pointer"
                  onClick={() => toggle(order.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Package className="w-4 h-4 text-[#2e7d32] flex-shrink-0" />
                    <span className="text-xs font-mono font-bold text-[#1a3d1f] truncate">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="font-black text-[#2e7d32] text-sm" style={{ fontFamily: 'Outfit,sans-serif' }}>
                      ₹{Number(order.total_amount).toFixed(0)}
                    </span>
                    {expanded ? <ChevronUp className="w-4 h-4 text-[#5f7a60]" /> : <ChevronDown className="w-4 h-4 text-[#5f7a60]" />}
                  </div>
                </div>

                {/* Summary (always visible) */}
                <div className="px-4 pt-3 pb-1">
                  {/* Tracking timeline */}
                  <TrackingTimeline order={order} />
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-[rgba(46,125,50,0.07)] mt-2 space-y-4">

                    {/* Items */}
                    <div>
                      <p className="text-xs font-bold text-[#5f7a60] uppercase tracking-wide mb-2">Items Ordered</p>
                      <div className="space-y-1.5">
                        {(order.order_items ?? []).map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-[#2d4a30] truncate mr-3">{item.products?.name || 'Product'} × {item.quantity}</span>
                            <span className="font-semibold text-[#5f7a60] flex-shrink-0">₹{(Number(item.price_at_time) * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery address */}
                    {order.user_addresses && (
                      <div>
                        <p className="text-xs font-bold text-[#5f7a60] uppercase tracking-wide mb-1.5">Delivery Address</p>
                        <div className="flex items-start gap-2 bg-[rgba(46,125,50,0.03)] border border-[rgba(46,125,50,0.1)] rounded-xl px-3 py-2.5">
                          <MapPin className="w-3.5 h-3.5 text-[#2e7d32] mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-[#2d4a30] leading-relaxed">
                            <p className="font-bold">{order.user_addresses.fullname}</p>
                            <p>{order.user_addresses.street}, {order.user_addresses.city}, {order.user_addresses.state} — {order.user_addresses.zip_code}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex justify-between text-xs text-[#5f7a60]">
                      <span>{dateStr} at {timeStr} · {itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                      {order.points_used > 0 && (
                        <span className="text-amber-600 font-semibold">{order.points_used} Z Coins used</span>
                      )}
                    </div>

                    {/* Retry if pending/failed */}
                    {isPending && (
                      <Link
                        to={`/order-confirmation/${order.id}?status=${order.status}`}
                        className="flex items-center justify-center gap-2 btn-primary w-full !py-2.5 text-sm"
                      >
                        <RefreshCw className="w-4 h-4" /> Retry Payment
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
