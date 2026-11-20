export type Category = 'Lifestyle' | 'Running' | 'Basketball' | 'Skate';

export const CATEGORIES: Category[] = ['Lifestyle', 'Running', 'Basketball', 'Skate'];

export type Shape = 'low' | 'high' | 'runner';

export interface SizeStock {
  size: number; // US men's size
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number; // PHP (sample price)
  description: string;
  specs: { label: string; value: string }[];
  sizes: SizeStock[];
  color: string; // main upper color (used for the illustration)
  accent: string; // laces / stripe color
  sole: string; // sole color
  tile: string; // backdrop color behind the shoe
  shape: Shape;
  tag?: 'New' | 'Bestseller';
  photo?: string; // optional product photo in public/products/
}

export interface CartLine {
  id: string;
  size: number;
  quantity: number;
}

export interface CartItemView {
  product: Product;
  size: number;
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
