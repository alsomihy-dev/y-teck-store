import React from 'react';
import { Home, Filter, ShoppingBag, User } from 'lucide-react';
import { ViewTab } from '../types';

interface BottomNavProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  cartCount: number;
  isLoggedIn: boolean;
  onOpenMobileFilters?: () => void;
}

export default function BottomNav({
  activeTab,
  setActiveTab,
  cartCount,
  isLoggedIn,
  onOpenMobileFilters
}: BottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-[100] pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            activeTab === 'home' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className={`w-6 h-6 ${activeTab === 'home' ? 'fill-indigo-50' : ''}`} />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>

        <button
          onClick={() => {
            if (activeTab !== 'home') setActiveTab('home');
            if (onOpenMobileFilters) onOpenMobileFilters();
          }}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            activeTab === 'home' && false ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Filter className="w-6 h-6" />
          <span className="text-[10px] font-bold">تصفية</span>
        </button>

        <button
          onClick={() => setActiveTab('cart')}
          className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            activeTab === 'cart' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-6 h-6 ${activeTab === 'cart' ? 'fill-indigo-50' : ''}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">السلة</span>
        </button>

        <button
          onClick={() => setActiveTab(isLoggedIn ? 'profile' : 'login')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            (activeTab === 'profile' || activeTab === 'login') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className={`w-6 h-6 ${(activeTab === 'profile' || activeTab === 'login') ? 'fill-indigo-50' : ''}`} />
          <span className="text-[10px] font-bold">{isLoggedIn ? 'حسابي' : 'دخول'}</span>
        </button>
      </div>
    </div>
  );
}
