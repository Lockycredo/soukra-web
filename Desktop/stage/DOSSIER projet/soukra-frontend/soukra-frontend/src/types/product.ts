export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPercentage?: number; // Pourcentage de réduction (ex: 10 pour 10%)
  effectivePrice?: number;     // Prix remisé calculé envoyé par le backend
  stock?: number;              // Quantité en stock
  imageUrl?: string;
  category?: Category;
}