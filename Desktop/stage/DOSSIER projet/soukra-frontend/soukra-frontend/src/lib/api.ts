const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function fetchProducts() {
  const res = await fetch(`${API_BASE_URL}/products`, {
    cache: "no-store", // ou { revalidate: 60 } selon ton besoin SSR/ISR
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération des produits");
  return res.json();
}
import { Product } from '@/types/product';

export async function fetchProductById(id: string | number): Promise<Product> {
  const response = await fetch(`http://localhost:8080/api/products/${id}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du produit');
  }
  return response.json();
}