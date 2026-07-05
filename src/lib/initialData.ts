/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Store, Product, Category, Order, AnalyticsRecord, Notification, Plan, UserSubscription, AppUser } from '../types';

export const INITIAL_USER: AppUser = {
  id: 'usr_default',
  email: 'loja@catalogointeligente.com',
  name: 'Minha Loja',
  role: 'owner',
  storeId: 'store_default'
};

export const INITIAL_STORE: Store = {
  id: 'store_default',
  slug: 'minhaloja',
  name: 'Minha Loja',
  slogan: 'O SEU CATÁLOGO COMPLETO NO WHATSAPP! ✨',
  description: 'Confira nossos produtos incríveis e faça seu pedido pelo WhatsApp.',
  logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  banner: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&auto=format&fit=crop&q=80',
  whatsapp: '5511999999999',
  instagram: 'jessicahair_oficial',
  facebook: 'jessicahair.oficial',
  tiktok: 'jessicahair_tiktok',

  primaryColor: '#db2777', // Deep pink
  secondaryColor: '#fdf2f8', // Soft pink background
  backgroundColor: '#fdf5f7',
  textColor: '#111111',
  buttonColor: '#FF2D7A',

  fontFamily: 'Manrope',
  titleSize: '16px',
  textSize: '13px',
  buttonSize: '15px',

  buttonText: 'EU QUERO',
  buttonIcon: 'whatsapp',
  buttonBorder: '12px',

  showPrice: true,
  showStock: true,
  messageTemplate: 'Olá!\n\nTenho interesse no produto:\n*{productName}*\n\nValor:\n*R$ {productPrice}*\n\nPode me atender?',
  banners: [],
  switchTimeMs: 5000,

  layout: {
    showBanner: true,
    showSearch: true,
    showCategories: true,
    showBestSellers: true,
    showPromotions: true,
    showShipping: true,
    showAboutStore: true,
    sectionOrder: ['banner', 'search', 'categories', 'products', 'shipping', 'about']
  },

  about: {
    history: '',
    mission: '',
    description: 'Oferecemos os melhores produtos do mercado para você! Tudo preparado com carinho, praticidade e qualidade para realçar o seu dia a dia.',
    photos: [],
    video: '',
    hours: '',
    address: '',
    whatsapp: '5511999999999',
    instagram: 'jessicahair_oficial',
    facebook: 'jessicahair.oficial',
    tiktok: 'jessicahair_tiktok'
  }
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_todos',
    storeId: 'store_jessica',
    name: 'TODOS',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80',
    order: 0
  },
  {
    id: 'cat_cacheados',
    storeId: 'store_jessica',
    name: 'CACHEADOS',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop&q=80',
    order: 1
  },
  {
    id: 'cat_lisos',
    storeId: 'store_jessica',
    name: 'LISOS E ONDULADOS',
    image: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=200&h=200&fit=crop&q=80',
    order: 2
  },
  {
    id: 'cat_rabo_cavalo',
    storeId: 'store_jessica',
    name: 'RABO DE CAVALO',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200&h=200&fit=crop&q=80',
    order: 3
  },
  {
    id: 'cat_apliques_tictac',
    storeId: 'store_jessica',
    name: 'APLIQUES TIC TAC',
    image: 'https://images.unsplash.com/photo-1595959183075-c1d0a174821d?w=200&h=200&fit=crop&q=80',
    order: 4
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_ludmilla_mel',
    storeId: 'store_jessica',
    name: 'LUDMILLA MEL - 60cm, OMBRE MEL',
    categoryId: 'cat_cacheados',
    description: '',
    price: 189.90,
    promoPrice: 189.90,
    length: '60cm',
    color: 'Ombre Mel',
    stock: 25,
    featured: true,
    hidden: false,
    showPrice: true,
    images: [
      'https://images.unsplash.com/photo-1595959183075-c1d0a174821d?w=600&h=800&fit=crop&q=80'
    ],
    views: 1254,
    clicks: 182
  },
  {
    id: 'prod_sarah_chocolate',
    storeId: 'store_jessica',
    name: 'SARAH CHOCOLATE - 70cm, CHOCOLATE',
    categoryId: 'cat_cacheados',
    description: '',
    price: 189.90,
    promoPrice: 189.90,
    length: '70cm',
    color: 'Chocolate',
    stock: 18,
    featured: true,
    hidden: false,
    showPrice: true,
    images: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=800&fit=crop&q=80'
    ],
    views: 943,
    clicks: 120
  },
  {
    id: 'prod_liso_premium',
    storeId: 'store_jessica',
    name: 'LISO EXCLUSIVO - 65cm, CASTANHO ESCURO',
    categoryId: 'cat_lisos',
    description: '',
    price: 179.90,
    promoPrice: 179.90,
    length: '65cm',
    color: 'Castanho Escuro',
    stock: 30,
    featured: true,
    hidden: false,
    showPrice: true,
    images: [
      'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=600&h=800&fit=crop&q=80'
    ],
    views: 1420,
    clicks: 215
  },
  {
    id: 'prod_ondulado_mel',
    storeId: 'store_jessica',
    name: 'ONDULADO MEL - 65cm, MORENA ILUMINADA',
    categoryId: 'cat_lisos',
    description: '',
    price: 189.90,
    promoPrice: 189.90,
    length: '65cm',
    color: 'Morena Iluminada',
    stock: 15,
    featured: true,
    hidden: false,
    showPrice: true,
    images: [
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=800&fit=crop&q=80'
    ],
    views: 812,
    clicks: 98
  },
  {
    id: 'prod_tictac_ondulado',
    storeId: 'store_jessica',
    name: 'Aplique Tic Tac Ondulado - 70cm',
    categoryId: 'cat_apliques_tictac',
    description: '',
    price: 189.90,
    promoPrice: 189.90,
    length: '70cm',
    color: 'Fibra de Luxo',
    stock: 20,
    featured: true,
    hidden: false,
    showPrice: true,
    images: [
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=800&fit=crop&q=80'
    ],
    views: 745,
    clicks: 84
  },
  {
    id: 'prod_tictac_liso',
    storeId: 'store_jessica',
    name: 'Aplique Tic Tac Liso - 65cm',
    categoryId: 'cat_apliques_tictac',
    description: '',
    price: 179.90,
    promoPrice: 179.90,
    length: '65cm',
    color: 'Fibra de Luxo',
    stock: 22,
    featured: true,
    hidden: false,
    showPrice: true,
    images: [
      'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=600&h=800&fit=crop&q=80'
    ],
    views: 630,
    clicks: 72
  },
  {
    id: 'prod_tictac_cacheado',
    storeId: 'store_jessica',
    name: 'Aplique Tic Tac Cacheado - 80cm',
    categoryId: 'cat_apliques_tictac',
    description: '',
    price: 199.90,
    promoPrice: 199.90,
    length: '80cm',
    color: 'Fibra de Luxo',
    stock: 12,
    featured: true,
    hidden: false,
    showPrice: true,
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&q=80'
    ],
    views: 890,
    clicks: 115
  },
  {
    id: 'prod_tictac_ondas',
    storeId: 'store_jessica',
    name: 'Aplique Tic Tac Ondas - 60cm',
    categoryId: 'cat_apliques_tictac',
    description: '',
    price: 189.90,
    promoPrice: 189.90,
    length: '60cm',
    color: 'Fibra de Luxo',
    stock: 17,
    featured: true,
    hidden: false,
    showPrice: true,
    images: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=800&fit=crop&q=80'
    ],
    views: 520,
    clicks: 64
  },
  {
    id: 'prod_tictac_cacheado_70',
    storeId: 'store_jessica',
    name: 'Aplique Tic Tac Cacheado 70cm',
    categoryId: 'cat_cacheados',
    description: '',
    price: 189.90,
    promoPrice: 189.90,
    length: '70cm',
    color: 'Preto Natural',
    stock: 15,
    featured: true,
    hidden: false,
    showPrice: true,
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&q=80'
    ],
    views: 410,
    clicks: 53
  },
  {
    id: 'prod_liso_premium_60',
    storeId: 'store_jessica',
    name: 'Aplique Liso de Luxo 60cm',
    categoryId: 'cat_lisos',
    description: '',
    price: 179.90,
    promoPrice: 179.90,
    length: '60cm',
    color: 'Preto',
    stock: 25,
    featured: true,
    hidden: false,
    showPrice: true,
    images: [
      'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=600&h=800&fit=crop&q=80'
    ],
    views: 530,
    clicks: 71
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1',
    storeId: 'store_jessica',
    productId: 'prod_beyonce',
    productName: 'Beyonce 80cm',
    productPrice: 169.99,
    date: '2026-07-04',
    time: '12:30',
    source: 'Instagram',
    status: 'Pendente',
    notes: 'Cliente interessado no Castanho Escuro.'
  },
  {
    id: 'ord_2',
    storeId: 'store_jessica',
    productId: 'prod_diana',
    productName: 'Diana 70cm',
    productPrice: 159.99,
    date: '2026-07-03',
    time: '15:45',
    source: 'Direct',
    status: 'Atendido',
    notes: 'Rápido atendimento. Envio realizado.'
  },
  {
    id: 'ord_3',
    storeId: 'store_jessica',
    productId: 'prod_nara',
    productName: 'Nara 65cm',
    productPrice: 149.99,
    date: '2026-07-02',
    time: '09:15',
    source: 'WhatsApp',
    status: 'Pendente'
  }
];

export const INITIAL_ANALYTICS: AnalyticsRecord = {
  storeId: 'store_jessica',
  views: 2456,
  clicks: 312,
  uniqueVisitors: 1284,
  devices: { mobile: 1824, tablet: 412, desktop: 220 },
  origins: { direct: 450, whatsapp: 980, instagram: 650, tiktok: 226, google: 150 },
  locations: [
    { city: 'São Paulo', state: 'SP', count: 1240 },
    { city: 'Rio de Janeiro', state: 'RJ', count: 540 },
    { city: 'Belo Horizonte', state: 'MG', count: 320 },
    { city: 'Salvador', state: 'BA', count: 210 },
    { city: 'Curitiba', state: 'PR', count: 146 }
  ],
  dailyMetrics: [
    { date: '27 Mai', views: 80, clicks: 12, orders: 1 },
    { date: '28 Mai', views: 320, clicks: 35, orders: 3 },
    { date: '29 Mai', views: 420, clicks: 48, orders: 4 },
    { date: '30 Mai', views: 280, clicks: 28, orders: 2 },
    { date: '31 Mai', views: 490, clicks: 58, orders: 5 },
    { date: '01 Jun', views: 390, clicks: 45, orders: 3 },
    { date: '02 Jun', views: 720, clicks: 86, orders: 9 }
  ]
};

export function getEmptyAnalytics(storeId: string): AnalyticsRecord {
  return {
    storeId,
    views: 0,
    clicks: 0,
    uniqueVisitors: 0,
    devices: { mobile: 0, tablet: 0, desktop: 0 },
    origins: { direct: 0, whatsapp: 0, instagram: 0, tiktok: 0, google: 0 },
    locations: [],
    dailyMetrics: []
  };
}

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'not_1',
    storeId: 'store_jessica',
    type: 'click',
    title: 'Novo clique no WhatsApp',
    description: 'Cliente clicou em "EU QUERO" para Beyonce 80cm.',
    date: '2026-07-04T12:30:00',
    read: false
  },
  {
    id: 'not_2',
    storeId: 'store_jessica',
    type: 'order',
    title: 'Novo pedido registrado',
    description: 'Diana 70cm - status pendente no painel.',
    date: '2026-07-03T15:45:00',
    read: true
  },
  {
    id: 'not_3',
    storeId: 'store_jessica',
    type: 'subscription',
    title: 'Assinatura ativa',
    description: 'Seu plano PRO está ativo e renovará em 30 dias.',
    date: '2026-07-01T08:00:00',
    read: true
  }
];

export const PLANS: Plan[] = [
  {
    id: 'plan_pro',
    name: 'Pro',
    price: 47.00,
    billing: 'mensal',
    limits: { products: 9999, categories: 999, banners: 10, storageMb: 2048 },
    features: ['Produtos Ilimitados', 'Categorias Ilimitadas', 'Até 10 Banners rotativos', 'SaaS Multi-loja Completo', 'Configurações Avançadas', 'Suporte Especializado']
  }
];

export const INITIAL_SUBSCRIPTION: UserSubscription = {
  userId: 'usr_jessica',
  planId: 'plan_pro',
  status: 'active',
  expiresAt: '2026-08-04T00:00:00',
  paymentGateway: 'stripe'
};

// State Manager for persistent storage
export class LocalDatabase {
  static get<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(`cat_int_` + key);
    if (!data) {
      this.set(key, defaultValue);
      return defaultValue;
    }
    try {
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }

  static set(key: string, value: any): void {
    localStorage.setItem(`cat_int_` + key, JSON.stringify(value));
  }

  static init(): void {
    this.get('user', INITIAL_USER);
    this.get('store', INITIAL_STORE);
    this.get('categories', INITIAL_CATEGORIES);
    this.get('products', INITIAL_PRODUCTS);
    this.get('orders', INITIAL_ORDERS);
    this.get('analytics', INITIAL_ANALYTICS);
    this.get('notifications', INITIAL_NOTIFICATIONS);
    this.get('subscription', INITIAL_SUBSCRIPTION);
    
    // Also save other stores database for multi-store demonstration
    const storesList = this.get<Store[]>('stores_list', [INITIAL_STORE]);
    if (!storesList.some(s => s.id === INITIAL_STORE.id)) {
      storesList.push(INITIAL_STORE);
      this.set('stores_list', storesList);
    }
  }

  static resetToDefault(): void {
    localStorage.removeItem('cat_int_user');
    localStorage.removeItem('cat_int_store');
    localStorage.removeItem('cat_int_categories');
    localStorage.removeItem('cat_int_products');
    localStorage.removeItem('cat_int_orders');
    localStorage.removeItem('cat_int_analytics');
    localStorage.removeItem('cat_int_notifications');
    localStorage.removeItem('cat_int_subscription');
    localStorage.removeItem('cat_int_stores_list');
    this.init();
  }
}
