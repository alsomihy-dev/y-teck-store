import React from 'react';
import { ShieldAlert, Check, Package, Truck, MessageSquare, CreditCard, CheckCircle2 } from 'lucide-react';
import { UserNotification } from '../types';

interface NotificationsViewProps {
  notifications: UserNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onBackToHome: () => void;
}

export default function NotificationsView({ notifications, onMarkAsRead, onMarkAllAsRead, onBackToHome }: NotificationsViewProps) {
  const getIcon = (type: string, title: string) => {
    if (type === 'payment' || title.includes('دفع') || title.includes('مبلغ')) return <CreditCard className="w-5 h-5 text-amber-500" />;
    if (type === 'shipping' || title.includes('شحن') || title.includes('طريق')) return <Truck className="w-5 h-5 text-blue-500" />;
    if (title.includes('رفض') || title.includes('تعذر')) return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    if (title.includes('تسليم') || title.includes('نجاح')) return <Check className="w-5 h-5 text-emerald-500" />;
    if (title.includes('تجهيز') || title.includes('طلبك')) return <Package className="w-5 h-5 text-indigo-500" />;
    return <MessageSquare className="w-5 h-5 text-slate-500" />;
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'الآن';
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">الإشعارات</h2>
          <p className="text-slate-500 mt-1 font-medium">متابعة تحديثات طلباتك</p>
        </div>
        {unreadCount > 0 && onMarkAllAsRead && (
          <button
            onClick={onMarkAllAsRead}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد إشعارات</h3>
            <p className="text-slate-500 mb-6">ليس لديك أي إشعارات جديدة في الوقت الحالي.</p>
            <button
              onClick={onBackToHome}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`bg-white border rounded-2xl p-5 flex items-start gap-4 transition-all ${
                !notification.read ? 'border-indigo-200 shadow-sm bg-indigo-50/30' : 'border-slate-100'
              }`}
              onClick={() => {
                if (!notification.read && onMarkAsRead) {
                  onMarkAsRead(notification.id);
                }
              }}
            >
              <div className={`p-3 rounded-xl shrink-0 ${
                !notification.read ? 'bg-indigo-100' : 'bg-slate-100'
              }`}>
                {getIcon(notification.type, notification.title)}
              </div>
              <div className="flex-1 text-right">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-bold ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap mr-4">
                    {getTimeAgo(notification.createdAt)}
                  </span>
                </div>
                <p className={`text-sm ${!notification.read ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                  {notification.message}
                </p>
                {notification.orderId && (
                  <span className="inline-block mt-3 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    طلب #{notification.orderId}
                  </span>
                )}
              </div>
              {!notification.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-2 shrink-0 animate-pulse"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
