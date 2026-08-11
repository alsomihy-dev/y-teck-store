import React from 'react';
import { Search, ShoppingBag, User, Menu, X, Plus, LayoutDashboard, Moon, Sun, Bell } from 'lucide-react';
import { ViewTab, UserNotification } from '../types';

interface NavbarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onAdminClick: () => void;
  awaitingPaymentCount?: number;
  notifications?: UserNotification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  searchQuery,
  setSearchQuery,
  isLoggedIn,
  isAdmin,
  onAdminClick,
  awaitingPaymentCount = 0,
  notifications = [],
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNavClick = (tab: ViewTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm" dir="rtl" id="app-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-0">
        <div className="flex flex-col md:flex-row justify-between md:h-20 gap-3 md:gap-0 items-center">
          
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Logo & Brand */}
            <div className="flex items-center gap-8">
              <button 
                onClick={() => handleNavClick('home')} 
                className="flex items-center gap-3 focus:outline-none group cursor-pointer"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-md">
                  {/* Visual Y Logo */}
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 15L45 55V90H55V55L80 15" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="15" y1="80" x2="85" y2="80" stroke="#64748B" strokeWidth="10" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="text-right">
                  <span className="font-sans text-lg md:text-xl font-bold text-slate-900 block tracking-tight">Y TECK</span>
                  <span className="text-slate-400 text-[10px] md:text-xs block -mt-1">LAPTOP STORE</span>
                </div>
              </button>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-6">
                <button 
                  onClick={() => handleNavClick('home')} 
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === 'home' ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  الرئيسية
                </button>

                <button 
                  onClick={() => handleNavClick('profile')} 
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === 'profile' ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  حسابي
                </button>
                <button 
                  onClick={() => handleNavClick('orders')} 
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer relative ${activeTab === 'orders' ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  الإشعارات والطلبات
                  {awaitingPaymentCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                      {awaitingPaymentCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Notification and Icons */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-full hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                title="تغيير المظهر"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {isLoggedIn && !isAdmin && onMarkNotificationAsRead && onMarkAllNotificationsAsRead && (
                <button
                  onClick={() => handleNavClick('notifications')}
                  className={`p-1.5 rounded-full hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer relative ${activeTab === 'notifications' ? 'bg-slate-100 text-slate-900' : ''}`}
                  title="الإشعارات"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="flex w-full md:flex-1 md:max-w-md md:mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن لابتوب، موديل، أو مواصفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-sm rounded-full py-2.5 md:py-3 pr-11 pl-4 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-right"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
          {/* Desktop Right Icons */}
          <div className="hidden sm:flex items-center gap-4">

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="تغيير المظهر"
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            {/* Admin: always show dashboard button */}
            {isAdmin ? (
              <button
                onClick={onAdminClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-5 rounded-full transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                لوحة التحكم
              </button>
            ) : !isLoggedIn ? (
              /* Guest: show login button */
              <button
                onClick={() => handleNavClick('login')}
                className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-6 rounded-full transition-all cursor-pointer shadow-md"
              >
                تسجيل الدخول
              </button>
            ) : (
              /* Regular user logged in: show profile icon */
              <button
                onClick={() => handleNavClick('profile')}
                className={`p-2.5 rounded-full hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer relative ${activeTab === 'profile' ? 'bg-slate-100 text-slate-900' : ''}`}
                title="الملف الشخصي"
              >
                <User className="w-6 h-6" />
              </button>
            )}

            {isLoggedIn && !isAdmin && onMarkNotificationAsRead && onMarkAllNotificationsAsRead && (
                <button
                  onClick={() => handleNavClick('notifications')}
                  className={`p-2.5 rounded-full hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer relative ${activeTab === 'notifications' ? 'bg-slate-100 text-slate-900' : ''}`}
                  title="الإشعارات"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
            )}

            {/* Cart trigger with badge */}
            <button
              onClick={() => handleNavClick('cart')}
              className={`p-2.5 rounded-full hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer relative ${activeTab === 'cart' ? 'bg-slate-100 text-slate-900' : ''}`}
              title="سلة المشتريات"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
