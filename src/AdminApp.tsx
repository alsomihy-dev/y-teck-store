import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import { Laptop, Order, User } from './types';
import { dbService } from './lib/db';
import AdminDashboard from './components/AdminDashboard';

// Detect if Supabase is configured with a valid JWT key
const SUPABASE_CONFIGURED = !!(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string).startsWith('eyJ')
);

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [adminEmail, setAdminEmail] = React.useState('');
  const [adminPermissions, setAdminPermissions] = React.useState<string[]>([]);
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState('');
  const [loginLoading, setLoginLoading] = React.useState(false);

  const [laptops, setLaptops] = React.useState<Laptop[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [newOrdersCount, setNewOrdersCount] = React.useState(0);

  // Realtime subscription for new orders (Supabase only)
  React.useEffect(() => {
    if (!isAuthenticated || !SUPABASE_CONFIGURED) return;
    const channel = dbService.supabase
      .channel('admin:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const newOrder = {
          id: payload.new.id,
          date: payload.new.date,
          items: payload.new.items,
          subtotal: Number(payload.new.subtotal),
          tax: Number(payload.new.tax),
          total: Number(payload.new.total),
          status: payload.new.status,
          paymentMethod: payload.new.payment_method,
          userId: payload.new.user_id,
          trackingMap: payload.new.driver_name ? {
            driverName: payload.new.driver_name,
            arrivalTime: payload.new.arrival_time || '',
            driverPhone: payload.new.driver_phone || ''
          } : undefined
        } as Order;
        setOrders(prev => [newOrder, ...prev]);
        setNewOrdersCount(n => n + 1);
        try { new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg').play(); } catch {}
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, () => {
        dbService.getOrders().then(setOrders);
      })
      .subscribe();
    return () => { dbService.supabase.removeChannel(channel); };
  }, [isAuthenticated]);

  // Check auth session on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        // ── LOCAL MODE: check localAuth session ──
        if (!SUPABASE_CONFIGURED) {
          const localUser = dbService.localAuth.getSessionUser();
          if (localUser && localUser.role === 'admin') {
            setIsAuthenticated(true);
            setAdminEmail(localUser.email);
            setAdminPermissions(localUser.permissions || []);
          }
          setIsLoading(false);
          return;
        }

        // ── SUPABASE MODE ──
        const { data: { session } } = await dbService.supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await dbService.supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'admin') {
            setIsAuthenticated(true);
            setAdminEmail(profile.email);
            setAdminPermissions(profile.permissions || []);
          } else {
            await dbService.supabase.auth.signOut();
          }
        } else {
          // Supabase has no session — also check local as fallback
          const localUser = dbService.localAuth.getSessionUser();
          if (localUser && localUser.role === 'admin') {
            setIsAuthenticated(true);
            setAdminEmail(localUser.email);
            setAdminPermissions(localUser.permissions || []);
          }
        }
      } catch (err) {
        // Network error — try local session
        const localUser = dbService.localAuth.getSessionUser();
        if (localUser && localUser.role === 'admin') {
          setIsAuthenticated(true);
          setAdminEmail(localUser.email);
          setAdminPermissions(localUser.permissions || []);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Load data when authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      dbService.getLaptops().then(setLaptops);
      dbService.getOrders().then(setOrders);
      dbService.getUsers().then(setUsers);
    }
  }, [isAuthenticated]);

  // ── LOCAL MODE: Poll orders every 5 seconds for real-time updates ──
  React.useEffect(() => {
    if (!isAuthenticated || SUPABASE_CONFIGURED) return;

    const interval = setInterval(() => {
      dbService.getOrders().then(freshOrders => {
        setOrders(prev => {
          const prevStr = JSON.stringify(prev.map(o => ({ id: o.id, status: o.status })));
          const newStr = JSON.stringify(freshOrders.map(o => ({ id: o.id, status: o.status })));
          if (prevStr !== newStr) {
            // Check if a new order arrived
            const prevIds = new Set(prev.map(o => o.id));
            const hasNew = freshOrders.some(o => !prevIds.has(o.id));
            if (hasNew) {
              setNewOrdersCount(n => n + 1);
              document.title = '🔔 طلب جديد! - لوحة التحكم';
              setTimeout(() => { document.title = 'لوحة التحكم - Y TECK'; }, 5000);
            }
            return freshOrders;
          }
          return prev;
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      // ── LOCAL MODE ──
      if (!SUPABASE_CONFIGURED) {
        const { user, error } = dbService.localAuth.signIn(loginEmail, loginPassword);
        if (error || !user) {
          setLoginError(error || 'خطأ في البريد الإلكتروني أو كلمة المرور');
          setLoginLoading(false);
          return;
        }
        if (user.role !== 'admin') {
          dbService.localAuth.signOut();
          setLoginError('هذا الحساب ليس لديه صلاحيات المسؤول');
          setLoginLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setAdminEmail(user.email);
        setAdminPermissions(user.permissions || []);
        setLoginLoading(false);
        return;
      }

      // ── SUPABASE MODE ──
      const { data: signInData, error } = await dbService.supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });

      if (error) {
        // Supabase failed — try local fallback
        const { user: localUser, error: localErr } = dbService.localAuth.signIn(loginEmail, loginPassword);
        if (localUser && localUser.role === 'admin') {
          setIsAuthenticated(true);
          setAdminEmail(localUser.email);
          setAdminPermissions(localUser.permissions || []);
        } else {
          setLoginError(localErr || 'خطأ في البريد الإلكتروني أو كلمة المرور');
        }
        setLoginLoading(false);
        return;
      }

      if (signInData?.user) {
        const { data: profile } = await dbService.supabase
          .from('profiles')
          .select('*')
          .eq('id', signInData.user.id)
          .single();

        if (profile?.role === 'admin') {
          setIsAuthenticated(true);
          setAdminEmail(profile.email);
          setAdminPermissions(profile.permissions || []);
        } else {
          setLoginError('هذا الحساب ليس لديه صلاحيات المسؤول');
          await dbService.supabase.auth.signOut();
        }
      }
    } catch {
      // Network failure — try local
      const { user: localUser } = dbService.localAuth.signIn(loginEmail, loginPassword);
      if (localUser && localUser.role === 'admin') {
        setIsAuthenticated(true);
        setAdminEmail(localUser.email);
        setAdminPermissions(localUser.permissions || []);
      } else {
        setLoginError('تعذر الاتصال. تحقق من اتصالك بالإنترنت.');
      }
    }
    setLoginLoading(false);
  };

  // Logout handler
  const handleLogout = async () => {
    dbService.localAuth.signOut();
    try { await dbService.supabase.auth.signOut(); } catch {}
    setIsAuthenticated(false);
    setAdminEmail('');
    setAdminPermissions([]);
  };


  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm font-bold">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-600/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Y TECK</h1>
            <p className="text-slate-400 text-xs mt-1">لوحة تحكم المسؤول</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-colors text-right"
                />
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-slate-300">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-colors text-right"
                />
              </div>

              {loginError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold p-3 rounded-xl text-center">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                {loginLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                ← العودة للموقع الرئيسي
              </a>
            </div>
          </div>

          <p className="text-center text-slate-600 text-[10px] mt-8">Y TECK Admin Panel v1.0</p>
        </div>
      </div>
    );
  }

  // Authenticated admin view
  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Admin top bar */}
      <header className="bg-slate-950 text-white px-6 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <a href="/admin.html" className="text-lg font-extrabold tracking-tight hover:opacity-80 transition-opacity">Y TECK</a>
          <span className="text-xs bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-full">لوحة التحكم</span>
          {newOrdersCount > 0 && (
            <span className="relative flex items-center gap-1 bg-emerald-500 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full animate-pulse">
              🔔 {newOrdersCount} طلب جديد
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 hidden sm:block">{adminEmail}</span>
          <a
            href="/"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl transition-colors"
          >
            زيارة الموقع
          </a>
          <button
            onClick={handleLogout}
            className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            خروج
          </button>
        </div>
      </header>

      {/* Content */}
      <AdminDashboard
        adminEmail={adminEmail}
        adminPermissions={adminPermissions}
        laptops={laptops}
        setLaptops={setLaptops}
        orders={orders}
        setOrders={setOrders}
        users={users}
        setUsers={setUsers}
        newOrdersCount={newOrdersCount}
        onClearNewOrders={() => setNewOrdersCount(0)}
        onBackToHome={() => {
          window.location.href = '/';
        }}
      />
    </div>
  );
}
