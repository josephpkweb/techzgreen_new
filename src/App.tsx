import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Landing          = lazy(() => import('./pages/Landing'));
const Login            = lazy(() => import('./pages/Login'));
const Signup           = lazy(() => import('./pages/Signup'));
const Shop             = lazy(() => import('./pages/Shop'));
const Cart             = lazy(() => import('./pages/Cart'));
const Checkout         = lazy(() => import('./pages/Checkout'));
const OrderConfirmation= lazy(() => import('./pages/OrderConfirmation'));
const AdminDashboard   = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin       = lazy(() => import('./pages/AdminLogin'));
const Rewards          = lazy(() => import('./pages/Rewards'));
const Events           = lazy(() => import('./pages/Events'));
const About            = lazy(() => import('./pages/About'));
const StitchLanding    = lazy(() => import('./stitch-components/StitchLanding'));
const UserProfile      = lazy(() => import('./pages/UserProfile'));
const FeaturedProducts = lazy(() => import('./pages/FeaturedProducts'));
const PartnerLogin     = lazy(() => import('./pages/PartnerLogin'));
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));

// Footer only on public content pages — not auth/checkout/dashboard flows
const FOOTER_ROUTES = ['/', '/about', '/shop', '/featured-products', '/events', '/rewards'];

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const PageSpinner = () => (
  <div className="flex justify-center items-center py-32">
    <div className="w-10 h-10 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin" />
  </div>
);

// AppInner lives inside <Router> so useLocation works
function AppInner() {
  const { pathname } = useLocation();
  const showFooter = FOOTER_ROUTES.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path="/"                      element={<Landing />} />
            <Route path="/about"                 element={<About />} />
            <Route path="/login"                 element={<Login />} />
            <Route path="/signup"                element={<Signup />} />
            <Route path="/shop"                  element={<Shop />} />
            <Route path="/cart"                  element={<Cart />} />
            <Route path="/checkout"              element={<Checkout />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/dashboard"             element={<Navigate to="/profile" replace />} />
            <Route path="/admin"                 element={<AdminDashboard />} />
            <Route path="/admin/login"           element={<AdminLogin />} />
            <Route path="/rewards"               element={<Rewards />} />
            <Route path="/events"               element={<Events />} />
            <Route path="/stitch-landing"        element={<StitchLanding />} />
            <Route path="/profile"               element={<UserProfile />} />
            <Route path="/featured-products"     element={<FeaturedProducts />} />
            <Route path="/partner/login"         element={<PartnerLogin />} />
            <Route path="/partner/dashboard"     element={<PartnerDashboard />} />
            <Route path="*"                      element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppInner />
    </Router>
  );
}

export default App;
