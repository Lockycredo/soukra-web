'use client';

import { useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/api'; // <--- Import corrigé ici
import { Product } from '@/types/product';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // <--- Utilisation de fetchProducts() ici
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur de chargement des produits :', err);
        setError('Impossible de récupérer la liste des produits.');
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar 
          cartCount={0} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Hero />

          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Résultats pour "${searchQuery}"` : 'Nos Produits'}
              </h2>
              <span className="text-sm font-medium text-gray-500">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
              </span>
            </div>

            {loading && (
              <div className="flex justify-center items-center py-24 text-blue-600 font-semibold text-lg">
                Chargement des produits...
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
                Aucun produit disponible dans la base de données.
              </div>
            )}

            {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
              <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
                Aucun produit ne correspond à votre recherche &quot;{searchQuery}&quot;.
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}