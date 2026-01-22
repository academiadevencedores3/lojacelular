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
  paymentMethod: string;
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
}

// Novos tipos para o sistema Admin/Vendedor
export type Role = 'admin' | 'seller' | 'customer';

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
}

export interface Sale {
  id: number;
  sellerId?: string; // Se null, foi venda online direta
  sellerName?: string;
  total: number;
  date: string;
  items: CartItem[];
  customerName?: string;
  customerCpf?: string; // Novo campo opcional
  paymentMethod: string;
}

// Configurações de Pagamento
export type PaymentProvider = 'mercado_pago' | 'stripe' | 'asaas' | 'pagar_me' | 'pix' | 'crypto';

export interface PaymentConfig {
  id: PaymentProvider;
  name: string;
  active: boolean;
  type: 'api' | 'manual' | 'crypto';
  config: {
    publicKey?: string;
    privateKey?: string; // Token de API
    pixKey?: string;     // Para Pix Manual
    walletAddress?: string; // Para Cripto
    network?: string;    // Rede da Cripto (TRC20, ERC20)
    mode?: 'sandbox' | 'production'; // Ambiente
  };
}