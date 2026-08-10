import React from 'react';
import { User, Mail, Phone, Lock, Globe, X, Apple as AppleIcon } from 'lucide-react';
import { ViewTab } from '../types';

interface SignupProps {
  onSignup: (userData: any) => void;
  onNavigate: (tab: ViewTab) => void;
  onClose: () => void;
  onGoogleLogin: () => void;
}

export default function Signup({ onSignup, onNavigate, onClose, onGoogleLogin }: SignupProps) {
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+967',
    password: '',
    confirmPassword: ''
  });
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Name validation: 3 words
    const nameParts = formData.fullName.trim().split(/\s+/);
    if (nameParts.length < 3) {
      setErrorMsg('الرجاء إدخال الاسم الثلاثي كاملاً (ثلاث كلمات على الأقل).');
      return;
    }

    // Country Code validation
    if (!/^(\+|00)\d+$/.test(formData.countryCode)) {
      setErrorMsg('مفتاح الدولة غير صالح. يجب أن يبدأ بـ + أو 00 متبوعاً بأرقام.');
      return;
    }

    // Phone validation: digits only, max 15
    if (!/^\d{5,15}$/.test(formData.phone)) {
      setErrorMsg('رقم الهاتف غير صالح. يجب أن يحتوي على أرقام فقط وبحد أقصى 15 رقماً.');
      return;
    }

    // Email validation (trim spaces first)
    const cleanEmail = formData.email.trim();
    // A standard, more forgiving regex for email
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanEmail)) {
      setErrorMsg('البريد الإلكتروني غير صالح.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('كلمات المرور غير متطابقة!');
      return;
    }
    
    // Update formData with the trimmed email before sending
    onSignup({ ...formData, email: cleanEmail });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Allow only numbers, max 15
      const digitsOnly = value.replace(/\D/g, '').slice(0, 15);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrorMsg(''); // Clear error when typing
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

      {/* Signup Card */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-900/10 p-8 space-y-6 border border-slate-100">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">إنشاء حساب جديد</h2>
          <p className="text-slate-400 text-sm">انضم إلى عائلة Y TECK واستمتع بأفضل العروض</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 text-right">
            {errorMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-700 block mr-1">الاسم الثنائي</label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="أحمد علي..."
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-300 text-sm rounded-2xl py-3 px-4 border border-slate-100 focus:outline-none focus:border-slate-300 transition-all text-right"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-700 block mr-1">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                required
                placeholder="example@tech.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-300 text-sm rounded-2xl py-3 px-4 border border-slate-100 focus:outline-none focus:border-slate-300 transition-all text-right"
              />
            </div>

            {/* Phone */}
            <div className="flex gap-2">
              <div className="w-1/3">
                <input
                  type="text"
                  name="countryCode"
                  required
                  placeholder="+967"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-300 text-sm rounded-2xl py-3 px-4 border border-slate-100 focus:outline-none focus:border-slate-300 transition-all text-left"
                  dir="ltr"
                />
              </div>
              <div className="w-2/3">
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={15}
                  placeholder="77XXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-300 text-sm rounded-2xl py-3 px-4 border border-slate-100 focus:outline-none focus:border-slate-300 transition-all text-right"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-700 block mr-1">كلمة المرور</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-300 text-sm rounded-2xl py-3 px-4 border border-slate-100 focus:outline-none focus:border-slate-300 transition-all text-right"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-700 block mr-1">تأكيد كلمة المرور</label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-300 text-sm rounded-2xl py-3 px-4 border border-slate-100 focus:outline-none focus:border-slate-300 transition-all text-right"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-slate-900/10 cursor-pointer"
          >
            إنشاء الحساب
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

        {/* Login Link */}
        <div className="text-center pt-2">
          <button 
            onClick={() => onNavigate('login')}
            className="text-xs font-bold text-slate-900 hover:underline"
          >
            لديك حساب بالفعل؟ <span className="text-slate-400">سجل دخولك</span>
          </button>
        </div>
      </div>
    </div>
  );
}
