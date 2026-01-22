import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, User, Sale, PaymentConfig } from '../types';
import { products as initialProducts, categories as initialCategories } from '../data/mockData';

interface DataContextType {
  products: Product[];
  categories: Category[];
  sellers: User[];
  sales: Sale[];
  paymentSettings: PaymentConfig[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: number) => void;
  addSeller: (seller: User) => void;
  updateSeller: (seller: User) => void;
  deleteSeller: (id: string) => void;
  updatePaymentSetting: (config: PaymentConfig) => void;
  recordSale: (sale: Omit<Sale, 'id' | 'date'>) => Sale; // Updated to return the created Sale
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialSellers: User[] = [
  { id: '1', name: 'Vendedor 1', username: 'vendedor1', role: 'seller' },
  { id: '2', name: 'Vendedor 2', username: 'vendedor2', role: 'seller' },
];

const initialPaymentSettings: PaymentConfig[] = [
  { id: 'mercado_pago', name: 'Mercado Pago', active: true, type: 'api', config: { mode: 'sandbox' } },
  { id: 'stripe', name: 'Stripe', active: false, type: 'api', config: { mode: 'sandbox' } },
  { id: 'asaas', name: 'Asaas', active: false, type: 'api', config: { mode: 'sandbox' } },
  { id: 'pagar_me', name: 'Pagar.me', active: false, type: 'api', config: { mode: 'sandbox' } },
  { id: 'pix', name: 'Pix', active: true, type: 'manual', config: { pixKey: 'email@loja.com' } },
  { id: 'crypto', name: 'USDT / Cripto', active: false, type: 'crypto', config: { walletAddress: '', network: 'TRC20' } },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentConfig[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Initial Data
  useEffect(() => {
    const loadData = () => {
      const storedProducts = localStorage.getItem('tcp_products');
      const storedCategories = localStorage.getItem('tcp_categories');
      const storedSellers = localStorage.getItem('tcp_sellers');
      const storedSales = localStorage.getItem('tcp_sales');
      const storedPayments = localStorage.getItem('tcp_payments');

      if (storedProducts && JSON.parse(storedProducts).length > 0) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(initialProducts);
      }

      if (storedCategories && JSON.parse(storedCategories).length > 0) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories(initialCategories);
      }

      if (storedSellers) setSellers(JSON.parse(storedSellers));
      else setSellers(initialSellers);

      if (storedSales) setSales(JSON.parse(storedSales));
      
      if (storedPayments) setPaymentSettings(JSON.parse(storedPayments));
      else setPaymentSettings(initialPaymentSettings);

      setIsLoaded(true);
    };
    loadData();
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (isLoaded) localStorage.setItem('tcp_products', JSON.stringify(products));
  }, [products, isLoaded]);
  
  useEffect(() => {
    if (isLoaded) localStorage.setItem('tcp_categories', JSON.stringify(categories));
  }, [categories, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('tcp_sellers', JSON.stringify(sellers));
  }, [sellers, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('tcp_sales', JSON.stringify(sales));
  }, [sales, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('tcp_payments', JSON.stringify(paymentSettings));
  }, [paymentSettings, isLoaded]);

  // Product CRUD
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { ...product, id: newId }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Category CRUD
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories([...categories, { ...category, id: newId }]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const deleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  // Seller CRUD
  const addSeller = (seller: User) => {
    setSellers([...sellers, seller]);
  };

  const updateSeller = (updatedSeller: User) => {
    setSellers(sellers.map(s => s.id === updatedSeller.id ? updatedSeller : s));
  };

  const deleteSeller = (id: string) => {
    setSellers(sellers.filter(s => s.id !== id));
  };

  // Payment Settings
  const updatePaymentSetting = (config: PaymentConfig) => {
    setPaymentSettings(prev => prev.map(p => p.id === config.id ? config : p));
  };

  // Sales
  const recordSale = (saleData: Omit<Sale, 'id' | 'date'>): Sale => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setSales(prev => [newSale, ...prev]);
    return newSale;
  };

  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <DataContext.Provider value={{
      products,
      categories,
      sellers,
      sales,
      paymentSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addSeller,
      updateSeller,
      deleteSeller,
      updatePaymentSetting,
      recordSale,
      resetData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};