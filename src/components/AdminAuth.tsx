import React from 'react';
import { User, Mail, Phone, Lock, X, LayoutDashboard, ArrowRight, ShieldCheck } from 'lucide-react';

interface AdminAuthProps {
  onSuccess: (adminData: any) => void;
  onCancel: () => void;
}

export default function AdminAuth({ onSuccess, onCancel }: AdminAuthProps) {
  const [isSignup, setIsSignup] = React.useState(() => {
    return !localStorage.getItem('admin_account');
  });
  
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+967',
    password: '',
    confirmPassword: ''
  });

  const [loginData, setLoginData] = React.useState({
    email: '',
    password: ''
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('كلمات المرور غير متطابقة!');
      return;
    }

    // Encryption Simulation
    const encryptedPassword = btoa(formData.password); // Base64 for simulation
    const adminAccount = {
      ...formData,
      password: encryptedPassword,
      role: 'SUPER_ADMIN'
    };

    localStorage.setItem('admin_account', JSON.stringify(adminAccount));
    alert('تم إنشاء حساب المسؤول وتشفير البيانات بنجاح!');
    onSuccess(adminAccount);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('admin_account');
    if (!stored) {
      alert('لا يوجد حساب مسؤول مسجل حالياً.');
      setIsSignup(true);
      return;
    }

    const adminAccount = JSON.parse(stored);
    const encryptedPassword = btoa(loginData.password);

    if (loginData.email === adminAccount.email && encryptedPassword === adminAccount.password) {
      onSuccess(adminAccount);
    } else {
      alert('البريد الإلكتروني أو كلمة السر غير صحيحة!');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md" dir="rtl">
      <div className="bg-white w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header Decor */}
        <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
          
          <button 
            onClick={onCancel}
            className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 space-y-4">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto border border-white/10">
               <ShieldCheck className="w-8 h-8 text-white" />
             </div>
             <h2 className="text-2xl font-extrabold text-white">نظام إدارة Y TECK</h2>
             <p className="text-slate-400 text-sm max-w-xs mx-auto">
               {isSignup ? 'أهلاً بك، قم ببدء إعداد حساب المسؤول الرئيسي للنظام بتشفير كامل.' : 'قم بتسجيل الدخول للوصول إلى لوحة التحكم بصلاحيات المسؤول.'}
             </p>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          {isSignup ? (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block mr-1">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    placeholder="الاسم الثلاثي..."
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-all text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block mr-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@yteck.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-all text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                 <div className="md:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block mr-1">مفتاح الدولة</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none"
                    value={formData.countryCode}
                    onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                  >
                    <option value="+967">+967 (اليمن)</option>
                    <option value="+966">+966 (السعودية)</option>
                    <option value="+1">+1 (أمريكا)</option>
                  </select>
                </div>
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block mr-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    required
                    placeholder="770000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-all text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block mr-1">كلمة السر</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-all text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block mr-1">تأكيد كلمة السر</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-all text-right"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all mt-4"
              >
                <span>إنشاء وتشفير الحساب</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block mr-1">البريد الإلكتروني للمسؤول</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@yteck.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-all text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block mr-1">كلمة المرور المشفرة</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-all text-right"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-950 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <span>تسجيل الدخول الآمن</span>
                  <LayoutDashboard className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      if(window.confirm('هل تود مسح الحساب الحالي وإنشاء واحد جديد؟')) {
                        localStorage.removeItem('admin_account');
                        setIsSignup(true);
                      }
                    }}
                    className="text-xs text-slate-400 hover:text-indigo-600"
                  >
                    هل نسيت بيانات المسؤول؟ <span className="underline">إعادة ضبط</span>
                  </button>
                </div>
            </form>
          )
          }

          <div className="mt-8 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
               Y TECK SECURITY - AES 256 BIT ENCRYPTION SIMULATED
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
