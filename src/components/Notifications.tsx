import React from 'react';
import { Truck, ShieldAlert, Check, Package, MessageSquare, CreditCard, Clock } from 'lucide-react';
import { UserNotification } from '../types';

interface NotificationsProps {
  notifications: UserNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onBackToHome: () => void;
}

export default function Notifications({ notifications, onMarkAsRead, onMarkAllAsRead, onBackToHome }: NotificationsProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string, title: string) => {
    if (type === 'payment' || title.includes('دفع') || title.includes('مبلغ')) return <CreditCard className="w-5 h-5 text-amber-500" />;
    if (type === 'shipping' || title.includes('شحن') || title.includes('طريق')) return <Truck className="w-5 h-5 text-blue-500" />;
    if (title.includes('رفض') || title.includes('تعذر')) return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    if (title.includes('تسليم') || title.includes('نجاح')) return <Check className="w-5 h-5 text-emerald-500" />;
    if (title.includes('تجهيز') || title.includes('طلبك')) return <Package className="w-5 h-5 text-indigo-500" />;
    return <MessageSquare className="w-5 h-5 text-slate-500" />;
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays === 1) return 'أمس';
    if (diffDays === 2) return 'أول أمس';
    return `منذ ${diffDays} أيام`;
  };

  return (
    <div className="py-10 bg-[#f7f9fb] min-h-screen" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-right">الإشعارات</h1>
           <button onClick={onBackToHome} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg transition-colors cursor-pointer">العودة للرئيسية</button>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">لا توجد إشعارات</h3>
            <p className="text-slate-500 mt-2">لا توجد لديك إشعارات جديدة في الوقت الحالي.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm mb-10">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">كل الإشعارات</h3>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
                >
                  تحديد الكل كمقروء
                </button>
              )}
            </div>
            
            <div className="divide-y divide-slate-50">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read && onMarkAsRead) onMarkAsRead(notif.id);
                  }}
                  className={`w-full text-right p-4 transition-colors hover:bg-slate-50 flex gap-4 items-start ${!notif.read ? 'bg-indigo-50/30' : ''}`}
                >
                  <div className={`mt-1 p-2 rounded-full shrink-0 ${!notif.read ? 'bg-white shadow-sm ring-1 ring-slate-100' : 'bg-slate-100'}`}>
                    {getIcon(notif.type, notif.title)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <p className={`text-sm font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${!notif.read ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-slate-400">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(notif.createdAt)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
