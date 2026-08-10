import React from 'react';
import { Trash2, Plus, Minus, CreditCard, ShieldCheck, ShoppingCart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (paymentMethod: string) => void;
  onBackToHome: () => void;
}

export default function Cart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onBackToHome
}: CartProps) {
  const [promoCode, setPromoCode] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState(false);
  const [discountAmount, setDiscountAmount] = React.useState(0);

  // Subtotal calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.laptop.price * item.quantity), 0);
  const vat = Math.round(subtotal * 0.15);
  const finalTotal = subtotal + vat - discountAmount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'YTECK2026') {
      setAppliedPromo(true);
      setDiscountAmount(500); // 500 SAR flat discount
    } else {
      alert('كود الخصم غير صحيح أو منتهي الصلاحية.');
    }
  };

  const handlePlaceOrder = () => {
    onCheckout('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center space-y-6 max-w-md mx-auto" dir="rtl">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">سلة التسوق فارغة</h2>
        <p className="text-slate-500 text-sm">لم تقم بإضافة أي أجهزة لابتوب أو ملحقات إلى السلة بعد.</p>
        <button
          onClick={onBackToHome}
          className="bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all cursor-pointer inline-block"
        >
          ابدأ التسوق الآن
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#f7f9fb]" dir="rtl" id="cart-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8 text-right">عربة التسوق</h1>

        {/* Primary layout columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Right: Cart items list */}
          <div className="lg:col-span-8 space-y-4 order-2 lg:order-1">
            <div className="flex justify-between items-center text-sm text-slate-500 px-2 pb-2">
              <span>{cartItems.length} أجهزة مختارة</span>
              <span>تفاصيل الجهاز</span>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.laptop.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between"
              >
                {/* Image & Text details */}
                <div className="flex items-center gap-4 text-right w-full sm:w-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl p-2 flex items-center justify-center shrink-0 border border-slate-100">
                    <img
                      src={item.laptop.image}
                      alt={item.laptop.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">{item.laptop.brand}</span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">{item.laptop.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.laptop.ram} | {item.laptop.storage}</p>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-2 inline-block">مفحوص ومضمون</span>
                  </div>
                </div>

                {/* Actions & pricing block */}
                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                  
                  {/* Quantity adjustment buttons */}
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1.5 gap-3.5">
                    <button
                      onClick={() => onUpdateQuantity(item.laptop.id, 1)}
                      className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-800 rounded flex items-center justify-center shadow-sm cursor-pointer border border-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    
                    <span className="font-mono font-bold text-sm text-slate-800">{item.quantity}</span>
                    
                    <button
                      onClick={() => onUpdateQuantity(item.laptop.id, -1)}
                      className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-800 rounded flex items-center justify-center shadow-sm cursor-pointer border border-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price display info */}
                  <div className="text-left min-w-[90px]">
                    <span className="text-[10px] text-slate-400 block">الإجمالي</span>
                    <span className="text-base font-bold text-slate-900">
                      {(item.laptop.price * item.quantity).toLocaleString('en-US')} ر.س
                    </span>
                  </div>

                  {/* Remove bin button */}
                  <button
                    onClick={() => onRemoveItem(item.laptop.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف من السلة"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                </div>

              </div>
            ))}

            {/* Quality badge checklist */}
            <div className="bg-slate-100/60 rounded-2xl p-4 border border-slate-200/50 flex items-center gap-3.5 text-right mt-6">
              <ShieldCheck className="w-10 h-10 text-slate-900 shrink-0" />
              <div>
                <span className="block text-xs font-bold text-slate-900">ميزة الفحص الذهبي المزدوج</span>
                <span className="text-[10px] text-slate-500 leading-relaxed block">جميع الأجهزة في سلتك خضعت لفحص دقيق يشمل 40 نقطة تقنية شاملة وتأتي مع ضمان تشغيلي كامل لمدة 12 شهراً.</span>
              </div>
            </div>

          </div>

          {/* Left: Summary panel with discount and payment options */}
          <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">
            
            {/* Order Summary Form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-right space-y-5">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">ملخص الطلب</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold text-slate-800">{subtotal.toLocaleString('en-US')} ر.س</span>
                </div>
                
                <div className="flex justify-between text-slate-500">
                  <span>تكلفة الشحن</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">مجاني</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>ضريبة القيمة المضافة (15%)</span>
                  <span className="font-bold text-slate-800">{vat.toLocaleString('en-US')} ر.س</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 bg-emerald-50 p-2 rounded">
                    <span>خصم كود الترويج</span>
                    <span className="font-bold">- {discountAmount} ر.س</span>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>الإجمالي النهائي</span>
                  <span>{finalTotal.toLocaleString('en-US')} ر.س</span>
                </div>
              </div>

              {/* Promo code application form */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-[11px] font-bold text-slate-400 block">هل لديك كود خصم؟</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="أدخل الكود هنا (مثال: YTECK2026)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-slate-50 text-xs text-slate-800 rounded-xl py-3 px-3.5 border border-slate-200 focus:outline-none focus:border-slate-400 text-right"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 rounded-xl transition-all cursor-pointer border border-slate-200"
                  >
                    تطبيق
                  </button>
                </div>
                {appliedPromo && (
                  <span className="text-[10px] text-emerald-600 block mt-1">✓ تم تطبيق كود التخفيض بنجاح!</span>
                )}
              </div>



              {/* Major Checkout Action button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3.5 transition-transform hover:scale-[1.01] cursor-pointer shadow-lg mt-4"
              >
                <span>إتمام الشراء والطلب</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <span className="text-[9px] text-slate-400 text-center block mt-2">
                بالضغط على "إتمام الشراء والطلب" فإنك توافق على شروط الخدمة وضوابط الضمان.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
