import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
  onConfirm: (address: string) => void;
}

export default function CheckoutModal({ onClose, onConfirm }: CheckoutModalProps) {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      alert("يرجى إدخال العنوان النصي");
      return;
    }
    onConfirm(address);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">إتمام الطلب - بيانات التوصيل</h3>
            <p className="text-xs text-slate-500 mt-1">يرجى إدخال عنوانك لتوصيل الطلب (التوصيل في صنعاء فقط)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Address Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                العنوان التفصيلي <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: شارع الستين، حي حدة، بجوار سوبر ماركت..."
                  className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>



          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button
            type="submit"
            form="checkout-form"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            تأكيد الطلب
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            إلغاء
          </button>
        </div>

      </div>
    </div>
  );
}
