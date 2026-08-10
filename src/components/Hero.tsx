import React from 'react';

interface HeroProps {
  onShopNowClick: () => void;
  onViewSpecsClick: () => void;
}

export default function Hero({ onShopNowClick, onViewSpecsClick }: HeroProps) {
  return (
    <div 
      className="bg-[#0f172a] text-white overflow-hidden py-16 sm:py-24 relative" 
      dir="rtl"
      id="store-hero"
    >
      {/* Abstract dark blue patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-900 opacity-90 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Laptop Image with Desk Lamp look */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-slate-950 p-3 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden max-w-full sm:max-w-md md:max-w-lg">
                <img 
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800" 
                  alt="Y TECK MacBook" 
                  className="rounded-2xl w-full h-[280px] sm:h-[350px] object-cover transition-transform duration-700 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                
                {/* Glow representation of the designer lamp */}
                <div className="absolute top-4 left-4 bg-yellow-400/10 backdrop-blur-md border border-yellow-400/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-yellow-300">أجهزة فحص معتمدة 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 text-right order-1 lg:order-2 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300 tracking-wide">إصدار محدود 2024</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-none">
              قوة الأداء <br className="hidden sm:inline" />
              <span className="text-slate-300">في متناول يدك</span>
            </h1>
            
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              اكتشف مجموعة مختارة ومتميزة من أجهزة MacBook الاحترافية واللايبتوبات عالية الأداء المستوردة مباشرة من الوكلاء بأسعار استثنائية وضمان ذهبي كامل لمدة عام.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4">
              <button
                onClick={onShopNowClick}
                className="bg-[#ffffff] hover:bg-[#f8fafc] text-[#020617] font-bold px-8 py-3.5 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center text-sm sm:text-base cursor-pointer"
              >
                تسوق الآن
              </button>
              
              <button
                onClick={onViewSpecsClick}
                className="bg-transparent hover:bg-white/5 text-white font-bold px-8 py-3.5 sm:py-4 rounded-xl border border-white/30 hover:border-white transition-all duration-300 text-center text-sm sm:text-base cursor-pointer"
              >
                عرض المواصفات
              </button>
            </div>

            {/* Micro details */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-slate-800/60 text-right">
              <div>
                <span className="block text-xl sm:text-3xl font-bold text-white">40+</span>
                <span className="text-[10px] sm:text-xs text-slate-500">نقطة فحص فنية</span>
              </div>
              <div>
                <span className="block text-xl sm:text-3xl font-bold text-white">12 شهر</span>
                <span className="text-[10px] sm:text-xs text-slate-500">ضمان معتمد كامل</span>
              </div>
              <div>
                <span className="block text-xl sm:text-3xl font-bold text-white">100%</span>
                <span className="text-[10px] sm:text-xs text-slate-500">أصلي ومجدد</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
