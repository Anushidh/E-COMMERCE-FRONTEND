import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { Spinner } from '@shared/components';
import { AuthGuard } from '@shared/components/AuthGuard';
import { GuestGuard } from '@shared/components/GuestGuard';

// Layouts
const PublicLayout = lazy(() => import('@shared/layouts/PublicLayout/PublicLayout'));
const AuthLayout = lazy(() => import('@shared/layouts/AuthLayout/AuthLayout'));
const AdminLayout = lazy(() => import('@shared/layouts/AdminLayout/AdminLayout'));

// Public pages
const Home = lazy(() => import('@modules/home/Home/Home'));
const Shop = lazy(() => import('@modules/products/Shop/Shop'));
const ProductDetail = lazy(() => import('@modules/products/ProductDetail/ProductDetail'));
const Cart = lazy(() => import('@modules/cart/Cart/Cart'));
const AboutUs = lazy(() => import('@modules/info/AboutUs'));
const Contact = lazy(() => import('@modules/info/Contact'));
const ShippingPolicy = lazy(() => import('@modules/info/ShippingPolicy'));
const ReturnsRefunds = lazy(() => import('@modules/info/ReturnsRefunds'));

// Protected user pages
const Checkout = lazy(() => import('@modules/checkout/Checkout/Checkout'));
const OrderList = lazy(() => import('@modules/orders/OrderList/OrderList'));
const OrderDetail = lazy(() => import('@modules/orders/OrderDetail/OrderDetail'));
const Wishlist = lazy(() => import('@modules/wishlist/Wishlist/Wishlist'));
const Profile = lazy(() => import('@modules/profile/Profile/Profile'));
const Addresses = lazy(() => import('@modules/profile/Addresses/Addresses'));
const ProfileSettings = lazy(() => import('@modules/profile/Settings/Settings'));
const WalletPage = lazy(() => import('@modules/wallet/WalletPage/WalletPage'));
const Referrals = lazy(() => import('@modules/referrals/Referrals/Referrals'));

// Auth pages
const Login = lazy(() => import('@modules/auth/Login/Login'));
const Signup = lazy(() => import('@modules/auth/Signup/Signup'));
const ForgotPassword = lazy(() => import('@modules/auth/ForgotPassword/ForgotPassword'));
const OAuthCallback = lazy(() => import('@modules/auth/OAuthCallback/OAuthCallback'));

// Admin pages
const AdminLogin = lazy(() => import('@modules/admin/AdminLogin/AdminLogin'));
const Dashboard = lazy(() => import('@modules/admin/Dashboard/Dashboard'));
const AdminProducts = lazy(() => import('@modules/admin/Products/Products'));
const ProductCreate = lazy(() => import('@modules/admin/ProductCreate/ProductCreate'));
const ProductEdit = lazy(() => import('@modules/admin/ProductEdit/ProductEdit'));
const AdminOrders = lazy(() => import('@modules/admin/Orders/Orders'));
const AdminOrderDetail = lazy(() => import('@modules/admin/OrderDetail/OrderDetail'));
const AdminUsers = lazy(() => import('@modules/admin/Users/Users'));
const AdminUserDetail = lazy(() => import('@modules/admin/UserDetail/UserDetail'));
const AdminCoupons = lazy(() => import('@modules/admin/Coupons/Coupons'));
const AdminProductOffers = lazy(() => import('@modules/admin/Offers/ProductOffers'));
const AdminCategoryOffers = lazy(() => import('@modules/admin/Offers/CategoryOffers'));
const AdminCategories = lazy(() => import('@modules/admin/Categories/Categories'));
const AdminInventory = lazy(() => import('@modules/admin/Inventory/Inventory'));
const AdminReviews = lazy(() => import('@modules/admin/Reviews/Reviews'));
const AdminAbandonedCarts = lazy(() => import('@modules/admin/AbandonedCarts/AbandonedCarts'));

// Common
const NotFound = lazy(() => import('@modules/common/NotFound/NotFound'));

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="lg" />
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:slug" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="returns-refunds" element={<ReturnsRefunds />} />

          {/* Protected user routes */}
          <Route path="checkout" element={<AuthGuard><Checkout /></AuthGuard>} />
          <Route path="orders" element={<AuthGuard><OrderList /></AuthGuard>} />
          <Route path="orders/:id" element={<AuthGuard><OrderDetail /></AuthGuard>} />
          <Route path="wishlist" element={<AuthGuard><Wishlist /></AuthGuard>} />
          <Route path="profile" element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="profile/addresses" element={<AuthGuard><Addresses /></AuthGuard>} />
          <Route path="profile/settings" element={<AuthGuard><ProfileSettings /></AuthGuard>} />
          <Route path="wallet" element={<AuthGuard><WalletPage /></AuthGuard>} />
          <Route path="referrals" element={<AuthGuard><Referrals /></AuthGuard>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Auth routes (guests only) */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<GuestGuard><Login /></GuestGuard>} />
          <Route path="signup" element={<GuestGuard><Signup /></GuestGuard>} />
          <Route path="forgot-password" element={<GuestGuard><ForgotPassword /></GuestGuard>} />
        </Route>

        {/* OAuth callback (no layout) */}
        <Route path="auth/callback" element={<OAuthCallback />} />

        {/* Admin login (guests only) */}
        <Route path="admin/login" element={<GuestGuard><AdminLogin /></GuestGuard>} />

        {/* Admin routes (with sidebar + guard) */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<ProductCreate />} />
          <Route path="products/:id" element={<ProductEdit />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="offers/products" element={<AdminProductOffers />} />
          <Route path="offers/categories" element={<AdminCategoryOffers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="abandoned-carts" element={<AdminAbandonedCarts />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
