import React from 'react';
import { User, ShieldCheck, Mail, LogOut, ChevronLeft, CreditCard, Award, MapPin, Settings, LayoutDashboard } from 'lucide-react';

interface ProfileProps {
  onBackToHome: () => void;
  onNavigateTab: (tab: 'home' | 'orders' | 'cart') => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onNavigateAdmin?: () => void;
  user: any;
  ordersCount?: number;
}

export default function Profile({ onBackToHome, onNavigateTab, onLogout, onDeleteAccount, onNavigateAdmin, user, ordersCount = 0 }: ProfileProps) {
  return (
    <div className="py-10 bg-[#f7f9fb]" dir="rtl" id="user-profile-page">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        
        {/* Core Member Identity Card */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl overflow-hidden text-white shadow-xl text-center relative border border-slate-800">
          
          <div className="p-8 space-y-4">
            
            {/* Avatar Frame with gold verified seal badge */}
            <div className="relative w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 shadow-md">
              <User className="w-12 h-12 text-slate-500" />
              <div className="absolute bottom-0 right-0 bg-yellow-400 text-slate-900 p-1.5 rounded-full border-2 border-slate-900 shadow" title="عضو جديد">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold">{user?.fullName || 'عضو جديد'}</h2>
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email || 'user@example.com'}</span>
              </p>
            </div>

            {/* Loyalty badge */}
            <span className="inline-flex items-center gap-1.5 bg-yellow-400/15 border border-yellow-400/30 text-yellow-300 text-[10px] font-bold px-4 py-1.5 rounded-full">
              <Award className="w-3.5 h-3.5" />
              <span>عضو مميز (Premium Member)</span>
            </span>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/80">
              <div className="text-center">
                <span className="text-2xl font-extrabold text-white block">{ordersCount}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">طلب ناجح</span>
              </div>
              <div className="text-center border-r border-slate-800/80">
                <span className="text-2xl font-extrabold text-white block">{(ordersCount * 12.4).toFixed(1)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">نقطة ولاء</span>
              </div>
            </div>

          </div>

        </div>

        {/* Navigation Menus List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-right mt-6 space-y-1">
          
          <button 
            onClick={() => onNavigateTab('orders')}
            className="w-full p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between text-slate-700 hover:text-slate-950 cursor-pointer text-right"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-600">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block">مشترياتي وطلباتي</span>
                <span className="text-[9px] text-slate-400 block">تتبع طرود اللابتوب وصيانتها</span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          <button className="w-full p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between text-slate-700 hover:text-slate-950 cursor-pointer text-right">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-600">
                <CreditCard className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block">المحافظ الإلكترونية</span>
                <span className="text-[9px] text-slate-400 block">عرض أرقام الحسابات فقط</span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          <button className="w-full p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between text-slate-700 hover:text-slate-950 cursor-pointer text-right">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-600">
                <Settings className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block">الإعدادات والخصوصية</span>
                <span className="text-[9px] text-slate-400 block">تعديل الملف والبريد الإلكتروني</span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          {/* Admin Panel Access */}
          {user?.role === 'admin' && (
            <button 
              onClick={onNavigateAdmin}
              className="w-full p-3 hover:bg-indigo-50 rounded-xl transition-all flex items-center justify-between text-indigo-700 hover:text-indigo-900 cursor-pointer text-right bg-indigo-50/30 border border-indigo-100/50"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center border border-indigo-200 text-indigo-600">
                  <LayoutDashboard className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">لوحة تحكم المسؤول</span>
                  <span className="text-[9px] text-indigo-400 block">إدارة المنتجات، الطلبات، والإعدادات</span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-indigo-400" />
            </button>
          )}

        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={onLogout}
          className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 mt-6 border border-rose-150 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج من الحساب</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('هل أنت متأكد من رغبتك في حذف حسابك نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
              onDeleteAccount();
            }
          }}
          className="w-full mt-3 py-2 text-[11px] font-bold text-rose-400 hover:text-rose-600 transition-colors cursor-pointer underline decoration-dotted"
        >
          حذف حسابي ب الكاامل وإغلاق العضوية
        </button>

        <span className="text-[10px] text-slate-400 text-center block mt-6">
          Y TECK إصدار التطبيق 1.0.4 - جميع الحقوق محفوظة
        </span>

      </div>
    </div>
  );
}
