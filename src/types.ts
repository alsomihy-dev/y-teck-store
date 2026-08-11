export interface Laptop {
  id: string;
  name: string;
  brand: 'Apple' | 'Dell' | 'HP' | 'Lenovo' | 'Microsoft' | 'Surface' | 'ASUS';
  originalPrice: number;
  price: number;
  ram: string;
  storage: string;
  cpu: string;
  gpu?: string;
  screen?: string;
  battery?: string;
  conditionOuter: number; // e.g. 10 for 10/10
  conditionScreen: number; // e.g. 10 for 10/10
  conditionScore?: string; // e.g. 'ممتاز' or 'حالة ممتازة'
  statusBadge?: string; // e.g. 'أكثر مبيعاً' or 'ممتاز' or 'عرض محدود' or 'جديد'
  image: string;
  images?: string[];
  sellerNote?: {
    author: string;
    role: string;
    avatar: string;
    text: string;
  };
  featured?: boolean;
  category: 'students' | 'business' | 'gaming' | 'ultrabook';
  currency?: 'SAR' | 'YER' | 'USD';
  os?: string;
  quantity?: number;
  status?: 'available' | 'out_of_stock';
  discount?: number;
  description?: string;
}

export interface CartItem {
  laptop: Laptop;
  quantity: number;
  selectedColor?: string;
}

export interface Order {
  id: string;
  userId?: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending_approval' | 'awaiting_payment' | 'payment_review' | 'confirmed' | 'preparing' | 'on_way' | 'delivered' | 'rejected';
  rejectionReason?: string;
  paymentMethod: string;
  selectedPaymentAccount?: string;
  receiptImage?: string;
  paymentNotes?: string;
  senderName?: string;
  senderPhone?: string;
  deliveryAddress?: string;
  deliveryLocation?: { lat: number; lng: number };
  trackingMap?: {
    driverName: string;
    arrivalTime: string;
    driverPhone: string;
    coordinates?: { lat: number; lng: number };
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  isBlocked?: boolean;
  permissions?: string[];
  phone?: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order_status' | 'payment' | 'shipping' | 'system';
  orderId?: string;
  read: boolean;
  createdAt: string;
}

export type ViewTab = 'home' | 'details' | 'cart' | 'orders' | 'profile' | 'login' | 'signup' | 'notifications';
