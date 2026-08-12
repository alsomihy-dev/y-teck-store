import { db, auth, isFirebaseConfigured } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { Laptop, Order, User } from '../types';
import { INITIAL_LAPTOPS, ACCESSORIES } from '../data';
import { localAuth } from './localAuth';

const withTimeout = <T>(promise: Promise<T>, ms = 8000): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('TIMEOUT')), ms);
    promise.then(res => {
      clearTimeout(timer);
      resolve(res);
    }).catch(err => {
      clearTimeout(timer);
      reject(err);
    });
  });
};

const mapDbLaptopToFrontend = (row: any): Laptop => ({
  ...row,
  originalPrice: Number(row.original_price || row.originalPrice),
  price: Number(row.price),
  conditionOuter: row.condition_outer || row.conditionOuter,
  conditionScreen: row.condition_screen || row.conditionScreen,
  conditionScore: row.condition_score || row.conditionScore,
  statusBadge: row.status_badge || row.statusBadge,
  sellerNote: row.seller_note_author ? {
    author: row.seller_note_author,
    role: row.seller_note_role || '',
    avatar: row.seller_note_avatar || '',
    text: row.seller_note_text || ''
  } : row.sellerNote,
});

const mapFrontendLaptopToDb = (laptop: Laptop) => {
  const data: any = {
    ...laptop,
    original_price: laptop.originalPrice || null,
    condition_outer: laptop.conditionOuter || 10,
    condition_screen: laptop.conditionScreen || 10,
    condition_score: laptop.conditionScore || null,
    status_badge: laptop.statusBadge || null,
    images: laptop.images || (laptop.image ? [laptop.image] : []),
    seller_note_author: laptop.sellerNote?.author || null,
    seller_note_role: laptop.sellerNote?.role || null,
    seller_note_avatar: laptop.sellerNote?.avatar || null,
    seller_note_text: laptop.sellerNote?.text || null,
  };
  return JSON.parse(JSON.stringify(data));
};

export const dbService = {
  async getLaptops(): Promise<Laptop[]> {
    if (!isFirebaseConfigured() || !db) {
      console.warn('⚠️ Firebase is not configured. Falling back to local storage and static data.');
      const local = localStorage.getItem('yt_local_laptops');
      if (local) return JSON.parse(local);
      const initial = [...INITIAL_LAPTOPS, ...ACCESSORIES];
      localStorage.setItem('yt_local_laptops', JSON.stringify(initial));
      return initial;
    }
    try {
      const q = query(collection(db, 'laptops'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => mapDbLaptopToFrontend({ id: doc.id, ...doc.data() }));
      } else {
        const initial = [...INITIAL_LAPTOPS, ...ACCESSORIES];
        await this.saveInitialLaptops(initial);
        return initial;
      }
    } catch (err) {
      console.error('Failed to fetch laptops from Firebase, falling back to local:', err);
      const local = localStorage.getItem('yt_local_laptops');
      return local ? JSON.parse(local) : [...INITIAL_LAPTOPS, ...ACCESSORIES];
    }
  },

  async addLaptop(laptop: Laptop): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) {
      const laptops = await this.getLaptops();
      const updated = [laptop, ...laptops];
      localStorage.setItem('yt_local_laptops', JSON.stringify(updated));
      return true;
    }
    try {
      await setDoc(doc(db, 'laptops', laptop.id), mapFrontendLaptopToDb(laptop));
      return true;
    } catch (err) {
      console.error('Failed to add laptop to Firebase:', err);
      const laptops = await this.getLaptops();
      const updated = [laptop, ...laptops];
      localStorage.setItem('yt_local_laptops', JSON.stringify(updated));
      return true;
    }
  },

  async deleteLaptop(id: string): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) {
      const laptops = await this.getLaptops();
      const updated = laptops.filter(l => l.id !== id);
      localStorage.setItem('yt_local_laptops', JSON.stringify(updated));
      return true;
    }
    try {
      await deleteDoc(doc(db, 'laptops', id));
      return true;
    } catch (err) {
      console.error('Failed to delete laptop from Firebase:', err);
      return false;
    }
  },

  async saveInitialLaptops(laptops: Laptop[]) {
    if (!isFirebaseConfigured() || !db) return;
    try {
      await Promise.all(laptops.map(laptop => 
        setDoc(doc(db, 'laptops', laptop.id), mapFrontendLaptopToDb(laptop))
      ));
    } catch (err) {
      console.error('Error seeding initial laptops:', err);
    }
  },

  async getOrders(): Promise<Order[]> {
    if (!isFirebaseConfigured() || !db) {
      const local = localStorage.getItem('yt_local_orders');
      return local ? JSON.parse(local) : [];
    }
    try {
      const q = query(collection(db, 'orders'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    } catch (err) {
      console.error('Failed to fetch orders from Firebase:', err);
      const local = localStorage.getItem('yt_local_orders');
      return local ? JSON.parse(local) : [];
    }
  },

  async saveOrder(order: Order): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) {
      const orders = await this.getOrders();
      const updated = [order, ...orders];
      localStorage.setItem('yt_local_orders', JSON.stringify(updated));
      return true;
    }
    try {
      const cleanOrder = JSON.parse(JSON.stringify(order));
      await withTimeout(setDoc(doc(db, 'orders', order.id), cleanOrder), 8000);
      return true;
    } catch (err) {
      console.error('Failed to save order to Firebase:', err);
      const orders = await this.getOrders();
      const updated = [order, ...orders];
      localStorage.setItem('yt_local_orders', JSON.stringify(updated));
      return true;
    }
  },

  async getUsers(): Promise<User[]> {
    const localUsers = localAuth.getUsers();
    if (!isFirebaseConfigured() || !db) return localUsers;
    try {
      const snapshot = await getDocs(collection(db, 'profiles'));
      const dbUsers: User[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      const dbEmails = new Set(dbUsers.map(u => u.email.toLowerCase()));
      const combined = [...dbUsers];
      for (const lu of localUsers) {
        if (!dbEmails.has(lu.email.toLowerCase())) combined.push(lu);
      }
      return combined;
    } catch (err) {
      console.error('Failed to fetch profiles from Firebase:', err);
      return localUsers;
    }
  },

  async updateUserRole(id: string, newRole: 'admin' | 'user'): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) {
      const users = await this.getUsers();
      const updated = users.map(u => u.id === id ? { ...u, role: newRole } : u);
      localStorage.setItem('yt_local_profiles', JSON.stringify(updated));
      return true;
    }
    try {
      await withTimeout(updateDoc(doc(db, 'profiles', id), { role: newRole }), 8000);
      return true;
    } catch (err) {
      console.error('Failed to update user role:', err);
      return false;
    }
  },

  async updateUserRoleAndPermissions(id: string, newRole: 'admin' | 'user', permissions: string[]): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) {
      const users = await this.getUsers();
      const updated = users.map(u => u.id === id ? { ...u, role: newRole, permissions } : u);
      localStorage.setItem('yt_local_profiles', JSON.stringify(updated));
      return true;
    }
    try {
      await withTimeout(updateDoc(doc(db, 'profiles', id), { role: newRole, permissions }), 8000);
      return true;
    } catch (err) {
      console.error('Failed to update user role and permissions:', err);
      return false;
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) {
      const users = await this.getUsers();
      const updated = users.filter(u => u.id !== id);
      localStorage.setItem('yt_local_profiles', JSON.stringify(updated));
      return true;
    }
    try {
      await withTimeout(deleteDoc(doc(db, 'profiles', id)), 8000);
      return true;
    } catch (err) {
      console.error('Failed to delete profile:', err);
      return false;
    }
  },

  async updateLaptop(laptop: Laptop): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) {
      const laptops = await this.getLaptops();
      const updated = laptops.map(l => l.id === laptop.id ? laptop : l);
      localStorage.setItem('yt_local_laptops', JSON.stringify(updated));
      return true;
    }
    try {
      await withTimeout(updateDoc(doc(db, 'laptops', laptop.id), mapFrontendLaptopToDb(laptop)), 8000);
      return true;
    } catch (err) {
      console.error('Failed to update laptop in Firebase:', err);
      const laptops = await this.getLaptops();
      const updated = laptops.map(l => l.id === laptop.id ? laptop : l);
      localStorage.setItem('yt_local_laptops', JSON.stringify(updated));
      return true;
    }
  },

  async updateOrderStatus(orderId: string, status: string, rejectionReason?: string): Promise<boolean> {
    const orders = await this.getOrders();
    const targetOrder = orders.find(o => o.id === orderId);
    let success = false;
    if (!isFirebaseConfigured() || !db) {
      const updated = orders.map(o => o.id === orderId ? { ...o, status: status as any, rejectionReason: rejectionReason ?? o.rejectionReason } : o);
      localStorage.setItem('yt_local_orders', JSON.stringify(updated));
      success = true;
    } else {
      try {
        const payload: any = { status };
        if (rejectionReason !== undefined) payload.rejectionReason = rejectionReason;
        await withTimeout(updateDoc(doc(db, 'orders', orderId), payload), 8000);
        success = true;
      } catch (err) {
        console.error('Failed to update order status:', err);
      }
    }
    return success;
  },

  async submitPaymentDetails(orderId: string, account: string, receipt: string, notes: string, senderName: string, senderPhone: string): Promise<boolean> {
    const orders = await this.getOrders();
    if (!isFirebaseConfigured() || !db) {
      const updated = orders.map(o => o.id === orderId ? { ...o, status: 'payment_review' as const, selectedPaymentAccount: account, receiptImage: receipt, paymentNotes: notes, senderName, senderPhone } : o);
      localStorage.setItem('yt_local_orders', JSON.stringify(updated));
      return true;
    }
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'payment_review', selectedPaymentAccount: account, receiptImage: receipt, paymentNotes: notes, senderName, senderPhone });
      return true;
    } catch (err) {
      return false;
    }
  },

  async updateOrderTracking(orderId: string, trackingData: { driverName: string, driverPhone: string, arrivalTime: string }): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) {
      const orders = await this.getOrders();
      const updated = orders.map(o => o.id === orderId ? { ...o, trackingMap: trackingData } : o);
      localStorage.setItem('yt_local_orders', JSON.stringify(updated));
      return true;
    }
    try {
      await updateDoc(doc(db, 'orders', orderId), { trackingMap: trackingData });
      return true;
    } catch (err) {
      return false;
    }
  },

  async deleteOrder(orderId: string): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) {
      const orders = await this.getOrders();
      const updated = orders.filter(o => o.id !== orderId);
      localStorage.setItem('yt_local_orders', JSON.stringify(updated));
      return true;
    }
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      return true;
    } catch (err) {
      return false;
    }
  },

  async updateUserStatus(id: string, isBlocked: boolean): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) {
      const users = await this.getUsers();
      const updated = users.map(u => u.id === id ? { ...u, isBlocked } : u);
      localStorage.setItem('yt_local_profiles', JSON.stringify(updated));
      return true;
    }
    try {
      await updateDoc(doc(db, 'profiles', id), { isBlocked });
      return true;
    } catch (err) {
      return false;
    }
  },

  async getCategories(): Promise<{id: string, name: string}[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        if (!snapshot.empty) return snapshot.docs.map(d => d.data() as any);
      } catch (err) {}
    }
    const local = localStorage.getItem('yt_local_categories');
    if (local) return JSON.parse(local);
    const defaultCats = [
      { id: 'students', name: 'أجهزة الطلاب' },
      { id: 'business', name: 'أجهزة الأعمال' },
      { id: 'gaming', name: 'أجهزة الألعاب' },
      { id: 'ultrabook', name: 'أجهزة الترا بوك' }
    ];
    localStorage.setItem('yt_local_categories', JSON.stringify(defaultCats));
    return defaultCats;
  },

  async saveCategories(categories: {id: string, name: string}[]): Promise<boolean> {
    localStorage.setItem('yt_local_categories', JSON.stringify(categories));
    if (isFirebaseConfigured() && db) {
      try {
        for (const cat of categories) {
          await setDoc(doc(db, 'categories', cat.id), cat);
        }
      } catch (err) {}
    }
    return true;
  },

  async logActivity(action: string, adminEmail: string, details?: string): Promise<boolean> {
    const log = { id: `log-${Date.now()}`, action, adminEmail, details, createdAt: new Date().toISOString() };
    const logs = await this.getActivityLogs();
    localStorage.setItem('yt_activity_logs', JSON.stringify([log, ...logs]));
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'activity_logs', log.id), log);
      } catch (err) {}
    }
    return true;
  },

  async getActivityLogs(): Promise<any[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snapshot = await getDocs(collection(db, 'activity_logs'));
        if (!snapshot.empty) return snapshot.docs.map(d => d.data());
      } catch (err) {}
    }
    const local = localStorage.getItem('yt_activity_logs');
    return local ? JSON.parse(local) : [];
  },

  async getNotifications(userId: string): Promise<any[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const q = query(collection(db, 'notifications'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) return snapshot.docs.map(d => d.data()).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (err) {}
    }
    const local = localStorage.getItem('yt_local_notifications');
    const all = local ? JSON.parse(local) : [];
    return all.filter((n: any) => n.userId === userId).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addNotification(notification: { userId: string; title: string; message: string; type: string; orderId?: string; }): Promise<any> {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };
    const local = localStorage.getItem('yt_local_notifications');
    const all = local ? JSON.parse(local) : [];
    localStorage.setItem('yt_local_notifications', JSON.stringify([...all, newNotif]));
    if (isFirebaseConfigured() && db) {
      try { await withTimeout(setDoc(doc(db, 'notifications', newNotif.id), newNotif), 8000); } catch (err) {}
    }
    return newNotif;
  },

  async markNotificationAsRead(id: string): Promise<boolean> {
    const local = localStorage.getItem('yt_local_notifications');
    if (local) {
      const all = JSON.parse(local);
      const updated = all.map((n: any) => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('yt_local_notifications', JSON.stringify(updated));
    }
    if (isFirebaseConfigured() && db) {
      try { await withTimeout(updateDoc(doc(db, 'notifications', id), { read: true }), 8000); } catch (err) {}
    }
    return true;
  },

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    const local = localStorage.getItem('yt_local_notifications');
    if (local) {
      const all = JSON.parse(local);
      const updated = all.map((n: any) => n.userId === userId ? { ...n, read: true } : n);
      localStorage.setItem('yt_local_notifications', JSON.stringify(updated));
    }
    if (isFirebaseConfigured() && db) {
      try { 
        const q = query(collection(db, 'notifications'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        for(const docSnap of snapshot.docs) {
          await withTimeout(updateDoc(docSnap.ref, { read: true }), 8000);
        }
      } catch (err) {}
    }
    return true;
  },

  // Mock Supabase to avoid breaking App.tsx and AdminApp.tsx
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: (cb: any) => { cb('SIGNED_OUT', null); return { data: { subscription: { unsubscribe: () => {} } } }; },
      signOut: async () => {},
      signInWithPassword: async (opts: any) => ({ data: null, error: new Error('Firebase Auth not mapped yet. Using local auth fallback.') }),
      signInWithOAuth: async (opts: any) => {},
      signUp: async (opts: any) => ({ data: null, error: new Error('Firebase Auth not mapped yet. Using local auth fallback.') })
    },
    from: (table: string) => ({
      select: (str?: any) => ({ eq: (col?: any, val?: any) => ({ single: async () => ({ data: null }) }) }),
      update: (obj?: any) => ({ eq: async (col?: any, val?: any) => ({ data: null }) }),
      insert: async (obj?: any) => ({ data: null })
    }),
    channel: (name?: string) => {
      const ch: any = {
        on: (event?: any, filter?: any, callback?: any) => ch,
        subscribe: () => {}
      };
      return ch;
    },
    removeChannel: (channel?: any) => {}
  },
  auth,
  localAuth,
};
