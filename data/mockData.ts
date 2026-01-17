import { Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: 1,
    name: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Acessórios',
    image: 'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Smartwatches',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Tablets',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop'
  }
];

export const products: Product[] = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max Titanium',
    price: 8299.00,
    originalPrice: 9499.00,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop',
    category: 'Smartphones',
    isNew: true
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra',
    price: 7999.00,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop',
    category: 'Smartphones',
    isNew: true
  },
  {
    id: 3,
    title: 'AirPods Pro 2ª Geração',
    price: 1899.00,
    originalPrice: 2299.00,
    image: 'https://images.unsplash.com/photo-1603351154351-5cf99bc5f16d?q=80&w=800&auto=format&fit=crop',
    category: 'Acessórios'
  },
  {
    id: 4,
    title: 'Apple Watch Series 9',
    price: 3499.00,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop',
    category: 'Smartwatches'
  },
  {
    id: 5,
    title: 'iPad Air M1',
    price: 5499.00,
    originalPrice: 6200.00,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
    category: 'Tablets'
  },
  {
    id: 6,
    title: 'Capa MagSafe Leather',
    price: 399.00,
    image: 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?q=80&w=800&auto=format&fit=crop',
    category: 'Acessórios'
  }
];