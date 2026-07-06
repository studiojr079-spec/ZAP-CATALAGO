/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Store {
  id: string;
  slug: string; // e.g. jessicahair
  name: string;
  ownerId?: string; // AppUser ID of the store owner
  slogan?: string;
  description: string;
  logo: string;
  banner: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  borderColor?: string;

  // Typography & Layout (Deprecated in new design but kept for compatibility)
  fontFamily: string;
  titleSize?: string;
  textSize?: string;
  buttonSize?: string;
  
  // Catalog Appearance (New Architecture)
  catalogTemplate?: string; // 'clean' | 'dark' etc
  cornerStyle?: 'square' | 'rounded' | 'pill';
  whatsappMessage?: string; // Standard message for WhatsApp click

  // Buttons
  buttonText: string;
  buttonIcon?: string;
  buttonBorder?: string;

  showPrice: boolean;
  showStock: boolean;
  messageTemplate: string;
  banners: StoreBanner[];
  switchTimeMs?: number;

  // Layout Visibility
  layout: {
    showBanner: boolean;
    showSearch: boolean;
    showCategories: boolean;
    showBestSellers: boolean;
    showPromotions: boolean;
    showShipping: boolean;
    showAboutStore: boolean;
    sectionOrder: string[]; // e.g. ['banner', 'categories', 'products', 'shipping']
  };

  // About Store
  about: {
    history: string;
    mission: string;
    description: string;
    photos: string[];
    video: string;
    hours: string;
    address: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
    tiktok: string;
  };
}

export interface StoreBanner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  displayLocation?: string;
  order: number;
  active: boolean;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  promoPrice?: number;
  length?: string; // e.g., 80cm
  color?: string; // e.g., Castanho
  stock: number;
  featured: boolean; // Destaque
  hidden: boolean; // Ativar/Inativar
  order?: number; // Reordenar
  images: string[];
  video?: string;
  views: number;
  clicks: number;
  showPrice: boolean;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  image: string;
  order: number;
  hidden?: boolean;
}

export interface Order {
  id: string;
  storeId: string;
  productId: string;
  productName: string;
  productPrice: number;
  date: string;
  time: string;
  source: string; // e.g. Direct, Google, Instagram
  status: 'Pendente' | 'Atendido' | 'Cancelado';
  notes?: string;
}

export interface AnalyticsRecord {
  storeId: string;
  views: number;
  clicks: number;
  uniqueVisitors: number;
  devices: { mobile: number; tablet: number; desktop: number };
  origins: { direct: number; whatsapp: number; instagram: number; tiktok: number; google: number };
  locations: { city: string; state: string; count: number }[];
  dailyMetrics: { date: string; views: number; clicks: number; orders: number }[];
}

export interface Notification {
  id: string;
  storeId: string;
  type: 'click' | 'order' | 'subscription' | 'system';
  title: string;
  description: string;
  date: string;
  read: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billing: 'mensal' | 'anual';
  limits: {
    products: number;
    categories: number;
    banners: number;
    storageMb: number;
  };
  features: string[];
}

export interface UserSubscription {
  userId: string;
  planId: string;
  status: 'active' | 'expired' | 'canceled' | 'trial';
  expiresAt: string;
  paymentGateway?: 'kiwify' | 'mercadopago' | 'stripe';
  autoRenew?: boolean;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'master';
  storeId?: string;
  planId?: string;
  status?: 'active' | 'expired' | 'canceled' | 'trial';
  expiresAt?: string;
  autoRenew?: boolean;
  password?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  active: boolean;
  usedCount: number;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'image' | 'link';
  url: string;
  createdAt: number;
  location?: 'general' | 'video_cover' | 'thumbnail' | 'pdf_manual';
  thumbnailUrl?: string;
}

export interface SystemConfig {
  templatePreviews?: {
    clean?: string;
    dark?: string;
  };
}
