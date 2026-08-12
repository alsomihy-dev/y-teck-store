import React from 'react';
import { ShieldCheck, Truck, ShoppingCart, MessageSquare, Instagram, ArrowRight, Star, Cpu, HardDrive, Layers, Battery, Monitor, CheckCircle2, Plus } from 'lucide-react';
import { Laptop } from '../types';
import { SIMILAR_LAPTOPS } from '../data';

interface ProductDetailsProps {
  laptop: Laptop;
  onAddToCart: (laptop: Laptop) => void;
  onBuyNow: (laptop: Laptop) => void;
  onSelectSimilar: (laptop: Laptop) => void;
  onBackToHome: () => void;
}

export default function ProductDetails({
  laptop,
  onAddToCart,
  onBuyNow,
  onSelectSimilar,
  onBackToHome
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = React.useState(laptop.image);

  React.useEffect(() => {
    setSelectedImage(laptop.image);
  }, [laptop]);

  const imagesList = laptop.images && laptop.images.length > 0 
    ? laptop.images 
    : [laptop.image, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800'];

  return (
    <div className="py-10 bg-[#f7f9fb]" dir="rtl" id="product-details-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <button onClick={onBackToHome} className="hover:text-slate-900 transition-colors cursor-pointer">
            الرئيسية
          </button>
          <span>&gt;</span>
          <button onClick={onBackToHome} className="hover:text-slate-900 transition-colors cursor-pointer">
            أجهزة اللابتوب
          </button>
          <span>&gt;</span>
          <span className="text-slate-800 font-bold">{laptop.name}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-slate-950 mb-6 group cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          <span>العودة لجميع الأجهزة</span>
        </button>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Right Column: Visual Galleries and Reports */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Main Visual Frame */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex items-center justify-center relative shadow-sm">
              <span className="absolute top-4 right-4 bg-slate-950 text-white text-[11px] font-bold px-3 py-1 rounded-full z-10 shadow">
                الأكثر مبيعاً
              </span>
              <img
                src={selectedImage}
                alt={laptop.name}
                className="max-h-[350px] w-auto object-contain rounded-xl transition-all"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Sub visual thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`border-2 rounded-2xl overflow-hidden h-24 bg-white p-2 flex items-center justify-center transition-all cursor-pointer ${
                    selectedImage === img ? 'border-slate-950 shadow' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${laptop.name} View ${idx + 1}`}
                    className="h-full w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>

            {/* Condition Report Framework (تقرير الحالة) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 space-y-4 shadow-sm text-right">
              <h3 className="text-[12px] sm:text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                تقرير الحالة الفنية
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span>الهيكل الخارجي</span>
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono">
                      {laptop.conditionOuter} / 10
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-slate-900 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${laptop.conditionOuter * 10}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span>أداء الشاشة</span>
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono">
                      {laptop.conditionScreen} / 10
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-slate-900 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${laptop.conditionScreen * 10}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-2 sm:p-3 border border-slate-100 text-[10px] sm:text-xs text-slate-500 leading-relaxed shadow-sm">
                الجهاز بحالة المصنع تقريباً. خضع لـ 40 نقطة فحص معتمدة من قبل فريق المهندسين لدينا للتأكد من خلوه تماماً من أي عيوب مصنعية أو تقنية مع ضمان كامل.
              </div>
            </div>

          </div>

          {/* Left Column: Specifications and Checkout Panel */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Brand block */}
            <div className="space-y-3 text-right">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-slate-100 text-slate-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border border-slate-200">
                  حالة ممتازة
                </span>
                <span className="bg-blue-50 text-blue-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border border-blue-100">
                  معتمد من Y TECK
                </span>
              </div>
              
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {laptop.name}
              </h1>
              
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                شاشة Retina فائقة الوضوح مع معالج جيل متطور، خيار {laptop.ram} وسعة {laptop.storage} لحرية التخزين وسرعة التشغيل.
              </p>
            </div>

            {/* Price Frame block */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2 sm:p-3 shadow-sm text-right">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-[10px] sm:text-xs text-slate-400 block">السعر الحالي</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {laptop.price.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{laptop.currency || 'ر.س'}</span>
                  </div>
                </div>
                
                {laptop.originalPrice > laptop.price && (
                  <div className="text-left">
                    <span className="text-xs text-slate-400 line-through block">
                      {laptop.originalPrice.toLocaleString('en-US')} {laptop.currency || 'ر.س'}
                    </span>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md block mt-1">
                      وفر {(laptop.originalPrice - laptop.price).toLocaleString('en-US')} {laptop.currency || 'ر.س'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-600 mb-3">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>متوفر في المخزون (قطعة واحدة فقط متوفرة!)</span>
              </div>

              {/* Major Action Buttons */}
              <div className="fixed md:static bottom-[4.5rem] left-4 right-4 z-40 bg-white/95 backdrop-blur-md md:bg-transparent md:backdrop-blur-none p-2 md:p-0 border border-slate-200 md:border-none rounded-2xl shadow-xl md:shadow-none flex gap-2 transition-all animate-in slide-in-from-bottom-5 md:animate-none">
                <button
                  onClick={() => onBuyNow(laptop)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 sm:py-3 rounded-lg flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01] cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">شراء الآن</span>
                </button>
                
                <button
                  onClick={() => onAddToCart(laptop)}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-bold py-2 sm:py-3 rounded-lg flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01] cursor-pointer shadow-lg"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">للسلة</span>
                </button>
              </div>
            </div>

            {/* Contact for Inquiries */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2 sm:p-3 shadow-sm text-right space-y-2">
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-900">للاستفسارات والمساعدة</h3>
              
              <div className="space-y-2">
                <p className="text-slate-500 text-[9px] sm:text-[10px] leading-relaxed">
                  هل لديك أي سؤال حول هذا الجهاز أو ترغب في معاينته بشكل مباشر؟ فريقنا متواجد لمساعدتك في أي وقت.
                </p>

                <div className="grid grid-cols-2 gap-2 pb-0.5">
                  <a
                    href="https://wa.me/967776731078"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] sm:text-xs py-1.5 sm:py-2 px-2 rounded-lg flex items-center justify-center gap-1 border border-emerald-100 transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>واتساب</span>
                  </a>
                  
                  <a
                    href="https://instagram.com/y._e_m"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] sm:text-xs py-1.5 sm:py-2 px-2 rounded-lg flex items-center justify-center gap-1 border border-rose-100 transition-colors shadow-sm"
                  >
                    <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>إنستجرام</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Delivery and Guarantees badges */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 sm:p-3 flex items-center gap-2 text-right shadow-sm">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900 shrink-0" />
                <div>
                  <span className="block text-[10px] sm:text-xs font-bold text-slate-900">ضمان سنة معتمد</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400">شامل العتاد والقطع</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-2 sm:p-3 flex items-center gap-2 text-right shadow-sm">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900 shrink-0" />
                <div>
                  <span className="block text-[10px] sm:text-xs font-bold text-slate-900">شحن مجاني</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400">توصيل آمن للمنزل</span>
                </div>
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-right space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                المواصفات التقنية الكاملة
              </h3>
              
              <div className="divide-y divide-slate-100 text-xs">
                <div className="grid grid-cols-12 py-3">
                  <span className="col-span-4 font-bold text-slate-800">المعالج (CPU)</span>
                  <span className="col-span-8 text-slate-500">{laptop.cpu}</span>
                </div>
                <div className="grid grid-cols-12 py-3">
                  <span className="col-span-4 font-bold text-slate-800">الذاكرة (RAM)</span>
                  <span className="col-span-8 text-slate-500">{laptop.ram}</span>
                </div>
                <div className="grid grid-cols-12 py-3">
                  <span className="col-span-4 font-bold text-slate-800">التخزين (SSD)</span>
                  <span className="col-span-8 text-slate-500">{laptop.storage}</span>
                </div>
                {laptop.gpu && (
                  <div className="grid grid-cols-12 py-3">
                    <span className="col-span-4 font-bold text-slate-800">الرسوميات (GPU)</span>
                    <span className="col-span-8 text-slate-500">{laptop.gpu}</span>
                  </div>
                )}
                {laptop.screen && (
                  <div className="grid grid-cols-12 py-3">
                    <span className="col-span-4 font-bold text-slate-800">الشاشة</span>
                    <span className="col-span-8 text-slate-500">{laptop.screen}</span>
                  </div>
                )}
                {laptop.battery && (
                  <div className="grid grid-cols-12 py-3">
                    <span className="col-span-4 font-bold text-slate-800">حالة البطارية</span>
                    <span className="col-span-8 text-slate-500">{laptop.battery}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Similar Laptops Panel */}
        <div className="mt-20 border-t border-slate-200 pt-16" id="similar-products-section">
          <div className="flex justify-between items-end mb-8 text-right">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">منتجات مشابهة قد تعجبك</h2>
              <p className="text-slate-500 text-xs mt-1">أجهزة لابتوب مختارة ومفحوصة فحصاً دقيقاً تتناسب مع هذا الطراز.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SIMILAR_LAPTOPS.map((simLaptop) => (
              <div
                key={simLaptop.id}
                onClick={() => onSelectSimilar(simLaptop)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer group p-4 space-y-3 hover:shadow-lg transition-all"
              >
                <div className="bg-slate-50 rounded-xl h-36 flex items-center justify-center p-4">
                  <img
                    src={simLaptop.image}
                    alt={simLaptop.name}
                    className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-102"
                  />
                </div>
                
                <div className="text-right space-y-1">
                  <span className="text-[10px] text-slate-400 block">{simLaptop.brand}</span>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-950 transition-colors line-clamp-1">
                    {simLaptop.name}
                  </h4>
                  <div className="flex items-baseline gap-1 pt-1 justify-end">
                    <span className="text-sm font-extrabold text-slate-900">
                      {simLaptop.price.toLocaleString('en-US')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-900">{simLaptop.currency || 'ر.س'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
