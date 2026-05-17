import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Package, ShoppingBag, ChevronRight, Clock, CheckCircle2,
  AlertTriangle, RefreshCw, ArrowLeft
} from 'lucide-react';

type Order = {
  id: string;
  created_at: string;
  status: 'paid' | 'pending' | 'failed' | string;
  total_amount: number;
  points_used: number;
  points_discount_amount: number;
  order_items: { quantity: number; price_at_time: number; products: { name: string } | null }[];
};

function StatusBadge({ status }: { status: string }) {
  if (status === 'paid') return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
      <CheckCircle2 className="w-3 h-3" /> Paid
    </span>
  );
  if (status === 'failed') return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
      <AlertTriangle className="w-3 h-3" /> Failed
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
      <Clock className="w-3 h-3 animate-pulse" /> Pending
    </span>
  );
}

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    supabase
      .from('orders')
      .select('*, order_items(quantity, price_at_time, products(name))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
        setLoading(false);
      });
  }, [user]);

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
          <p className="text-xs text-[#5f7a60] mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
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
          <p className="text-sm text-[#5f7a60] mb-6">You haven't placed any orders. Start shopping!</p>
          <Link to="/shop" className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2">
            Browse Shop <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Orders list */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' });
            const itemCount = order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
            const isPending = order.status === 'pending';

            return (
              <div
                key={order.id}
                className="glass-card overflow-hidden"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(46,125,50,0.07)] bg-[rgba(46,125,50,0.02)]">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#2e7d32]" />
                    <span className="text-xs font-mono font-bold text-[#1a3d1f]">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                  {/* Items preview */}
                  <div className="space-y-1 mb-3">
                    {(order.order_items ?? []).slice(0, 3).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-[#2d4a30] truncate mr-2">{item.products?.name || 'Product'} × {item.quantity}</span>
                        <span className="text-[#5f7a60] font-semibold flex-shrink-0">
                          ₹{(Number(item.price_at_time) * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                    {(order.order_items?.length ?? 0) > 3 && (
                      <p className="text-xs text-[#5f7a60]">+{(order.order_items?.length ?? 0) - 3} more items</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#5f7a60]">{dateStr} · {itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                      <p className="font-black text-[#2e7d32] text-base" style={{ fontFamily: 'Outfit,sans-serif' }}>
                        ₹{Number(order.total_amount).toFixed(2)}
                      </p>
                    </div>
                    <Link
                      to={`/order-confirmation/${order.id}?status=${order.status}`}
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#2e7d32] hover:bg-[#1b5e20] px-4 py-2.5 rounded-xl transition-colors"
                    >
                      {isPending ? <><RefreshCw className="w-3.5 h-3.5" /> Retry / Track</> : <><ChevronRight className="w-3.5 h-3.5" /> View Details</>}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
