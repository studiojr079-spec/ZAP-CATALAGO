import React from 'react';
import { Store, Product, Category, StoreBanner } from '../../types';

export interface CatalogTemplateProps {
  store: Store;
  products: Product[];
  categories: Category[];
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  handleEuQuero: (product: Product) => void;
  favorites: string[];
  toggleFavorite: (productId: string, e?: React.MouseEvent) => void;
  setShowAboutModal: (show: boolean) => void;
  setShowShareModal: (show: boolean) => void;
  setShowCartModal: (show: boolean) => void;
  cartCount: number;
  customBanners: StoreBanner[];
  setSelectedProduct?: (product: Product | null) => void;
}
