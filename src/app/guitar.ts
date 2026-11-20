export type GuitarType = 'Acoustic' | 'Electric' | 'Classical' | 'Bass';

export const GUITAR_TYPES: GuitarType[] = ['Acoustic', 'Electric', 'Classical', 'Bass'];

export interface Guitar {
  id: string;
  name: string;
  brand: string;
  type: GuitarType;
  price: number; // PHP
  stock: number;
  description: string;
  specs: { label: string; value: string }[];
  color: string; // body color (used for the illustration)
  accent: string; // pickguard / trim color
  photo?: string; // optional product photo in public/guitars/
}

export interface CartLine {
  id: string;
  quantity: number;
}

export interface CartItemView {
  guitar: Guitar;
  quantity: number;
  subtotal: number;
}

export type PaymentMethod = 'cod' | 'gcash' | 'bank' | 'card';

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  payment: PaymentMethod;
}

export interface Order {
  id: string;
  placedAt: string;
  customer: CustomerInfo;
  items: CartItemView[];
  subtotal: number;
  shipping: number;
  total: number;
}
