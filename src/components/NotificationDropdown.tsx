import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, ShieldAlert, Truck, Info, Package, CreditCard } from 'lucide-react';
import { UserNotification } from '../types';

interface NotificationDropdownProps {
  notifications: UserNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (notif: UserNotification) => void;
}

export default function NotificationDropdown({ notifications, onMarkAsRead, onMarkAllAsRead, onNotificationClick }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getIcon = (type: string, title: string) => {
    if (type === 'payment' || title.includes('دفع') || title.includes('مبلغ')) return <CreditCard className="w-5 h-5 text-amber-500" />;
    if (type === 'shipping' || title.includes('شحن') || title.includes('طريق')) return <Truck className="w-5 h-5 text-blue-500" />;
    if (title.includes('رفض') || title.includes('تعذر')) return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    if (title.includes('تسليم') || title.includes('نجاح')) return <Check className="w-5 h-5 text-emerald-500" />;
    if (title.includes('تجهيز') || title.includes('طلبك')) return <Package className="w-5 h-5 text-indigo-500" />;
    return <Info className="w-5 h-5 text-slate-500" />;
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer relative"
        title="الإشعارات"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:-right-2 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900">الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAllAsRead();
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer bg-indigo-50 px-2 py-1 rounded-lg"
              >
                تحديد الكل كمقروء
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-3">
                <Bell className="w-10 h-10 text-slate-200" />
                <p className="text-sm font-medium">لا توجد إشعارات حالياً</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) onMarkAsRead(notif.id);
                      setIsOpen(false);
                      onNotificationClick(notif);
                    }}
                    className={`w-full text-right p-4 transition-colors hover:bg-slate-50 flex gap-4 items-start ${!notif.read ? 'bg-indigo-50/30' : ''}`}
                  >
                    <div className={`mt-1 p-2 rounded-full shrink-0 ${!notif.read ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
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
                      <p className={`text-xs line-clamp-2 leading-relaxed ${!notif.read ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
