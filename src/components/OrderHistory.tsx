import React from 'react';
import { Phone, Check, ShieldAlert, Clock, Truck, CreditCard, Package, CheckCircle2, MessageSquare } from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryProps {
  orders: Order[];
  onBackToHome: () => void;
}

function OrderCard({ mainOrder }: { mainOrder: Order; key?: React.Key }) {
  const [selectedAccount, setSelectedAccount] = React.useState<string>('');
  const [receiptImage, setReceiptImage] = React.useState<string>('');
  const [paymentNotes, setPaymentNotes] = React.useState<string>('');
  const [senderName, setSenderName] = React.useState<string>('');
  const [senderPhone, setSenderPhone] = React.useState<string>('');
  const [isSubmittingPayment, setIsSubmittingPayment] = React.useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm text-right mb-8">
      {/* Header */}
      <div className="bg-slate-950 p-6 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {mainOrder.status === 'rejected' ? (
            <ShieldAlert className="w-6 h-6 text-rose-500" />
          ) : (
            <Truck className="w-6 h-6 text-slate-300" />
          )}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              {mainOrder.status === 'rejected' ? 'طلب مرفوض' : 'تاريخ الطلب: ' + (() => {
                try {
                  const d = new Date(mainOrder.date);
                  if (isNaN(d.getTime())) return mainOrder.date;
                  return d.toLocaleDateString('ar-SA');
                } catch {
                  return mainOrder.date;
                }
              })()}
            </span>
            <h3 className="text-lg font-bold">طلب رقم #{mainOrder.id}</h3>
          </div>
        </div>
        <div className={`text-xs font-bold px-3 py-1.5 rounded-full border w-max ${mainOrder.status === 'rejected' ? 'bg-rose-950 border-rose-900 text-rose-400' :
            mainOrder.status === 'awaiting_payment' ? 'bg-amber-900 border-amber-800 text-amber-400' :
              mainOrder.status === 'pending_approval' ? 'bg-slate-800 border-slate-700 text-slate-300' :
                'bg-emerald-950 border-emerald-900 text-emerald-400'}`}>
          {mainOrder.status === 'rejected' ? 'تم الرفض' :
            mainOrder.status === 'awaiting_payment' ? 'بانتظار الدفع' :
              mainOrder.status === 'pending_approval' ? 'قيد المراجعة' :
                mainOrder.status === 'payment_review' ? 'جاري مراجعة الدفع' :
                  'جاري التوصيل'}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {mainOrder.status === 'rejected' ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">نعتذر، لم نتمكن من قبول طلبك</h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              سبب الرفض: <strong className="text-rose-600">{mainOrder.rejectionReason || 'لم يتم تقديم سبب محدد، نرجو التواصل مع الدعم الفني.'}</strong>
            </p>
          </div>
        ) : mainOrder.status === 'pending_approval' ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-4">
            <Clock className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="text-xl font-bold text-slate-900">طلبك قيد المراجعة</h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              نقوم حالياً بمراجعة طلبك والتأكد من توفر المنتجات في المخزون. سيتم إرسال إشعار لك فور الموافقة للانتقال لخطوة الدفع.
            </p>
          </div>
        ) : mainOrder.status === 'awaiting_payment' ? (
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="text-center space-y-2">
              <h4 className="text-xl font-extrabold text-indigo-900">مرحلة الدفع 💳</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                لقد تمت الموافقة على طلبك! يرجى تحويل المبلغ الإجمالي <strong className="text-indigo-600">{mainOrder.total} ر.س</strong> إلى أحد حساباتنا البنكية أدناه لتأكيد الطلب.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Kuraimi */}
              <button
                type="button"
                onClick={() => setSelectedAccount('kuraimi')}
                className={`text-right border rounded-xl p-4 transition-all relative ${selectedAccount === 'kuraimi' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'}`}
              >
                {selectedAccount === 'kuraimi' && <CheckCircle2 className="absolute left-3 top-4 w-5 h-5 text-indigo-600" />}
                <h5 className="font-bold text-slate-900 text-sm mb-2 border-b border-slate-200/50 pb-2 pl-6">الكريمي</h5>
                <p className="text-[10px] text-slate-600 mt-2">يمني: <strong className="font-mono text-slate-900 bg-white px-1 py-0.5 rounded border border-slate-200 select-all text-xs">3141980741</strong></p>
                <p className="text-[10px] text-slate-600 mt-1">سعودي: <strong className="font-mono text-slate-900 bg-white px-1 py-0.5 rounded border border-slate-200 select-all text-xs">3141957715</strong></p>
              </button>

              {/* Jeeb */}
              <button
                type="button"
                onClick={() => setSelectedAccount('jeeb')}
                className={`text-right border rounded-xl p-4 transition-all relative ${selectedAccount === 'jeeb' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'}`}
              >
                {selectedAccount === 'jeeb' && <CheckCircle2 className="absolute left-3 top-4 w-5 h-5 text-indigo-600" />}
                <h5 className="font-bold text-slate-900 text-sm mb-2 border-b border-slate-200/50 pb-2 pl-6">محفظة جيب</h5>
                <p className="text-[10px] text-slate-600 mt-2">الحساب: <strong className="font-mono text-slate-900 bg-white px-1 py-0.5 rounded border border-slate-200 select-all text-xs">776731078</strong></p>
              </button>

              {/* mFloos */}
              <button
                type="button"
                onClick={() => setSelectedAccount('mfloos')}
                className={`text-right border rounded-xl p-4 transition-all relative ${selectedAccount === 'mfloos' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'}`}
              >
                {selectedAccount === 'mfloos' && <CheckCircle2 className="absolute left-3 top-4 w-5 h-5 text-indigo-600" />}
                <h5 className="font-bold text-slate-900 text-sm mb-2 border-b border-slate-200/50 pb-2 pl-6">إم فلوس</h5>
                <p className="text-[10px] text-slate-600 mt-2">الحساب: <strong className="font-mono text-slate-900 bg-white px-1 py-0.5 rounded border border-slate-200 select-all text-xs">776731078</strong></p>
              </button>

              {/* OneCash */}
              <button
                type="button"
                onClick={() => setSelectedAccount('onecash')}
                className={`text-right border rounded-xl p-4 transition-all relative ${selectedAccount === 'onecash' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'}`}
              >
                {selectedAccount === 'onecash' && <CheckCircle2 className="absolute left-3 top-4 w-5 h-5 text-indigo-600" />}
                <h5 className="font-bold text-slate-900 text-sm mb-2 border-b border-slate-200/50 pb-2 pl-6">ون كاش</h5>
                <p className="text-[10px] text-slate-600 mt-2">الحساب: <strong className="font-mono text-slate-900 bg-white px-1 py-0.5 rounded border border-slate-200 select-all text-xs">776731078</strong></p>
              </button>
            </div>

            {/* Upload Form */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">

              {/* Sender Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">اسم المحول <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="الاسم الثلاثي للمحول"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">رقم الهاتف <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="رقم الهاتف الخاص بالمحول"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm bg-white text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  إرفاق سند التحويل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setReceiptImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {receiptImage && (
                  <div className="mt-2 relative inline-block">
                    {receiptImage.startsWith('data:image') ? (
                      <img src={receiptImage} alt="Receipt" className="h-20 rounded-lg border border-slate-200 shadow-sm" />
                    ) : (
                      <div className="h-20 px-4 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center text-xs font-bold text-slate-600">
                        تم إرفاق ملف PDF
                      </div>
                    )}
                    <button onClick={() => setReceiptImage('')} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">×</button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">ملاحظاتي (اختياري)</label>
                <textarea
                  rows={2}
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="اكتب أي ملاحظات إضافية حول عملية التحويل..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm bg-white"
                ></textarea>
              </div>
            </div>

            <button
              disabled={isSubmittingPayment}
              onClick={async () => {
                if (!selectedAccount) {
                  alert('الرجاء اختيار الحساب الذي قمت بالتحويل إليه (انقر على الكريمي أو المحافظ الإلكترونية أعلاه).');
                  return;
                }
                if (!senderName || !senderPhone) {
                  alert('الرجاء إدخال اسم المُحَوِّل ورقم هاتفه.');
                  return;
                }
                if (!receiptImage) {
                  alert('الرجاء إرفاق صورة سند التحويل.');
                  return;
                }
                setIsSubmittingPayment(true);
                const { dbService } = await import('../lib/db');
                const success = await dbService.submitPaymentDetails(mainOrder.id, selectedAccount, receiptImage, paymentNotes, senderName, senderPhone);
                if (success) {
                  alert('تم إرسال تأكيد الدفع للمراجعة بنجاح.');
                  window.location.reload();
                } else {
                  alert('حدث خطأ أثناء رفع البيانات. حاول مرة أخرى.');
                  setIsSubmittingPayment(false);
                }
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-colors text-sm cursor-pointer"
            >
              {isSubmittingPayment ? 'جاري الإرسال...' : 'إرسال بيانات التحويل'}
            </button>
          </div>
        ) : mainOrder.status === 'payment_review' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center space-y-4">
            <Clock className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
            <h4 className="text-xl font-bold text-amber-900">جاري مراجعة الدفع</h4>
            <p className="text-sm text-amber-700 max-w-md mx-auto">
              لقد استلمنا تأكيد الدفع الخاص بك. يقوم فريقنا المالي بمراجعة الحوالة الآن، وسنبدأ بتجهيز طلبك فور التأكيد.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-4 inset-x-8 bg-slate-100 h-1 z-0 hidden sm:block" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10 text-center">

              {/* Node 1: Confirmed */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-sm shadow">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold text-slate-900 block">تم التأكيد</span>
                <span className="text-[10px] text-slate-400 block">تم قبول الدفع الإلكتروني</span>
              </div>

              {/* Node 2: Preparing */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-sm shadow">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold text-slate-900 block">تجهيز</span>
                <span className="text-[10px] text-slate-400 block">فحص 40 نقطة وتعبئة الجهاز</span>
              </div>

              {/* Node 3: On Way */}
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm shadow ${mainOrder.status === 'on_way' || mainOrder.status === 'delivered' ? 'bg-slate-900' : 'bg-slate-100 text-slate-400'} ${mainOrder.status === 'on_way' ? 'animate-pulse ring-4 ring-slate-100' : ''}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-slate-900 block">في الطريق</span>
                <span className="text-[10px] text-slate-500 block">مع السائق لتوصيل فوري للمنزل</span>
              </div>

              {/* Node 4: Delivered */}
              <div className="flex flex-col items-center space-y-2 opacity-55">
                <div className={`w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center font-bold text-sm ${mainOrder.status === 'delivered' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-slate-600 block">تم التسليم</span>
                <span className="text-[10px] text-slate-400 block">تسليم موثق للعميل</span>
              </div>

            </div>
          </div>
        )}

        {/* Active Laptop Specs description list */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center shrink-0">
              <img
                src={mainOrder.items[0]?.laptop.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'}
                alt="Active Laptop"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">{mainOrder.items[0]?.laptop.name}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">الكمية: {mainOrder.items[0]?.quantity}</p>
            </div>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block">القيمة الإجمالية</span>
            <span className="text-base font-extrabold text-slate-900">{mainOrder.total.toLocaleString('en-US')} ر.س</span>
          </div>
        </div>

        {/* Delivery Status Card — shows when on_way */}
        {mainOrder.status === 'on_way' && mainOrder.trackingMap && (
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-right space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">مندوب التوصيل</p>
              <h4 className="font-extrabold text-lg">{mainOrder.trackingMap.driverName}</h4>
              <p className="text-sm text-slate-300">الوصول المتوقع: <strong className="text-white">{mainOrder.trackingMap.arrivalTime}</strong></p>
            </div>
            <a
              href={`tel:+967${mainOrder.trackingMap.driverPhone}`}
              className="bg-white text-slate-900 font-bold text-sm py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-slate-100 transition-colors shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>اتصل بالسائق</span>
            </a>
          </div>
        )}

      </div>

    </div>
  );
}

export default function OrderHistory({ orders, onBackToHome }: OrderHistoryProps) {
  const [activeTab, setActiveTab] = React.useState<'active' | 'completed'>('active');

  return (
    <div className="py-10 bg-[#f7f9fb] min-h-screen" dir="rtl" id="orders-history-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title row */}
        <div className="flex justify-between items-center mb-8 text-right">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">سجل الطلبات</h1>
            <p className="text-slate-500 text-xs mt-1">تتبع وإدارة جميع مشترياتك التقنية بكل سهولة.</p>
          </div>
          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white py-2 px-4 rounded-xl cursor-pointer shadow-sm transition-colors"
          >
            تصفح المتجر
          </button>
        </div>

        {(!orders || orders.length === 0) ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">لا توجد طلبات سابقة</h3>
            <p className="text-slate-500 mt-2 mb-6">قم بطلب أول جهاز لك الآن واستمتع بتجربة تسوق فريدة.</p>
            <button
              onClick={onBackToHome}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              تصفح الأجهزة
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} mainOrder={order} />
            ))}
          </div>
        )}

        {/* HELP AND ASSISTANCE CALLOUT CARD */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-right flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">هل تحتاج لمساعدة بخصوص طلباتك؟</h4>
            <p className="text-xs text-slate-400">فريق الدعم الفني متواجد لمساعدتك في حال وجود أي استفسار.</p>
          </div>
          <a
            href="https://wa.me/967776731078"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs py-3.5 px-6 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-slate-600" />
            <span>تحدث مع الدعم الفني</span>
          </a>
        </div>

      </div>
    </div>
  );
}
