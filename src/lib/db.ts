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
  if (formData) {
    if (formData.has('existingImages')) {
      await LocalDatabase.updateProduct(product.id, product, formData);
    } else {
      await LocalDatabase.createProduct(product, formData);
    }
  } else {
    // Fallback if no formData (need to handle this)
    console.warn('saveProduct called without formData');
  }
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
  
  if (isUpdate) {
    await LocalDatabase.updateCategory(category.id, category, data);
  } else {
    await LocalDatabase.createCategory(category, data);
  }
}

export async function deleteCategory(storeId: string, categoryId: string): Promise<void> {
  await LocalDatabase.deleteCategory(categoryId);
}
// ...

// ==========================================
// ORDER FUNCTIONS
// ==========================================

export async function getOrderById(storeId: string, orderId: string): Promise<Order | null> {
  return null;
}

export async function getOrders(storeId: string): Promise<Order[]> {
  return [];
}

export async function saveOrder(order: Order): Promise<void> {
  console.log('Save order called (mock)');
}

// ==========================================
// NOTIFICATION FUNCTIONS
// ==========================================

export async function getNotifications(storeId: string): Promise<Notification[]> {
  return [];
}

export async function saveNotification(notification: Notification): Promise<void> {
  console.log('Save notification called (mock)');
}

// ==========================================
// ANALYTICS FUNCTIONS
// ==========================================

export async function getAnalytics(storeId: string): Promise<AnalyticsRecord | null> {
  return null;
}

export async function saveAnalytics(analytics: AnalyticsRecord): Promise<void> {
  console.log('Save analytics called (mock)');
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
  console.log('Delete user profile called (mock)');
}

export async function deleteStore(storeId: string): Promise<void> {
  console.log('Delete store called (mock)');
}
