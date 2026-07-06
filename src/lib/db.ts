import { Store, Product, Category, AppUser, Order, Notification, AnalyticsRecord } from '../types';
import { LocalDatabase } from './initialData';

// ==========================================
// STORE FUNCTIONS
// ==========================================

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Remove duplicate hyphens
}

export async function isSlugAvailable(slug: string, currentStoreId?: string): Promise<boolean> {
  const store = await LocalDatabase.getStoreBySlug(slug);
  if (!store) return true;
  return store.id === currentStoreId;
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  return await LocalDatabase.getStoreBySlug(slug);
}

export async function getStoreById(storeId: string): Promise<Store | null> {
  return await LocalDatabase.getStore(storeId);
}

export async function saveStore(store: Store): Promise<void> {
  await LocalDatabase.createStore(store);
}

// ==========================================
// PRODUCT FUNCTIONS
// ==========================================

export async function getProducts(storeId: string): Promise<Product[]> {
  return await LocalDatabase.getProducts(storeId);
}

export async function saveProduct(product: Product, formData?: FormData): Promise<void> {
  const data = formData || new FormData();
  if (!data.has('productData')) {
    data.append('productData', JSON.stringify(product));
  }
  if (!data.has('existingImages')) {
    data.append('existingImages', JSON.stringify(product.images || []));
  }
  
  // POST endpoint uses INSERT OR REPLACE so it safely handles both creates and updates
  await LocalDatabase.createProduct(product, data);
}

export async function deleteProduct(storeId: string, productId: string): Promise<void> {
  await LocalDatabase.deleteProduct(productId);
}

// ==========================================
// CATEGORY FUNCTIONS
// ==========================================

export async function getCategories(storeId: string): Promise<Category[]> {
  return await LocalDatabase.getCategories(storeId);
}

export async function saveCategory(category: Category, isUpdate: boolean = false, formData?: FormData): Promise<void> {
  const data = formData || new FormData();
  if (!data.has('categoryData')) {
    data.append('categoryData', JSON.stringify(category));
  }
  
  await LocalDatabase.createCategory(category, data);
}

export async function deleteCategory(storeId: string, categoryId: string): Promise<void> {
  await LocalDatabase.deleteCategory(categoryId);
}
// ...

// ==========================================
// ORDER FUNCTIONS
// ==========================================

export async function getOrderById(storeId: string, orderId: string): Promise<Order | null> {
  const res = await fetch(`/api/orders?storeId=${storeId}`);
  if (!res.ok) return null;
  const orders = await res.json();
  return orders.find((o: Order) => o.id === orderId) || null;
}

export async function getOrders(storeId: string): Promise<Order[]> {
  const res = await fetch(`/api/orders?storeId=${storeId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function saveOrder(order: Order): Promise<void> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error('Failed to save order');
}

// ==========================================
// NOTIFICATION FUNCTIONS
// ==========================================

export async function getNotifications(storeId: string): Promise<Notification[]> {
  const res = await fetch(`/api/notifications?storeId=${storeId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function saveNotification(notification: Notification): Promise<void> {
  const res = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification)
  });
  if (!res.ok) throw new Error('Failed to save notification');
}

// ==========================================
// ANALYTICS FUNCTIONS
// ==========================================

export async function getAnalytics(storeId: string): Promise<AnalyticsRecord | null> {
  const res = await fetch(`/api/analytics/${storeId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function saveAnalytics(analytics: AnalyticsRecord): Promise<void> {
  const res = await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(analytics)
  });
  if (!res.ok) throw new Error('Failed to save analytics');
}

// ==========================================
// USER FUNCTIONS
// ==========================================

export async function getUserProfile(userId: string): Promise<AppUser | null> {
  return await LocalDatabase.getUserProfile(userId);
}

export async function saveUserProfile(user: AppUser): Promise<void> {
  await LocalDatabase.saveUserProfile(user);
}

export async function getUserProfileByEmail(email: string): Promise<AppUser | null> {
  return await LocalDatabase.getUserProfileByEmail(email);
}

// ==========================================
// MASTER ADMIN FUNCTIONS
// ==========================================
export async function getAllUsers(): Promise<AppUser[]> {
  return await LocalDatabase.getAllUsers();
}

export async function getAllStores(): Promise<Store[]> {
  const res = await fetch('/api/stores');
  if (!res.ok) return [];
  return res.json();
}

export async function deleteUserProfile(userId: string): Promise<void> {
  console.warn('deleteUserProfile not implemented fully yet');
}

export async function deleteStore(storeId: string): Promise<void> {
  console.warn('deleteStore not implemented fully yet');
}
