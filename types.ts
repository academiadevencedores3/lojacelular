export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderForm {
  fullName: string;
  email: string;
  whatsapp: string;
  deliveryMethod: 'pickup' | 'delivery';
  paymentMethod: 'pix' | 'credit_card' | 'debit_card' | 'cash' | 'crypto' | '';
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
}