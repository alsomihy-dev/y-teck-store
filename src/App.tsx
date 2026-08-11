import React from 'react';
import { Sparkles, ArrowRight, Check, CheckCircle, Search } from 'lucide-react';
import { Laptop, CartItem, Order, ViewTab, User, UserNotification } from './types';
import { INITIAL_LAPTOPS, ACCESSORIES } from './data';
import Navbar from './components/Navbar';
import CheckoutModal from './components/CheckoutModal';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import NotificationsView from './components/NotificationsView';
import Profile from './components/Profile';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import { dbService } from './lib/db';
import { auth, db, isFirebaseConfigured } from './lib/firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<ViewTab>('home');
  const [laptops, setLaptops] = React.useState<Laptop[]>(() => {
    // Combine INITIAL_LAPTOPS and ACCESSORIES for a unified catalog
    return [...INITIAL_LAPTOPS, ...ACCESSORIES];
  });

  const [selectedLaptop, setSelectedLaptop] = React.useState<Laptop>(INITIAL_LAPTOPS[0]);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [notifications, setNotifications] = React.useState<UserNotification[]>([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authType, setAuthType] = React.useState<'login' | 'signup'>('login');
  const [showAdminAuth, setShowAdminAuth] = React.useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false);
  const [authLoading, setAuthLoading] = React.useState(true); // prevent flicker before session restore
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  const [isSubmittingCheckout, setIsSubmittingCheckout] = React.useState(false);
  const [toast, setToast] = React.useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // History API for Mobile Back Button
  React.useEffect(() => {
    window.history.replaceState({ tab: 'home' }, '', '/');
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab) {
        setActiveTab(e.state.tab);
      } else {
        setActiveTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  React.useEffect(() => {
    if (window.history.state?.tab !== activeTab) {
      window.history.pushState({ tab: activeTab }, '', `/?tab=${activeTab}`);
    }
  }, [activeTab]);

  React.useEffect(() => {
    const configured = !!(
      import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      (import.meta.env.VITE_SUPABASE_ANON_KEY as string).startsWith('eyJ')
    );

    if (!configured) {
      if (auth && isFirebaseConfigured()) {
        // ── FIREBASE AUTH MODE ──
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const profileSnap = await getDoc(doc(db, 'profiles', firebaseUser.uid));
              if (profileSnap.exists()) {
                const data = profileSnap.data();
                const userProfile: User = {
                  id: firebaseUser.uid,
                  fullName: data.full_name || 'مستخدم',
                  email: firebaseUser.email || '',
                  role: data.role || 'user',
                  createdAt: data.created_at || new Date().toISOString()
                };
                setCurrentUser(userProfile);
                setIsLoggedIn(true);
                if (data.role === 'admin') setIsAdminAuthenticated(true);
              } else {
                const userProfile: User = {
                  id: firebaseUser.uid,
                  fullName: firebaseUser.displayName || 'مستخدم',
                  email: firebaseUser.email || '',
                  role: 'user',
                  createdAt: new Date().toISOString()
                };
                setCurrentUser(userProfile);
                setIsLoggedIn(true);
              }
            } catch (err) {
              console.error('Failed to fetch profile', err);
            }
          } else {
            setCurrentUser(null);
            setIsLoggedIn(false);
            setIsAdminAuthenticated(false);
          }
          setAuthLoading(false);
        });
        return () => unsubscribe();
      } else {
        // ── LOCAL MODE FALLBACK ──
        const saved = dbService.localAuth.getSessionUser();
        if (saved) {
          setIsLoggedIn(true);
          setCurrentUser(saved);
          if (saved.role === 'admin') setIsAdminAuthenticated(true);
        }
        setAuthLoading(false);
        return;
      }
    }

    // ── SUPABASE MODE ──
    const handleSession = (session: any) => {
      if (session?.user) {
        setIsLoggedIn(true);
        const fetchProfile = async (retries = 3) => {
          const { data } = await dbService.supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (data) {
            const userProfile: User = {
              id: data.id,
              fullName: data.full_name,
              email: data.email,
              role: data.role as 'admin' | 'user',
              createdAt: data.created_at
            };
            setCurrentUser(userProfile);
            if (data.role === 'admin') setIsAdminAuthenticated(true);
          } else if (retries > 0) {
            setTimeout(() => fetchProfile(retries - 1), 500);
          } else {
            setCurrentUser({
              id: session.user.id,
              fullName: session.user.user_metadata?.full_name || 'مستخدم',
              email: session.user.email || '',
              role: 'user',
              createdAt: new Date().toISOString()
            });
          }
        };
        fetchProfile();
      } else {
        // Fallback: Restore local session if Supabase has no active session
        const saved = dbService.localAuth.getSessionUser();
        if (saved) {
          setIsLoggedIn(true);
          setCurrentUser(saved);
          if (saved.role === 'admin') setIsAdminAuthenticated(true);
        } else {
          setIsLoggedIn(false);
          setCurrentUser(null);
          setIsAdminAuthenticated(false);
        }
      }
    };

    dbService.supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = dbService.supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userOrders = currentUser ? orders.filter(o => o.userId === currentUser.id) : [];
  const awaitingPaymentCount = userOrders.filter(o => o.status === 'awaiting_payment').length;

  // Load data on mount (works in both local and Supabase mode)
  React.useEffect(() => {
    dbService.getLaptops().then(setLaptops);
    dbService.getOrders().then(setOrders);
    dbService.getUsers().then(setUsers);
  }, []);

  // ── LOCAL MODE: Poll orders every 5 seconds for real-time feel ──
  React.useEffect(() => {
    const configured = !!(
      import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      (import.meta.env.VITE_SUPABASE_ANON_KEY as string).startsWith('eyJ')
    );
    if (configured) return; // Supabase uses real-time channel instead

    const interval = setInterval(() => {
      dbService.getOrders().then(freshOrders => {
        setOrders(prev => {
          const prevStr = JSON.stringify(prev.map(o => ({ id: o.id, status: o.status })));
          const newStr = JSON.stringify(freshOrders.map(o => ({ id: o.id, status: o.status })));
          return prevStr !== newStr ? freshOrders : prev;
        });
      });
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Notifications Polling
  React.useEffect(() => {
    if (!currentUser || currentUser.role === 'admin') {
      setNotifications([]);
      return;
    }

    const fetchNotifs = () => {
      dbService.getNotifications(currentUser.id).then(freshNotifs => {
        setNotifications(prev => {
          const prevUnread = prev.filter(n => !n.read).length;
          const freshUnread = freshNotifs.filter((n: UserNotification) => !n.read).length;

          if (freshUnread > prevUnread) {
            // Flash notification via title for any new unread notification
            document.title = '🔔 إشعار جديد! - Y TECK';
            setTimeout(() => { document.title = 'Y TECK'; }, 5000);

            // Optionally, we could show a toast here
          }
          return freshNotifs;
        });
      });
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Realtime Orders Subscription
  React.useEffect(() => {
    if (!dbService.supabase) return;

    const ordersChannel = dbService.supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        // Fetch fresh orders
        dbService.getOrders().then(freshOrders => {
          setOrders(freshOrders);

          if (payload.eventType === 'INSERT') {
            if (currentUser?.role === 'admin') {
              // Simple native alert or a toast. We'll use alert for immediate feedback.
              // In a production app you'd use a toast library.
              // alert('🔔 إشعار للمشرف: تم استلام طلب جديد!');
            }
          } else if (payload.eventType === 'UPDATE') {
            if (currentUser && currentUser.role !== 'admin' && payload.new.user_id === currentUser.id) {
              if (payload.new.status === 'confirmed') alert(`🎉 تم الموافقة على طلبك رقم ${payload.new.id}`);
              if (payload.new.status === 'rejected') alert(`❌ عذراً، تم رفض طلبك رقم ${payload.new.id}. السبب: ${payload.new.rejection_reason || 'غير محدد'}`);
            }
          }
        });
      })
      .subscribe();

    return () => {
      dbService.supabase.removeChannel(ordersChannel);
    };
  }, [currentUser]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
  const [pendingCheckoutPaymentMethod, setPendingCheckoutPaymentMethod] = React.useState('later');
  const [selectedCategory, setSelectedCategory] = React.useState<'students' | 'business' | 'gaming' | null>(null);
  const [selectedBrand, setSelectedBrand] = React.useState<string | null>(null);
  const [priceRange, setPriceRange] = React.useState<string | null>(null);

  // Newsletter subscription state
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  // Scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLaptop = (laptop: Laptop) => {
    setSelectedLaptop(laptop);
    setActiveTab('details');
    scrollToTop();
  };

  const handleAddToCart = (laptop: Laptop, e?: React.MouseEvent) => {
    if (!isLoggedIn && !authLoading) {
      setAuthType('login');
      setShowAuthModal(true);
      return;
    }
    if (authLoading) return; // still restoring session, wait

    if (e) {
      e.stopPropagation();
    }

    if (laptop.status === 'out_of_stock' || (laptop.quantity !== undefined && laptop.quantity <= 0)) {
      showToast('عذراً، هذا الجهاز غير متوفر حالياً في المخزون.', 'error');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.laptop.id === laptop.id);
      if (existing) {
        return prevCart.map((item) =>
          item.laptop.id === laptop.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { laptop, quantity: 1 }];
    });

    // Elegant feedback
    showToast(`تمت إضافة ${laptop.name} إلى السلة بنجاح!`, 'success');
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.laptop.id === id) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(cart.filter(item => item.laptop.id !== id));
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await dbService.markNotificationAsRead(notificationId);
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser) return;
    await dbService.markAllNotificationsAsRead(currentUser.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleCheckout = (paymentMethod: string) => {
    setPendingCheckoutPaymentMethod(paymentMethod || 'later');
    setShowCheckoutModal(true);
  };

  const finalizeCheckout = (address: string) => {
    setIsSubmittingCheckout(true);
    const subtotal = cart.reduce((acc, item) => acc + item.laptop.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.15);
    const total = subtotal + tax;

    // Unique Collision-Free Order ID
    const uniqueOrderId = `YT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: uniqueOrderId,
      userId: currentUser?.id,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      tax,
      total,
      status: 'pending_approval',
      paymentMethod: pendingCheckoutPaymentMethod,
      deliveryAddress: address,
      deliveryLocation: undefined,
      trackingMap: {
        driverName: 'سيتم التحديد لاحقاً',
        arrivalTime: '-',
        driverPhone: '-'
      }
    };

    dbService.saveOrder(newOrder).then(async (success) => {
      setIsSubmittingCheckout(false);
      setShowCheckoutModal(false);
      if (success) {
        setOrders([newOrder, ...orders]);
        setCart([]);
        setActiveTab('orders');
        scrollToTop();

        // Push notification
        if (currentUser) {
          const notif = await dbService.addNotification({
            userId: currentUser.id,
            title: "تم استلام الطلب 🛒",
            message: `تم استلام طلبك #${newOrder.id} وهو قيد المراجعة الآن من قبل الإدارة.`,
            type: 'order_status',
            orderId: newOrder.id
          });
          setNotifications(prev => [notif, ...prev]);
        }
        showToast('تم استلام طلبك بنجاح!', 'success');
      } else {
        showToast('حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.', 'error');
      }
    });
  };

  const handleAddCustomProduct = (newLaptop: Laptop) => {
    dbService.addLaptop(newLaptop).then((success) => {
      if (success) {
        setLaptops([newLaptop, ...laptops]);
        setActiveTab('admin');
        scrollToTop();
        alert(`تمت إضافة الجهاز ${newLaptop.name} إلى المتجر بنجاح!`);
      } else {
        alert('❌ فشل في إضافة المنتج لقاعدة البيانات.');
      }
    });
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // Filtered laptops logic
  const filteredLaptops = laptops.filter((laptop) => {
    // 1. Search Query
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      const matchName = laptop.name.toLowerCase().includes(query);
      const matchBrand = laptop.brand.toLowerCase().includes(query);
      const matchCpu = laptop.cpu.toLowerCase().includes(query);
      if (!matchName && !matchBrand && !matchCpu) return false;
    }

    // 2. Category
    if (selectedCategory && laptop.category !== selectedCategory) {
      return false;
    }

    // 3. Brand
    if (selectedBrand && laptop.brand !== selectedBrand) {
      return false;
    }

    // 4. Price range filter
    if (priceRange) {
      if (priceRange === 'under-1500' && laptop.price >= 1500) return false;
      if (priceRange === '1500-3000' && (laptop.price < 1500 || laptop.price > 3000)) return false;
      if (priceRange === '3000-5000' && (laptop.price < 3000 || laptop.price > 5000)) return false;
      if (priceRange === 'over-5000' && laptop.price <= 5000) return false;
    }

    return true;
  });

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb]" dir="rtl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'login' || tab === 'signup') {
            setAuthType(tab as any);
            setShowAuthModal(true);
            return;
          }
          setActiveTab(tab);
          scrollToTop();
        }}
        cartCount={cart.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdminAuthenticated}
        onAdminClick={() => setActiveTab('home')} // Just a placeholder, App handles admin render separately
        awaitingPaymentCount={awaitingPaymentCount}
        notifications={notifications}
        onMarkNotificationAsRead={(id) => {
          dbService.markNotificationAsRead(id).then(() => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
          });
        }}
        onMarkAllNotificationsAsRead={() => {
          if (currentUser) {
            dbService.markAllNotificationsAsRead(currentUser.id).then(() => {
              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            });
          }
        }}
      />
      <main className="flex-1">

        {activeTab === 'home' && (
          <div className="space-y-0">
            {/* Hero Banner */}
            <Hero
              onShopNowClick={() => {
                const element = document.getElementById('catalog-grid-anchor');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              onViewSpecsClick={() => {
                handleSelectLaptop(INITIAL_LAPTOPS[0]); // Goes to MacBook Pro M2
              }}
            />

            {/* Categories grids */}
            <Categories
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              selectedCategory={selectedCategory}
            />

            {/* Catalog Grid Frame Anchor */}
            <div className="bg-slate-50 py-16" id="catalog-grid-anchor">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Catalog headers */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                  {/* Right side filter sidebar */}
                  <div className="hidden lg:block bg-white border border-slate-200 p-6 rounded-3xl shadow-sm text-right space-y-6 h-max">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 mb-3">التصنيفات</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!selectedBrand}
                            onChange={() => setSelectedBrand(null)}
                            className="w-4 h-4 accent-slate-900 rounded"
                          />
                          <span>الكل</span>
                        </label>
                        {['Apple', 'Dell', 'HP', 'Lenovo', 'Microsoft'].map((b) => (
                          <label key={b} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedBrand === b}
                              onChange={() => setSelectedBrand(selectedBrand === b ? null : b)}
                              className="w-4 h-4 accent-slate-900 rounded"
                            />
                            <span>{b}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <h3 className="text-base font-extrabold text-slate-900 mb-3">نطاق السعر</h3>
                      <div className="space-y-2">
                        {[
                          { id: 'under-1500', label: 'أقل من 1500 ر.س' },
                          { id: '1500-3000', label: '1500 - 3000 ر.س' },
                          { id: '3000-5000', label: '3000 - 5000 ر.س' },
                          { id: 'over-5000', label: 'أكثر من 5000 ر.س' }
                        ].map((range) => (
                          <label key={range.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="priceRange"
                              checked={priceRange === range.id}
                              onChange={() => setPriceRange(priceRange === range.id ? null : range.id)}
                              className="w-4 h-4 accent-slate-900"
                            />
                            <span>{range.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <h3 className="text-base font-extrabold text-slate-900 mb-3">حالة اللابتوب المعتمدة</h3>
                      <div className="space-y-2 text-xs font-semibold text-slate-700">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-slate-900 rounded" />
                          <span>جديد تقريباً (ممتاز)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-slate-900 rounded" />
                          <span>ممتاز جداً (شبه جديد)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 accent-slate-900 rounded" />
                          <span>جيد جداً (مستعمل بعناية)</span>
                        </label>
                      </div>
                    </div>

                    {/* Reset button if filter is active */}
                    {(selectedCategory || selectedBrand || priceRange || searchQuery) && (
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setSelectedBrand(null);
                          setPriceRange(null);
                          setSearchQuery('');
                        }}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        إعادة تعيين الفلاتر
                      </button>
                    )}
                  </div>

                  {/* Left side dynamic grid catalog */}
                  <div className="lg:col-span-3 space-y-6 text-right">

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4">
                      <div>
                        <h2 className="text-2xl font-extrabold text-slate-900">أجهزة اللابتوب المتوفرة</h2>
                        <p className="text-slate-500 text-xs mt-1">تصفح مجموعتنا الفريدة من الأجهزة المجددة بأعلى مواصفات الجودة.</p>
                      </div>

                      {/* Mobile Filter Button */}
                      <button
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden w-full sm:w-auto bg-slate-950 text-white font-bold py-3 px-6 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        تصفية المنتجات
                      </button>
                      <div className="text-slate-500 text-xs font-semibold">
                        عرض <span className="text-slate-900 font-extrabold">{filteredLaptops.length}</span> لابتوب
                      </div>
                    </div>

                    {filteredLaptops.length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3">
                        <p className="font-bold">عذراً، لم نجد أي أجهزة تطابق الفلاتر المحددة.</p>
                        <button
                          onClick={() => {
                            setSelectedCategory(null);
                            setSelectedBrand(null);
                            setPriceRange(null);
                            setSearchQuery('');
                          }}
                          className="text-xs font-extrabold text-slate-950 underline"
                        >
                          عرض كل الأجهزة المتاحة بالمتجر
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLaptops.map((laptop) => (
                          <ProductCard
                            key={laptop.id}
                            laptop={laptop}
                            onSelect={handleSelectLaptop}
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>

            {/* Newsletter subscriber frame matching mockup */}
            <div className="bg-white py-16 border-t border-slate-100">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm text-right relative overflow-hidden">

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                    <div className="md:col-span-7 space-y-3">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">جودة مضمونة، أداء كالجديد</h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                        كل جهاز يمر بأكثر من 40 نقطة فحص فنية لضمان حصولك على تجربة متميزة من اليوم الأول مع ضمان ذهبي لمدة عام كامل. اشترك في نشرتنا البريدية لتصلك أحدث الأجهزة فور وصولها.
                      </p>
                    </div>

                    <div className="md:col-span-5">
                      {subscribed ? (
                        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 shrink-0" />
                          <span className="text-xs font-bold">شكراً لاشتراكك! سنرسل لك العروض الحصرية أولاً بأول.</span>
                        </div>
                      ) : (
                        <form onSubmit={handleSubscribeNewsletter} className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                          <input
                            type="email"
                            required
                            placeholder="بريدك الإلكتروني..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-transparent px-4 py-3 text-xs text-slate-800 focus:outline-none text-right"
                          />
                          <button
                            type="submit"
                            className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                          >
                            اشترك
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <ProductDetails
            laptop={selectedLaptop}
            onAddToCart={handleAddToCart}
            onBuyNow={(laptop) => {
              handleAddToCart(laptop);
              setActiveTab('cart');
              scrollToTop();
            }}
            onSelectSimilar={handleSelectLaptop}
            onBackToHome={() => {
              setActiveTab('home');
              scrollToTop();
            }}
          />
        )}

        {activeTab === 'cart' && (
          <Cart
            cartItems={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onCheckout={handleCheckout}
            onBackToHome={() => {
              setActiveTab('home');
              scrollToTop();
            }}
          />
        )}

        {activeTab === 'orders' && (
          <OrderHistory
            orders={orders.filter(o => o.userId === currentUser?.id)}
            onBackToHome={() => {
              setActiveTab('home');
              scrollToTop();
            }}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onBackToHome={() => {
              setActiveTab('home');
              scrollToTop();
            }}
          />
        )}

        {activeTab === 'profile' && (
          <Profile
            user={currentUser}
            ordersCount={orders.filter(o => o.userId === currentUser?.id).length}
            onBackToHome={() => {
              setActiveTab('home');
              scrollToTop();
            }}
            onNavigateTab={(tab) => {
              setActiveTab(tab as any);
              scrollToTop();
            }}
            onLogout={async () => {
              if (auth && isFirebaseConfigured()) {
                await firebaseSignOut(auth);
              }
              dbService.supabase.auth.signOut();
              dbService.localAuth.signOut();
              setIsLoggedIn(false);
              setCurrentUser(null);
              setIsAdminAuthenticated(false);
              setCart([]);
              setActiveTab('home');
              scrollToTop();
            }}
            onDeleteAccount={async () => {
              if (currentUser?.id?.startsWith('admin-')) {
                alert('لا يمكن حذف حساب المدير الرئيسي.');
                return;
              }
              if (currentUser) {
                // Delete from local store
                dbService.localAuth.deleteUser(currentUser.id);
                dbService.localAuth.signOut();
                // Also remove from Supabase if configured
                try {
                  await dbService.deleteUser(currentUser.id);
                  await dbService.supabase.auth.signOut();
                } catch { }
              }
              setIsLoggedIn(false);
              setCurrentUser(null);
              setCart([]);
              setOrders([]);
              setActiveTab('home');
              scrollToTop();
              alert('تم حذف بيانات حسابك بالكامل بنجاح. نأمل رؤيتك مجدداً!');
            }}
            onNavigateAdmin={() => {
              if (!isAdminAuthenticated) {
                setShowAdminAuth(true);
              } else {
                setActiveTab('admin');
                scrollToTop();
              }
            }}
          />
        )}


      </main>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative w-full max-w-xl animate-in zoom-in-95 duration-300">
            {authType === 'login' ? (
              <Login
                onLogin={async (email, password) => {
                  if (!email || !password) return;

                  const supabaseConfigured = !!(
                    import.meta.env.VITE_SUPABASE_URL &&
                    import.meta.env.VITE_SUPABASE_ANON_KEY &&
                    (import.meta.env.VITE_SUPABASE_ANON_KEY as string).startsWith('eyJ')
                  );

                  // ── FIREBASE OR LOCAL AUTH MODE ──
                  if (!supabaseConfigured) {
                    if (auth && isFirebaseConfigured()) {
                      try {
                        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
                        const profileSnap = await getDoc(doc(db, 'profiles', userCred.user.uid));
                        if (profileSnap.exists()) {
                          const data = profileSnap.data();
                          const userProfile: User = {
                            id: userCred.user.uid,
                            fullName: data.full_name || 'مستخدم',
                            email: userCred.user.email || '',
                            role: data.role || 'user',
                            createdAt: data.created_at || new Date().toISOString()
                          };
                          setCurrentUser(userProfile);
                          setIsLoggedIn(true);
                          if (data.role === 'admin') {
                            setIsAdminAuthenticated(true);
                            setShowAuthModal(false);
                            window.location.href = '/admin.html';
                            return;
                          }
                        } else {
                          const userProfile: User = {
                            id: userCred.user.uid,
                            fullName: 'مستخدم',
                            email: userCred.user.email || '',
                            role: 'user',
                            createdAt: new Date().toISOString()
                          };
                          setCurrentUser(userProfile);
                          setIsLoggedIn(true);
                        }
                        setShowAuthModal(false);
                        scrollToTop();
                      } catch (error: any) {
                        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                          alert('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
                        } else {
                          alert('حدث خطأ أثناء تسجيل الدخول: ' + error.message);
                        }
                      }
                      return;
                    }

                    // Fallback to local auth if Firebase not configured
                    const { user, error } = dbService.localAuth.signIn(email, password);
                    if (error || !user) {
                      const msg = error || 'خطأ في تسجيل الدخول';
                      alert(
                        msg + '\n\n' +
                        '💡 إذا كنت متأكداً من صحة البيانات، قد تكون بيانات المتصفح قد مُسحت.\n' +
                        'يمكنك إنشاء حساب جديد بنفس البريد الإلكتروني.'
                      );
                      return;
                    }
                    setCurrentUser(user);
                    setIsLoggedIn(true);
                    if (user.role === 'admin') {
                      setIsAdminAuthenticated(true);
                      setShowAuthModal(false);
                      window.location.href = '/admin.html';
                      return;
                    }
                    setShowAuthModal(false);
                    scrollToTop();
                    return;
                  }

                  // ── SUPABASE MODE ──
                  try {
                    const { data: signInData, error } = await dbService.supabase.auth.signInWithPassword({ email: email.trim(), password });
                    if (error) {
                      // Supabase failed — try local as fallback
                      const { user: localUser, error: localErr } = dbService.localAuth.signIn(email, password);
                      if (localUser) {
                        setCurrentUser(localUser);
                        setIsLoggedIn(true);
                        if (localUser.role === 'admin') {
                          setIsAdminAuthenticated(true);
                          setShowAuthModal(false);
                          window.location.href = '/admin.html';
                          return;
                        }
                      } else {
                        alert(localErr || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
                      }
                      return;
                    }
                    if (signInData?.user) {
                      // Sync localAuth session
                      dbService.localAuth.signIn(email, password);
                      const { data: profile } = await dbService.supabase.from('profiles').select('*').eq('id', signInData.user.id).single();
                      const userProfile: User = profile ? { id: profile.id, fullName: profile.full_name, email: profile.email, role: profile.role as 'admin' | 'user', createdAt: profile.created_at } : {
                        id: signInData.user.id,
                        fullName: signInData.user.user_metadata?.full_name || 'مستخدم',
                        email: signInData.user.email || email,
                        role: 'user',
                        createdAt: new Date().toISOString()
                      };
                      setCurrentUser(userProfile);
                      setIsLoggedIn(true);
                      if (userProfile.role === 'admin') {
                        setIsAdminAuthenticated(true);
                        setShowAuthModal(false);
                        window.location.href = '/admin.html';
                        return;
                      }
                    }
                  } catch {
                    const { user: localUser } = dbService.localAuth.signIn(email, password);
                    if (localUser) {
                      setCurrentUser(localUser);
                      setIsLoggedIn(true);
                    } else {
                      alert('تعذر الاتصال. تحقق من اتصالك بالإنترنت.');
                      return;
                    }
                  }

                  setShowAuthModal(false);
                  scrollToTop();
                }}
                onNavigate={(tab) => setAuthType(tab as any)}
                onClose={() => setShowAuthModal(false)}
                onGoogleLogin={async () => {
                  if (!auth) { alert('إعدادات Firebase غير متوفرة'); return; }
                  try {
                    const provider = new GoogleAuthProvider();
                    const result = await signInWithPopup(auth, provider);
                    setCurrentUser({
                      id: result.user.uid,
                      email: result.user.email || '',
                      fullName: result.user.displayName || 'مستخدم جوجل',
                      role: 'customer'
                    });
                    setIsLoggedIn(true);
                    setShowAuthModal(false);
                  } catch (error: any) {
                    console.error('Google Sign-In Error:', error);
                    if (error?.code === 'auth/unauthorized-domain') {
                      alert('عذراً، تسجيل الدخول عبر قوقل لا يعمل عند استخدام عنوان IP محلي. يرجى فتح الموقع عبر localhost أو إضافة عنوان IP إلى إعدادات Firebase.');
                    } else {
                      alert('حدث خطأ أثناء تسجيل الدخول بحساب قوقل: ' + (error?.message || ''));
                    }
                  }
                }}
              />
            ) : (
              <Signup
                onSignup={async (userData) => {
                  const fullPhone = userData.countryCode + userData.phone;
                  const cleanEmail = userData.email.trim();

                  const supabaseConfigured = !!(
                    import.meta.env.VITE_SUPABASE_URL &&
                    import.meta.env.VITE_SUPABASE_ANON_KEY &&
                    (import.meta.env.VITE_SUPABASE_ANON_KEY as string).startsWith('eyJ')
                  );

                  // ── FIREBASE OR LOCAL AUTH MODE ──
                  if (!supabaseConfigured) {
                    if (auth && isFirebaseConfigured()) {
                      try {
                        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, userData.password);
                        const userProfile = {
                          full_name: userData.fullName,
                          email: cleanEmail,
                          role: 'user',
                          created_at: new Date().toISOString(),
                          phone: fullPhone
                        };
                        await setDoc(doc(db, 'profiles', userCred.user.uid), userProfile);
                        
                        setCurrentUser({
                          id: userCred.user.uid,
                          fullName: userData.fullName,
                          email: cleanEmail,
                          role: 'user',
                          createdAt: userProfile.created_at,
                          phone: fullPhone
                        });
                        setIsLoggedIn(true);
                        setShowAuthModal(false);
                      } catch (error: any) {
                        if (error.code === 'auth/email-already-in-use') {
                          alert('هذا البريد الإلكتروني مسجل مسبقاً. يرجى تسجيل الدخول.');
                          setAuthType('login');
                        } else if (error.code === 'auth/operation-not-allowed') {
                          alert('عذراً! تسجيل الدخول بالبريد غير مفعل في Firebase. يرجى تفعيله من (Authentication -> Sign-in method).');
                        } else {
                          alert('فشل إنشاء الحساب: ' + error.message);
                        }
                      }
                      return;
                    }

                    // Fallback to local auth if Firebase not configured
                    const { user, error } = dbService.localAuth.signUp(
                      cleanEmail,
                      userData.password,
                      { full_name: userData.fullName, phone: fullPhone }
                    );
                    if (error || !user) {
                      if (error?.includes('مسجل مسبقاً')) {
                        const confirmReset = window.confirm(
                          'هذا البريد الإلكتروني مسجل مسبقاً.\n\n' +
                          'إذا نسيت كلمة المرور وتريد إعادة تعيين الحساب، اضغط "موافق".\n' +
                          'أو اضغط "إلغاء" وحاول تسجيل الدخول بدلاً من ذلك.'
                        );
                        if (confirmReset) {
                          dbService.localAuth.deleteUser(
                            dbService.localAuth.getUsers().find(u => u.email.toLowerCase() === cleanEmail.toLowerCase())?.id || ''
                          );
                          const { user: newUser, error: newErr } = dbService.localAuth.signUp(
                            cleanEmail, userData.password,
                            { full_name: userData.fullName, phone: fullPhone }
                          );
                          if (newUser) {
                            setCurrentUser(newUser);
                            setIsLoggedIn(true);
                            setShowAuthModal(false);
                            alert('🎉 تم إعادة تعيين الحساب وتسجيله بنجاح!');
                          } else {
                            alert(newErr || 'فشل إنشاء الحساب.');
                          }
                        } else {
                          setAuthType('login');
                        }
                        return;
                      }
                      alert(error || 'فشل إنشاء الحساب');
                      return;
                    }
                    setCurrentUser(user);
                    setIsLoggedIn(true);
                    setShowAuthModal(false);
                    if (cart.length > 0) {
                      setActiveTab('cart');
                      scrollToTop();
                    } else {
                      alert('🎉 تم إنشاء حسابك بنجاح! مرحباً بك في Y TECK.');
                    }
                    return;
                  }

                  // ── SUPABASE MODE ──
                  try {
                    const { data, error } = await dbService.supabase.auth.signUp({
                      email: cleanEmail,
                      password: userData.password,
                      options: { data: { full_name: userData.fullName || 'مستخدم جديد', phone: fullPhone } }
                    });

                    // 🛡️ Always register in localAuth to guarantee permanent login retention
                    dbService.localAuth.signUp(
                      cleanEmail, userData.password,
                      { full_name: userData.fullName, phone: fullPhone }
                    );

                    if (error) {
                      // If Supabase errored but localAuth created account, proceed with localAuth
                      const localRes = dbService.localAuth.signIn(cleanEmail, userData.password);
                      if (localRes.user) {
                        setCurrentUser(localRes.user);
                        setIsLoggedIn(true);
                        setShowAuthModal(false);
                        alert('🎉 تم إنشاء حسابك بنجاح!');
                        return;
                      }
                      alert(`فشل إنشاء الحساب: ${error.message}`);
                      return;
                    }

                    if (data?.user) {
                      try {
                        await dbService.supabase.from('profiles').update({ phone: fullPhone }).eq('id', data.user.id);
                      } catch { }

                      const createdUser: User = {
                        id: data.user.id,
                        fullName: userData.fullName || 'مستخدم',
                        email: cleanEmail,
                        role: 'user',
                        createdAt: new Date().toISOString(),
                        phone: fullPhone
                      };
                      setCurrentUser(createdUser);
                      setIsLoggedIn(true);
                      setShowAuthModal(false);
                      alert('🎉 تم إنشاء حسابك بنجاح! مرحباً بك في Y TECK.');
                      return;
                    }
                  } catch {
                    const { user: localUser, error: localErr } = dbService.localAuth.signUp(
                      cleanEmail, userData.password,
                      { full_name: userData.fullName, phone: fullPhone }
                    );
                    if (localUser) {
                      setCurrentUser(localUser);
                      setIsLoggedIn(true);
                      setShowAuthModal(false);
                      alert('🎉 تم إنشاء حسابك بنجاح!');
                    } else {
                      alert(localErr || 'فشل الاتصال. تحقق من الإنترنت وحاول مجدداً.');
                    }
                    return;
                  }

                  setShowAuthModal(false);
                  if (cart.length > 0) {
                    setActiveTab('cart');
                    scrollToTop();
                  } else {
                    alert('تم إنشاء الحساب بنجاح! يمكنك الآن بدء التسوق.');
                  }
                }}
                onNavigate={(tab) => setAuthType(tab as any)}
                onClose={() => setShowAuthModal(false)}
                onGoogleLogin={async () => {
                  if (!auth) { alert('إعدادات Firebase غير متوفرة'); return; }
                  try {
                    const provider = new GoogleAuthProvider();
                    const result = await signInWithPopup(auth, provider);
                    setCurrentUser({
                      id: result.user.uid,
                      email: result.user.email || '',
                      fullName: result.user.displayName || 'مستخدم جوجل',
                      role: 'customer'
                    });
                    setIsLoggedIn(true);
                    setShowAuthModal(false);
                    if (cart.length > 0) {
                      setActiveTab('cart');
                    }
                  } catch (error) {
                    console.error('Google Sign-In Error:', error);
                    alert('حدث خطأ أثناء تسجيل الدخول بحساب قوقل.');
                  }
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Corporate modern Footer */}
      <Footer
        onNavigateCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('home');
          scrollToTop();

          setTimeout(() => {
            const anchor = document.getElementById('catalog-grid-anchor');
            anchor?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          scrollToTop();
        }}
      />

      {showCheckoutModal && (
        <CheckoutModal
          onClose={() => setShowCheckoutModal(false)}
          onConfirm={finalizeCheckout}
          isSubmitting={isSubmittingCheckout}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          scrollToTop();
        }}
        cartCount={cart.length}
        isLoggedIn={isLoggedIn}
        onOpenMobileFilters={() => setShowMobileFilters(true)}
        unreadCount={notifications.filter(n => !n.read).length}
      />

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="relative bg-white w-full max-h-[85vh] rounded-t-3xl shadow-2xl flex flex-col" dir="rtl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900">تصفية المنتجات</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer">
                <Check className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 mb-3">التصنيفات</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${!selectedBrand ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    الكل
                  </button>
                  {['Apple', 'Dell', 'HP', 'Lenovo', 'Microsoft'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(selectedBrand === b ? null : b)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${selectedBrand === b ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h4 className="text-sm font-extrabold text-slate-900 mb-3">نطاق السعر</h4>
                <div className="space-y-3">
                  {[
                    { id: 'under-1500', label: 'أقل من 1500 ر.س' },
                    { id: '1500-3000', label: '1500 - 3000 ر.س' },
                    { id: '3000-5000', label: '3000 - 5000 ر.س' },
                    { id: 'over-5000', label: 'أكثر من 5000 ر.س' }
                  ].map((range) => (
                    <label key={range.id} className="flex items-center gap-3 text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="mobilePriceRange"
                        checked={priceRange === range.id}
                        onChange={() => setPriceRange(priceRange === range.id ? null : range.id)}
                        className="w-5 h-5 accent-slate-900"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 bg-indigo-600 text-white font-bold py-3.5 rounded-xl"
              >
                تطبيق الفرز ({filteredLaptops.length})
              </button>
              {(selectedCategory || selectedBrand || priceRange || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedBrand(null);
                    setPriceRange(null);
                    setSearchQuery('');
                  }}
                  className="px-6 bg-slate-100 text-slate-800 font-bold py-3.5 rounded-xl"
                >
                  إعادة تعيين
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
