import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  Plus, 
  Search, 
  MoreVertical, 
  TrendingUp,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  BarChart3,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  UserX,
  X,
  Image as ImageIcon,
  Save,
  Truck,
  Box,
  FileText,
  Printer
} from 'lucide-react';
import { Laptop, Order, User } from '../types';
import { dbService } from '../lib/db';

interface AdminDashboardProps {
  adminEmail: string;
  adminPermissions: string[];
  laptops: Laptop[];
  setLaptops: React.Dispatch<React.SetStateAction<Laptop[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onBackToHome: () => void;
  newOrdersCount?: number;
  onClearNewOrders?: () => void;
}

export default function AdminDashboard({ 
  adminEmail,
  adminPermissions,
  laptops, 
  setLaptops,
  orders, 
  setOrders,
  users,
  setUsers,
  onBackToHome,
  newOrdersCount = 0,
  onClearNewOrders
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'products' | 'categories' | 'orders' | 'inventory' | 'customers' | 'admins' | 'reports' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Modals state
  const [showProductModal, setShowProductModal] = React.useState(false);
  const [editingLaptop, setEditingLaptop] = React.useState<Laptop | null>(null);
  const [productImages, setProductImages] = React.useState<string[]>([]);

  const [showOrderModal, setShowOrderModal] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  // Roles modal
  const [showRoleModal, setShowRoleModal] = React.useState(false);
  const [selectedRoleUser, setSelectedRoleUser] = React.useState<User | null>(null);
  const [tempRole, setTempRole] = React.useState<'admin' | 'user'>('user');
  const [tempPermissions, setTempPermissions] = React.useState<string[]>([]);
  const [showAddAdminForm, setShowAddAdminForm] = React.useState(false);

  // Permissions helper
  const hasPermission = (perm: string) => {
    return adminPermissions.length === 0 || adminPermissions.includes(perm) || adminPermissions.includes('super_admin');
  };

  // Categories
  const [categories, setCategories] = React.useState<{id: string, name: string}[]>([]);
  React.useEffect(() => {
    dbService.getCategories().then(setCategories);
  }, []);

  // New Category modal state & handlers
  const [showAddCategoryModal, setShowAddCategoryModal] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [newCategoryId, setNewCategoryId] = React.useState('');

  const handleUpdateStock = async (laptopId: string, newQty: number) => {
    const target = laptops.find(l => l.id === laptopId);
    if (!target) return;
    const qty = Math.max(0, newQty);
    const updatedLaptop: Laptop = {
      ...target,
      quantity: qty,
      status: qty === 0 ? 'out_of_stock' : target.status
    };
    setLaptops(prev => prev.map(l => l.id === laptopId ? updatedLaptop : l));
    await dbService.updateLaptop(updatedLaptop);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const id = newCategoryId.trim() || newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');
    const updated = [...categories, { id, name: newCategoryName }];
    setCategories(updated);
    await dbService.saveCategories(updated);
    setShowAddCategoryModal(false);
    setNewCategoryName('');
    setNewCategoryId('');
    alert('🎉 تم إضافة التصنيف بنجاح!');
  };

  const handleDeleteCategory = async (catId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      const updated = categories.filter(c => c.id !== catId);
      setCategories(updated);
      await dbService.saveCategories(updated);
    }
  };

  const filteredLaptops = laptops.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.trackingMap?.driverName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'إجمالي المنتجات', value: laptops.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'إجمالي الطلبات', value: orders.length, icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'العملاء المسجلين', value: users.length, icon: Users, color: 'bg-amber-50 text-amber-600' },
    { label: 'إجمالي المبيعات', value: orders.reduce((acc, o) => acc + o.total, 0) + ' ر.س', icon: TrendingUp, color: 'bg-rose-50 text-rose-600' },
  ];

  const handleSaveProduct = async (e: React.FormEvent, productData: Partial<Laptop>) => {
    e.preventDefault();
    if (!productData.name || productData.price === undefined || isNaN(productData.price)) {
      alert('الرجاء التأكد من إدخال اسم المنتج والسعر بشكل صحيح.');
      return;
    }
    
    const laptop: Laptop = {
      ...(editingLaptop || { id: `YT-${Date.now()}`, image: '', category: 'students' as any }),
      ...productData
    } as Laptop;

    let success = false;
    if (editingLaptop) {
      success = await dbService.updateLaptop(laptop);
      if (success) {
        setLaptops(prev => prev.map(l => l.id === laptop.id ? laptop : l));
        alert('✓ تم تعديل المنتج بنجاح.');
      }
    } else {
      success = await dbService.addLaptop(laptop);
      if (success) {
        setLaptops(prev => [laptop, ...prev]);
        alert('✓ تم إضافة المنتج بنجاح.');
      }
    }
    if (success) {
      setShowProductModal(false);
      setEditingLaptop(null);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const success = await dbService.deleteLaptop(id);
      if (success) {
        setLaptops(prev => prev.filter(l => l.id !== id));
        alert('✓ تم حذف المنتج بنجاح.');
      } else {
        alert('❌ فشل في حذف المنتج.');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const success = await dbService.updateOrderStatus(orderId, status);
    if (success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  const handleUpdateOrderTracking = async (orderId: string, trackingData: any) => {
    const success = await dbService.updateOrderTracking(orderId, trackingData);
    if (success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingMap: trackingData } : o));
      alert('✓ تم تحديث بيانات التتبع بنجاح.');
    }
  };

  const navItems = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard, perm: 'manage_orders' },
    { id: 'products', label: 'إدارة المنتجات', icon: Package, perm: 'manage_products' },
    { id: 'categories', label: 'إدارة التصنيفات', icon: Box, perm: 'manage_products' },
    { id: 'orders', label: 'الطلبات', icon: ShoppingCart, perm: 'manage_orders' },
    { id: 'customers', label: 'إدارة العملاء', icon: Users, perm: 'manage_users' },
    { id: 'admins', label: 'إدارة المدراء', icon: ShieldCheck, perm: 'manage_users' }, // Changed from super_admin to manage_users to keep it simple, or 'manage_admins' if you prefer
    { id: 'inventory', label: 'إدارة المخزون', icon: Truck, perm: 'manage_products' },
    { id: 'reports', label: 'التقارير والإحصائيات', icon: FileText, perm: 'manage_orders' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, perm: 'manage_settings' },
  ].filter(item => hasPermission(item.perm)) as any[];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-right" dir="rtl">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-l border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900">لوحة التحكم</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'orders' && onClearNewOrders) onClearNewOrders();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-bold">{item.label}</span>
              {item.id === 'orders' && newOrdersCount > 0 && (
                <span className="mr-auto bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {newOrdersCount}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button 
              onClick={onBackToHome}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 mt-2"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-sm font-bold">العودة للمتجر</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">AD</div>
            <div className="overflow-hidden">
              <p className="text-xs font-extrabold text-slate-900 truncate">المسؤول</p>
              <p className="text-[10px] text-slate-500 truncate">{adminEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto h-screen">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {activeTab === 'overview' && 'مرحباً بك مجدداً، إليك ملخص لأعمالك اليوم.'}
              {activeTab === 'products' && 'أضف وعدل واحذف المنتجات من متجرك.'}
              {activeTab === 'orders' && 'تتبع الطلبات وحدث حالاتها للعملاء.'}
            </p>
          </div>
          
          {activeTab === 'products' && (
            <button 
              onClick={() => { setEditingLaptop(null); setProductImages([]); setShowProductModal(true); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة منتج جديد</span>
            </button>
          )}
        </header>

        {/* Dashboard Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold">{stat.label}</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">أحدث الطلبات</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">طلب {o.id}</p>
                        <p className="text-xs text-slate-500 mt-1">{o.date}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-indigo-600 text-sm">{o.total} ر.س</p>
                        <p className="text-xs text-slate-500 mt-1">{o.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">المنتجات منخفضة المخزون</h3>
                <div className="space-y-4">
                  {laptops.filter(l => (l.quantity ?? 10) < 5).slice(0, 5).map(l => (
                    <div key={l.id} className="flex items-center justify-between p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img src={l.image} alt="" className="w-10 h-10 object-contain mix-blend-multiply" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{l.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{l.brand}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full">
                          متبقي: {l.quantity ?? 10}
                        </span>
                      </div>
                    </div>
                  ))}
                  {laptops.filter(l => (l.quantity ?? 10) < 5).length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">المخزون بوضع جيد.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:max-w-xs">
                <input 
                  type="text" 
                  placeholder="ابحث عن جهاز..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:border-slate-300"
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold">
                    <th className="px-6 py-4">المنتج</th>
                    <th className="px-6 py-4">العلامة التجارية</th>
                    <th className="px-6 py-4">السعر</th>
                    <th className="px-6 py-4">الكمية</th>
                    <th className="px-6 py-4 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredLaptops.map(laptop => (
                    <tr key={laptop.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={laptop.image} alt="" className="w-10 h-10 object-contain" />
                          <div>
                            <p className="text-sm font-bold text-slate-900">{laptop.name}</p>
                            <p className="text-[10px] text-slate-400">ID: {laptop.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="text-xs font-bold text-slate-700">{laptop.brand}</span></td>
                      <td className="px-6 py-4"><span className="text-sm font-bold text-indigo-600">{laptop.price} ر.س</span></td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${(laptop.quantity ?? 10) > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {laptop.quantity ?? 10} حبة
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-start gap-2">
                          <button 
                            onClick={() => { 
                              setEditingLaptop(laptop); 
                              setProductImages(laptop.images || (laptop.image ? [laptop.image] : [])); 
                              setShowProductModal(true); 
                            }} 
                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(laptop.id)} 
                            className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:max-w-xs">
                <input 
                  type="text" 
                  placeholder="ابحث برقم الطلب أو السائق..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:border-slate-300"
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold">
                    <th className="px-6 py-4">رقم الطلب</th>
                    <th className="px-6 py-4">التاريخ</th>
                    <th className="px-6 py-4">الإجمالي</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{order.id}</p>
                      </td>
                      <td className="px-6 py-4"><span className="text-xs text-slate-600">{order.date}</span></td>
                      <td className="px-6 py-4"><span className="text-sm font-bold text-indigo-600">{order.total} ر.س</span></td>
                      <td className="px-6 py-4">
                        {order.status === 'pending_approval' ? (
                           <div className="flex gap-2">
                             <button
                               onClick={() => handleUpdateOrderStatus(order.id, 'awaiting_payment')}
                               className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                             >
                               موافقة مبدئية
                             </button>
                             <button
                               onClick={() => {
                                 const reason = window.prompt('سبب الرفض (سيظهر للعميل):');
                                 if (reason) dbService.updateOrderStatus(order.id, 'rejected', reason).then(() => {
                                    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'rejected', rejectionReason: reason } : o));
                                 });
                               }}
                               className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                             >
                               رفض
                             </button>
                           </div>
                        ) : order.status === 'payment_review' ? (
                           <div className="flex gap-2">
                             <button
                               onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                               className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                             >
                               تأكيد الدفع
                             </button>
                             <button
                               onClick={() => {
                                 const reason = window.prompt('سبب الرفض (سيظهر للعميل):');
                                 if (reason) dbService.updateOrderStatus(order.id, 'rejected', reason).then(() => {
                                    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'rejected', rejectionReason: reason } : o));
                                 });
                               }}
                               className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                             >
                               رفض
                             </button>
                           </div>
                        ) : order.status === 'preparing' || order.status === 'confirmed' ? (
                           <button
                             onClick={() => handleUpdateOrderStatus(order.id, 'on_way')}
                             className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                           >
                             شحن الطلب
                           </button>
                        ) : (
                           <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                              order.status === 'on_way' ? 'bg-blue-50 text-blue-600' :
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'awaiting_payment' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                              'bg-rose-100 text-rose-700'
                           }`}>
                              {order.status === 'on_way' ? 'في الطريق' : 
                               order.status === 'delivered' ? 'تم التسليم' : 
                               order.status === 'awaiting_payment' ? 'بانتظار دفع العميل' : 'مرفوض'}
                           </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-start gap-2">
                          <button 
                            onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                            title="تفاصيل الطلب والفاتورة"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 📦 INVENTORY MANAGEMENT TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">إدارة المخزون والكميات</h3>
                  <p className="text-sm text-slate-500 mt-1">متابعة دقيقة لكميات الأجهزة المتاحة، تنبيهات المخزون المنخفض، والتحكم السريع في توفر الأجهزة.</p>
                </div>
              </div>
            </div>

            {/* Inventory KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500">إجمالي قطع المخزون</p>
                <h4 className="text-2xl font-extrabold text-slate-900 mt-2">
                  {laptops.reduce((sum, l) => sum + (l.quantity ?? 10), 0)} قطعة
                </h4>
                <p className="text-xs text-slate-400 mt-1">موزعة على {laptops.length} منتج</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm">
                <p className="text-xs font-bold text-amber-700">مخزون منخفض (≤ 3)</p>
                <h4 className="text-2xl font-extrabold text-amber-600 mt-2">
                  {laptops.filter(l => (l.quantity ?? 10) > 0 && (l.quantity ?? 10) <= 3).length} منتجات
                </h4>
                <p className="text-xs text-amber-600/80 mt-1">تتطلب إعادة الطلب قريباً</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-sm">
                <p className="text-xs font-bold text-rose-700">نفذت من المخزون</p>
                <h4 className="text-2xl font-extrabold text-rose-600 mt-2">
                  {laptops.filter(l => (l.quantity ?? 10) === 0 || l.status === 'out_of_stock').length} منتجات
                </h4>
                <p className="text-xs text-rose-600/80 mt-1">غير متاحة للشراء حالياً</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
                <p className="text-xs font-bold text-emerald-700">قيمة البضاعة التقديرية</p>
                <h4 className="text-2xl font-extrabold text-emerald-600 mt-2">
                  {laptops.reduce((sum, l) => sum + (l.price * (l.quantity ?? 10)), 0).toLocaleString()} ر.س
                </h4>
                <p className="text-xs text-emerald-600/80 mt-1">إجمالي رأس المال بالمنتجات</p>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold">
                      <th className="px-6 py-4">المنتج</th>
                      <th className="px-6 py-4">الماركة</th>
                      <th className="px-6 py-4">السعر الفردي</th>
                      <th className="px-6 py-4">الكمية الحالية</th>
                      <th className="px-6 py-4">مستوى المخزون</th>
                      <th className="px-6 py-4">الحالة</th>
                      <th className="px-6 py-4 text-left">تعديل سريع للكمية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {laptops.map(laptop => {
                      const qty = laptop.quantity ?? 10;
                      const isLow = qty > 0 && qty <= 3;
                      const isOut = qty === 0 || laptop.status === 'out_of_stock';
                      return (
                        <tr key={laptop.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img src={laptop.image} alt={laptop.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                            <div>
                              <p className="text-sm font-bold text-slate-900 line-clamp-1">{laptop.name}</p>
                              <p className="text-xs text-slate-400">{laptop.cpu}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4"><span className="text-xs font-bold text-slate-700">{laptop.brand}</span></td>
                          <td className="px-6 py-4"><span className="text-sm font-bold text-indigo-600">{laptop.price.toLocaleString()} ر.س</span></td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-extrabold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900'}`}>
                              {qty} قطع
                            </span>
                          </td>
                          <td className="px-6 py-4 w-40">
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all ${isOut ? 'bg-rose-500 w-0' : isLow ? 'bg-amber-500 w-1/3' : 'bg-emerald-500 w-full'}`}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                const newStatus = laptop.status === 'out_of_stock' ? 'available' : 'out_of_stock';
                                const updated = { ...laptop, status: newStatus as any };
                                setLaptops(prev => prev.map(l => l.id === laptop.id ? updated : l));
                                dbService.updateLaptop(updated);
                              }}
                              className={`text-[11px] font-bold px-3 py-1 rounded-full cursor-pointer transition-colors ${
                                isOut ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              }`}
                            >
                              {isOut ? 'نفد المخزون' : 'متوفر'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-start gap-1">
                              <button
                                onClick={() => handleUpdateStock(laptop.id, qty - 1)}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                                title="إنقاص قطعة"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={qty}
                                onChange={(e) => handleUpdateStock(laptop.id, Number(e.target.value))}
                                className="w-14 text-center font-bold text-sm bg-slate-50 border border-slate-200 rounded-lg py-1 outline-none focus:border-indigo-500"
                              />
                              <button
                                onClick={() => handleUpdateStock(laptop.id, qty + 1)}
                                className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                                title="زيادة قطعة"
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 🏷️ CATEGORIES MANAGEMENT TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">إدارة تصنيفات المنتجات</h3>
                <p className="text-sm text-slate-500 mt-1">إضافة، تعديل وتمرير الأقسام الرئيسية لمتجر Y TECK لتنظيم الأجهزة المتوفرة.</p>
              </div>
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" /> إضافة تصنيف جديد
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map(cat => {
                const count = laptops.filter(l => l.category === cat.id).length;
                return (
                  <div key={cat.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        <Box className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">{cat.name}</h4>
                      <p className="text-xs text-slate-400">معرّف القسم: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">{cat.id}</code></p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{count} منتجات</span>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 📊 REPORTS & ANALYTICS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">التقارير الماليّة والإحصائيات الشاملة</h3>
                <p className="text-sm text-slate-500 mt-1">تحليل حركة المبيعات، توزيع حالات الطلبات، والأجهزة الأكثر طلباً.</p>
              </div>
              <button
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> طباعة التقرير
              </button>
            </div>

            {/* Financial KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 rounded-3xl shadow-xl shadow-indigo-600/20">
                <p className="text-xs font-bold opacity-80">إجمالي المبيعات المؤكدة</p>
                <h4 className="text-3xl font-extrabold mt-2">
                  {orders
                    .filter(o => ['confirmed', 'preparing', 'on_way', 'delivered'].includes(o.status))
                    .reduce((sum, o) => sum + o.total, 0)
                    .toLocaleString()} ر.س
                </h4>
                <p className="text-xs opacity-70 mt-2">من الطلبات المدفوعة والمكتملة</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500">الطلبات المسلمة بنجاح</p>
                <h4 className="text-3xl font-extrabold text-slate-900 mt-2">
                  {orders.filter(o => o.status === 'delivered').length} طلبات
                </h4>
                <p className="text-xs text-slate-400 mt-2">نسبة إنجاز عالية</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500">متوسط قيمة الطلب</p>
                <h4 className="text-3xl font-extrabold text-slate-900 mt-2">
                  {orders.length > 0
                    ? Math.round(orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toLocaleString()
                    : 0} ر.س
                </h4>
                <p className="text-xs text-slate-400 mt-2">لكل عملية شراء</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500">معدل رفض الطلبات</p>
                <h4 className="text-3xl font-extrabold text-slate-900 mt-2">
                  {orders.length > 0
                    ? Math.round((orders.filter(o => o.status === 'rejected').length / orders.length) * 100)
                    : 0}%
                </h4>
                <p className="text-xs text-slate-400 mt-2">
                  {orders.filter(o => o.status === 'rejected').length} طلبات مرفوضة
                </p>
              </div>
            </div>

            {/* Orders Status Distribution */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              <h4 className="text-base font-bold text-slate-900">توزيع الطلبات حسب الحالة</h4>
              <div className="space-y-4">
                {[
                  { key: 'pending_approval', label: 'قيد المراجعة والموافقة', color: 'bg-amber-500' },
                  { key: 'awaiting_payment', label: 'بانتظار دفع العميل', color: 'bg-indigo-500' },
                  { key: 'payment_review', label: 'جاري مراجعة الدفع والوصل', color: 'bg-purple-500' },
                  { key: 'preparing', label: 'جاري التجهيز للشحن', color: 'bg-blue-500' },
                  { key: 'on_way', label: 'في الطريق مع السائق', color: 'bg-cyan-500' },
                  { key: 'delivered', label: 'تم التسليم بنجاح', color: 'bg-emerald-500' },
                  { key: 'rejected', label: 'طلبات مرفوضة', color: 'bg-rose-500' },
                ].map(statusItem => {
                  const count = orders.filter(o => o.status === statusItem.key).length;
                  const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                  return (
                    <div key={statusItem.key} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{statusItem.label}</span>
                        <span>{count} طلبات ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full ${statusItem.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ⚙️ STORE SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">إعدادات متجر Y TECK</h3>
                <p className="text-sm text-slate-500 mt-1">تعديل بيانات التواصل ورسائل التوصيل والعملة الإفتراضية للمتجر.</p>
              </div>
              <button 
                onClick={async () => {
                  if(window.confirm('هل أنت متأكد من رغبتك بنقل جميع البيانات المحلية إلى قاعدة بيانات Firebase السحابية؟')) {
                    try {
                      // Fetch local data
                      const localLaptops = localStorage.getItem('yt_local_laptops');
                      const localOrders = localStorage.getItem('yt_local_orders');
                      
                      if(localLaptops) {
                        for (const l of JSON.parse(localLaptops)) {
                          await dbService.addLaptop(l);
                        }
                      }
                      if(localOrders) {
                        for (const o of JSON.parse(localOrders)) {
                          await dbService.saveOrder(o);
                        }
                      }
                      
                      alert('🎉 تم ترحيل البيانات بنجاح إلى Firebase!');
                    } catch(err) {
                      console.error(err);
                      alert('حدث خطأ أثناء الترحيل.');
                    }
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-600/20 whitespace-nowrap"
              >
                🚀 نقل البيانات لـ Firebase
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('🎉 تم حفظ إعدادات المتجر بنجاح!'); }} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">اسم المتجر الرسمي</label>
                <input defaultValue="Y TECK Laptop Store" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">العملة الافتراضية</label>
                  <input defaultValue="SAR (ريال سعودي)" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">رقم واتساب الدعم الفني</label>
                  <input defaultValue="+967776731078" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ملاحظة التوصيل والشحن</label>
                <input defaultValue="التوصيل مجاني ومباشر داخل مدينة صنعاء" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" />
              </div>

              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-8 py-3 rounded-xl transition-colors cursor-pointer shadow-lg shadow-indigo-600/20">
                حفظ التغييرات
              </button>
            </form>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">إدارة العملاء</h3>
                  <p className="text-sm text-slate-500 mt-1">تصفح حسابات العملاء المسجلين في المنصة، مع إمكانية إيقاف وحظر الحسابات المخالفة.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold">
                    <th className="px-6 py-4">العميل</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4">تاريخ التسجيل</th>
                    <th className="px-6 py-4 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.filter(u => u.role === 'user').map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${user.isBlocked ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {user.isBlocked ? 'محظور / موقوف' : 'نشط'}
                        </span>
                      </td>
                      <td className="px-6 py-4"><span className="text-xs text-slate-600">{new Date(user.createdAt).toLocaleDateString('ar-SA')}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-start gap-2">
                          <button 
                            onClick={async () => {
                              const newStatus = !user.isBlocked;
                              if (window.confirm(`هل أنت متأكد من ${newStatus ? 'حظر' : 'تفعيل'} هذا العميل؟`)) {
                                const success = await dbService.updateUserStatus(user.id, newStatus);
                                if (success) {
                                  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBlocked: newStatus } : u));
                                }
                              }
                            }}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${user.isBlocked ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                            title={user.isBlocked ? 'تفعيل الحساب' : 'حظر الحساب'}
                          >
                            {user.isBlocked ? 'تفعيل' : 'إيقاف الحساب'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.filter(u => u.role === 'user').length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">لا يوجد عملاء مسجلين حالياً.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">إدارة المدراء والصلاحيات</h3>
                  <p className="text-sm text-slate-500 mt-1">إضافة وحذف مدراء النظام وتخصيص صلاحياتهم للوصول للوحة التحكم.</p>
                </div>
                <button 
                  onClick={() => setShowAddAdminForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> إضافة مدير جديد
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold">
                    <th className="px-6 py-4">المدير</th>
                    <th className="px-6 py-4">الصلاحيات</th>
                    <th className="px-6 py-4">تاريخ الإضافة</th>
                    <th className="px-6 py-4 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.filter(u => u.role === 'admin').map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {user.permissions?.includes('super_admin') ? (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">الكل (Super Admin)</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {user.permissions?.map(p => (
                              <span key={p} className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                {p === 'manage_orders' ? 'الطلبات' : p === 'manage_products' ? 'المنتجات' : p === 'manage_users' ? 'المستخدمين' : p === 'manage_settings' ? 'الإعدادات' : p}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4"><span className="text-xs text-slate-600">{new Date(user.createdAt).toLocaleDateString('ar-SA')}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-start gap-2">
                          <button 
                            onClick={() => {
                              setSelectedRoleUser(user);
                              setTempRole(user.role);
                              setTempPermissions(user.permissions || []);
                              setShowRoleModal(true);
                            }}
                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                            title="تعديل الصلاحيات"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]" dir="rtl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-extrabold text-slate-900">{editingLaptop ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
              <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            
            <form id="productForm" onSubmit={(e) => {
              e.preventDefault();
              try {
                const formData = new FormData(e.currentTarget);
                const data: Partial<Laptop> = {
                  name: formData.get('name') as string,
                  brand: formData.get('brand') as any,
                  price: Number(formData.get('price')),
                  originalPrice: Number(formData.get('originalPrice')),
                  quantity: Number(formData.get('quantity')),
                status: formData.get('status') as any,
                cpu: formData.get('cpu') as string,
                gpu: formData.get('gpu') as string,
                ram: formData.get('ram') as string,
                storage: formData.get('storage') as string,
                screen: formData.get('screen') as string,
                os: formData.get('os') as string,
                category: formData.get('category') as any,
                description: formData.get('description') as string,
                  image: productImages.length > 0 ? productImages[0] : (editingLaptop?.image || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600'),
                  images: productImages.length > 0 ? productImages : (editingLaptop?.images || []),
                  conditionOuter: Number(formData.get('conditionOuter')) || 10,
                  conditionScreen: Number(formData.get('conditionScreen')) || 10
                };
                handleSaveProduct(e, data);
              } catch (err) {
                console.error("Form error:", err);
                alert("حدث خطأ أثناء معالجة البيانات.");
              }
            }} className="p-6 overflow-y-auto space-y-8 flex-1">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">اسم المنتج</label>
                  <input required name="name" defaultValue={editingLaptop?.name} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">الشركة المصنعة</label>
                  <select required name="brand" defaultValue={editingLaptop?.brand || 'Apple'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none">
                    {['Apple', 'Dell', 'HP', 'Lenovo', 'Microsoft', 'Surface', 'ASUS'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">السعر (ر.س)</label>
                  <input required type="number" name="price" defaultValue={editingLaptop?.price} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">السعر الأصلي (قبل الخصم)</label>
                  <input type="number" name="originalPrice" defaultValue={editingLaptop?.originalPrice} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">الكمية المتوفرة</label>
                  <input required type="number" name="quantity" defaultValue={editingLaptop?.quantity ?? 10} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">التصنيف</label>
                  <select required name="category" defaultValue={editingLaptop?.category || 'business'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl space-y-6 border border-slate-100">
                <h3 className="font-bold text-slate-900">المواصفات التقنية</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">المعالج (CPU)</label><input name="cpu" defaultValue={editingLaptop?.cpu} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">الرام (RAM)</label><input name="ram" defaultValue={editingLaptop?.ram} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">التخزين (Storage)</label><input name="storage" defaultValue={editingLaptop?.storage} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">كرت الشاشة (GPU)</label><input name="gpu" defaultValue={editingLaptop?.gpu} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">حجم الشاشة</label><input name="screen" defaultValue={editingLaptop?.screen} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">نظام التشغيل (OS)</label><input name="os" defaultValue={editingLaptop?.os} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" /></div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl space-y-6 border border-slate-100">
                <h3 className="font-bold text-slate-900">تقرير الحالة الفنية (من 10)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">حالة الهيكل الخارجي</label>
                    <input type="number" name="conditionOuter" min="1" max="10" defaultValue={editingLaptop?.conditionOuter ?? 10} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">حالة وأداء الشاشة</label>
                    <input type="number" name="conditionScreen" min="1" max="10" defaultValue={editingLaptop?.conditionScreen ?? 10} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6 border-t border-slate-100 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">وصف كامل للمنتج</label>
                  <textarea name="description" rows={4} defaultValue={editingLaptop?.description} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none resize-none"></textarea>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">صور المنتج (اختر صورة أو أكثر)</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      Promise.all(files.map((file: File) => {
                        return new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve(reader.result as string);
                          reader.readAsDataURL(file);
                        });
                      })).then(base64Images => {
                        setProductImages(prev => [...prev, ...base64Images]);
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                  />
                  <p className="text-xs text-slate-500">الصورة الأولى ستكون الصورة الرئيسية للمنتج.</p>
                  
                  {/* Preview selected images */}
                  {(productImages.length > 0 || editingLaptop?.images || editingLaptop?.image) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(productImages.length > 0 ? productImages : (editingLaptop?.images || (editingLaptop?.image ? [editingLaptop.image] : []))).map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img} className="w-16 h-16 object-cover rounded-lg border border-slate-200" alt="Preview" />
                          <button 
                            type="button"
                            onClick={() => {
                              if (productImages.length > 0) {
                                setProductImages(prev => prev.filter((_, i) => i !== idx));
                              } else {
                                // If editing an existing laptop without new uploads yet, copy current images to state then remove
                                const currentImages = editingLaptop?.images || (editingLaptop?.image ? [editingLaptop.image] : []);
                                setProductImages(currentImages.filter((_, i) => i !== idx));
                              }
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 shrink-0 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl mt-auto">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">إلغاء</button>
                <button type="submit" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-colors flex items-center gap-2 cursor-pointer">
                  <Save className="w-4 h-4" /> حفظ المنتج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowOrderModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]" dir="rtl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-extrabold text-slate-900">تفاصيل الطلب {selectedOrder.id}</h2>
              <button onClick={() => setShowOrderModal(false)} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Customer & Order Meta Info */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">بيانات العميل</p>
                  {selectedOrder.userId ? (
                    (() => {
                      const customer = users.find(u => u.id === selectedOrder.userId);
                      return customer ? (
                        <div>
                          <p className="font-bold text-slate-900">{customer.fullName}</p>
                          <p className="text-sm text-slate-600">{customer.email}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600">عميل غير معروف</p>
                      );
                    })()
                  ) : (
                    <p className="text-sm text-slate-600">زائر</p>
                  )}
                </div>
                <div className="sm:text-left">
                  <p className="text-xs text-slate-500 font-bold mb-1">تاريخ الطلب</p>
                  <p className="text-sm font-bold text-slate-900" dir="ltr">{new Date(selectedOrder.date).toLocaleString('ar-SA')}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-900">المنتجات المطلوبة</h3>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex gap-3 items-center">
                      <img src={item.laptop.image} className="w-10 h-10 object-contain" alt=""/>
                      <span className="font-bold">{item.laptop.name} (x{item.quantity})</span>
                    </div>
                    <span className="font-bold text-indigo-600">{item.laptop.price * item.quantity} ر.س</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-center">
                  <span className="font-bold">الإجمالي (شامل الضريبة)</span>
                  <span className="text-xl font-extrabold text-indigo-700">{selectedOrder.total} ر.س</span>
                </div>
              </div>

              {/* Payment Details Block — shown when customer submitted receipt */}
              {(selectedOrder.receiptImage || selectedOrder.selectedPaymentAccount || selectedOrder.paymentNotes || selectedOrder.deliveryAddress || selectedOrder.senderName) && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-amber-900 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> بيانات الدفع المرسلة من العميل
                  </h3>
                  {selectedOrder.selectedPaymentAccount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700 font-bold">طريقة التحويل:</span>
                      <span className="font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg">
                        {selectedOrder.selectedPaymentAccount === 'kuraimi' ? 'بنك الكريمي الإسلامي' : 
                         selectedOrder.selectedPaymentAccount === 'jeeb' ? 'محفظة جيب' : 
                         selectedOrder.selectedPaymentAccount === 'mfloos' ? 'محفظة إم فلوس' : 
                         selectedOrder.selectedPaymentAccount === 'onecash' ? 'ون كاش' : 
                         selectedOrder.selectedPaymentAccount}
                      </span>
                    </div>
                  )}
                  {selectedOrder.senderName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700 font-bold">اسم المُحَوِّل:</span>
                      <span className="font-bold text-amber-900">{selectedOrder.senderName}</span>
                    </div>
                  )}
                  {selectedOrder.senderPhone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700 font-bold">رقم هاتف المُحَوِّل:</span>
                      <span className="font-bold text-amber-900 font-mono" dir="ltr">{selectedOrder.senderPhone}</span>
                    </div>
                  )}
                  {selectedOrder.deliveryAddress && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700 font-bold">عنوان التوصيل:</span>
                      <span className="font-bold text-amber-900">{selectedOrder.deliveryAddress}</span>
                    </div>
                  )}
                  {selectedOrder.paymentNotes && (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-amber-700">ملاحظات العميل:</p>
                      <p className="text-sm text-amber-900 bg-amber-100 rounded-lg px-3 py-2">{selectedOrder.paymentNotes}</p>
                    </div>
                  )}
                  {selectedOrder.receiptImage && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-amber-700">سند التحويل المرفق:</p>
                      {selectedOrder.receiptImage.startsWith('data:image') ? (
                        <img
                          src={selectedOrder.receiptImage}
                          alt="سند التحويل"
                          className="max-w-full max-h-64 rounded-xl border border-amber-200 shadow-sm object-contain"
                        />
                      ) : (
                        <div className="bg-amber-100 rounded-lg p-4 text-center text-sm font-bold text-amber-800">
                          📄 ملف PDF مرفق
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                handleUpdateOrderTracking(selectedOrder.id, {
                  driverName: fd.get('driverName'),
                  driverPhone: fd.get('driverPhone'),
                  arrivalTime: fd.get('arrivalTime')
                });
                setShowOrderModal(false);
              }} className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-4">
                <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                  <Truck className="w-5 h-5" /> تحديث بيانات التوصيل
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-bold text-indigo-800">اسم المندوب</label><input name="driverName" defaultValue={selectedOrder.trackingMap?.driverName} className="w-full bg-white border border-indigo-100 rounded-lg px-3 py-2 text-sm outline-none" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-bold text-indigo-800">رقم الهاتف</label><input name="driverPhone" defaultValue={selectedOrder.trackingMap?.driverPhone} className="w-full bg-white border border-indigo-100 rounded-lg px-3 py-2 text-sm outline-none text-left" dir="ltr" /></div>
                  <div className="space-y-1.5 col-span-2"><label className="text-xs font-bold text-indigo-800">وقت الوصول المتوقع</label><input name="arrivalTime" defaultValue={selectedOrder.trackingMap?.arrivalTime} className="w-full bg-white border border-indigo-100 rounded-lg px-3 py-2 text-sm outline-none" placeholder="مثال: اليوم ٤:٣٠ عصراً" /></div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-colors cursor-pointer">تحديث بيانات السائق</button>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 shrink-0 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl">
              <button className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-2"><Printer className="w-4 h-4"/> طباعة الفاتورة</button>
            </div>
          </div>
        </div>
      )}
      {/* Add Admin Modal */}
      {showAddAdminForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddAdminForm(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 flex flex-col" dir="rtl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-extrabold text-slate-900">إضافة مدير جديد</h2>
              <button onClick={() => setShowAddAdminForm(false)} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const fullName = fd.get('fullName') as string;
              const email = fd.get('email') as string;
              const password = fd.get('password') as string;
              const perms = fd.getAll('permissions') as string[];
              
              if (!fullName || !email || !password) return alert('الرجاء تعبئة جميع الحقول');
              
              const { localAuth } = await import('../lib/localAuth');
              const result = localAuth.createAdmin(email, password, fullName, perms);
              
              if (result.error) {
                alert(result.error);
              } else if (result.user) {
                setUsers(prev => [...prev, result.user!]);
                setShowAddAdminForm(false);
                alert('تمت إضافة المدير بنجاح.');
              }
            }} className="flex flex-col">
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">الاسم الكامل</label>
                  <input required name="fullName" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                  <input required type="email" name="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none text-right" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
                  <input required type="password" name="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-sm font-bold text-slate-700 block">الصلاحيات</label>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {[
                      { id: 'manage_products', label: 'إدارة المنتجات والتصنيفات' },
                      { id: 'manage_orders', label: 'إدارة الطلبات والتقارير' },
                      { id: 'manage_users', label: 'إدارة العملاء والمدراء' },
                      { id: 'manage_settings', label: 'تعديل الإعدادات' },
                      { id: 'super_admin', label: 'مدير عام (صلاحيات كاملة)' },
                    ].map(perm => (
                      <label key={perm.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            name="permissions"
                            value={perm.id}
                            className="peer w-5 h-5 cursor-pointer accent-indigo-600 rounded"
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors select-none">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 shrink-0 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl">
                <button type="button" onClick={() => setShowAddAdminForm(false)} className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">إلغاء</button>
                <button type="submit" className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-colors cursor-pointer">
                  إنشاء المدير
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role & Permissions Modal */}
      {showRoleModal && selectedRoleUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowRoleModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 flex flex-col" dir="rtl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">ترقية وتعديل الصلاحيات</h2>
                <p className="text-xs text-slate-500 mt-1">{selectedRoleUser.fullName}</p>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">نوع الحساب</label>
                <select 
                  value={tempRole} 
                  onChange={(e) => setTempRole(e.target.value as 'admin' | 'user')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                >
                  <option value="user">عميل (مستخدم عادي)</option>
                  <option value="admin">مدير (مسؤول في النظام)</option>
                </select>
              </div>

              {tempRole === 'admin' && (
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 block">الصلاحيات المخصصة للمدير</label>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {[
                      { id: 'manage_products', label: 'إدارة المنتجات والتصنيفات' },
                      { id: 'manage_orders', label: 'إدارة الطلبات والتقارير' },
                      { id: 'manage_users', label: 'إدارة العملاء' },
                      { id: 'manage_settings', label: 'تعديل الإعدادات' },
                      { id: 'super_admin', label: 'مدير عام (صلاحيات كاملة)' },
                    ].map(perm => (
                      <label key={perm.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="peer sr-only"
                            checked={tempPermissions.includes(perm.id) || tempPermissions.includes('super_admin')}
                            disabled={perm.id !== 'super_admin' && tempPermissions.includes('super_admin')}
                            onChange={(e) => {
                              if (perm.id === 'super_admin') {
                                setTempPermissions(e.target.checked ? ['super_admin'] : []);
                              } else {
                                setTempPermissions(prev => 
                                  e.target.checked ? [...prev, perm.id] : prev.filter(p => p !== perm.id)
                                );
                              }
                            }}
                          />
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${tempPermissions.includes(perm.id) || tempPermissions.includes('super_admin') ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400 bg-white'}`}>
                            {(tempPermissions.includes(perm.id) || tempPermissions.includes('super_admin')) && <ShieldCheck className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">ملاحظة: المدير بصلاحيات جزئية لن تظهر له الأقسام التي لا يملك صلاحية دخولها.</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setShowRoleModal(false)} className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">إلغاء</button>
              <button 
                onClick={async () => {
                  const success = await dbService.updateUserRoleAndPermissions(selectedRoleUser.id, tempRole, tempRole === 'admin' ? tempPermissions : []);
                  if (success) {
                    setUsers(prev => prev.map(u => u.id === selectedRoleUser.id ? { ...u, role: tempRole, permissions: tempRole === 'admin' ? tempPermissions : [] } : u));
                    setShowRoleModal(false);
                    alert('✓ تم حفظ الصلاحيات والدور بنجاح.');
                  }
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddCategoryModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-6" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">إضافة تصنيف جديد</h3>
              <button onClick={() => setShowAddCategoryModal(false)} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">اسم التصنيف</label>
                <input
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="مثال: أجهزة التصميم والمونتاج"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">معرّف القسم (ID / Slug)</label>
                <input
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  placeholder="مثال: design (اختياري)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-colors cursor-pointer">
                  حفظ التصنيف
                </button>
                <button type="button" onClick={() => setShowAddCategoryModal(false)} className="px-5 py-3 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
