import type { Product } from '@/types/product';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// --- TYPES ---

export interface OrderItemPayload {
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderPayload {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'TMONEY' | 'FLOOZ' | 'CARD';
  items: OrderItemPayload[];
  totalAmount: number;
  couponCode?: string | null; // Code promo optionnel
}

export interface CouponValidationResult {
  valid: boolean;
  code?: string;
  discountPercentage?: number;
  message?: string;
}

// --- FONCTIONS API ---

// 1. Récupérer tous les produits
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération des produits");
  return res.json();
}

// 2. Récupérer un produit par son ID
export async function fetchProductById(id: string | number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du produit');
  }
  return response.json();
}

// 3. Valider un code promo (Étape 2)
export async function validateCoupon(code: string): Promise<CouponValidationResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      return { valid: false, message: 'Erreur lors de la vérification du coupon.' };
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur validateCoupon:', error);
    return { valid: false, message: 'Impossible de contacter le serveur.' };
  }
}

// 4. Créer une nouvelle commande
export async function createOrder(orderData: OrderPayload) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création de la commande');
  }

  return response.json();
}

// --- API VENDEUR ---

export interface VendorStats {
  totalRevenue: number;
  totalOrders: number;
  productsSold: number;
  averageOrderValue: number;
  salesData: { date: string; revenue: number; salesCount: number }[];
  categorySales: { categoryName: string; totalSales: number }[];
}

export interface Category {
  id: number;
  name: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
}

export interface RecentOrder {
  id: number;
  customerName: string;
  totalAmount: number;
  status?: string;
  createdAt?: string;
}

async function vendorRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Erreur ${response.status}`);
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

export const fetchVendorProducts = () => vendorRequest<Product[]>('/vendor/products');

export const createProduct = (data: ProductPayload) =>
  vendorRequest<Product>('/vendor/products', { method: 'POST', body: JSON.stringify(data) });

export const updateProduct = (id: number, data: ProductPayload) =>
  vendorRequest<Product>(`/vendor/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteProduct = (id: number) =>
  vendorRequest<void>(`/vendor/products/${id}`, { method: 'DELETE' });

export const fetchVendorStats = () => vendorRequest<VendorStats>('/vendor/stats');

export const fetchCategories = () => vendorRequest<Category[]>('/categories');

export const fetchVendorRecentOrders = () =>
  vendorRequest<RecentOrder[]>('/vendor/orders/recent');