import React from 'react';
import { Mail, Lock, Chrome, Apple as AppleIcon, X } from 'lucide-react';
import { ViewTab } from '../types';

interface LoginProps {
  onLogin: (email?: string, password?: string) => void;
  onNavigate: (tab: ViewTab) => void;
  onClose: () => void;
  onGoogleLogin: () => void;
}

export default function Login({ onLogin, onNavigate, onClose, onGoogleLogin }: LoginProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="w-full bg-[#f1f5f9] flex flex-col items-center justify-center py-6 px-4 font-sans rounded-3xl" dir="rtl">
      
      {/* Brand Header */}
      <div className="text-center mb-6 relative w-full max-w-sm">
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-md text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
          title="العودة"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">Y TECK</h1>
        <p className="text-slate-500 text-sm mt-1">بوابتك للتقنية المستدامة</p>
      </div>

      {/* Login Card */}
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-2xl shadow-slate-900/10 p-8 space-y-6 border border-slate-100">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">تسجيل الدخول</h2>
          <p className="text-slate-400 text-sm">مرحباً بك مجدداً في عائلة Y TECK</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-slate-700 block mr-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              placeholder="example@tech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-300 text-sm rounded-2xl py-3.5 px-4 border border-slate-100 focus:outline-none focus:border-slate-300 transition-all text-right"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 text-right">
            <div className="flex justify-between items-center mr-1">
              <label className="text-xs font-bold text-slate-700">كلمة المرور</label>
              <button type="button" className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors">
                نسيت؟
              </button>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-300 text-sm rounded-2xl py-3.5 px-4 border border-slate-100 focus:outline-none focus:border-slate-300 transition-all text-right"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-slate-900/10 cursor-pointer"
          >
            تسجيل الدخول
          </button>
        </form>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-slate-400">أو عبر</span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="flex justify-center w-full">
          <button 
            type="button"
            onClick={onGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-slate-100 py-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xs font-bold text-slate-700">تسجيل الدخول بواسطة جوجل</span>
          </button>
        </div>

        {/* Signup Link */}
        <div className="text-center pt-2">
          <button 
            onClick={() => onNavigate('signup')}
            className="text-xs font-bold text-slate-900 hover:underline"
          >
            ليس لديك حساب؟ <span className="text-slate-400">أنشئ حساباً</span>
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-12 flex gap-8 text-[11px] font-bold text-slate-400">
        <button className="hover:text-slate-600 transition-colors">سياسة الخصوصية</button>
        <button className="hover:text-slate-600 transition-colors">شروط الخدمة</button>
        <button className="hover:text-slate-600 transition-colors">الدعم الفني</button>
      </div>
    </div>
  );
}
