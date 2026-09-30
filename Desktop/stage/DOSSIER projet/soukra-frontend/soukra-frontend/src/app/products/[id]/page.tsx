'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { fetchProductById } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProductById(params.id as string)
        .then((data: Product) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err: unknown) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto p-12 text-center font-semibold">
          Chargement des détails du produit...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto p-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Produit introuvable</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold"
          >
            Retourner à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  const handleAddMultipleToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-white">
      <div>
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            ← Retour
          </button>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-400 font-medium">Image non disponible</span>
              )}
            </div>

            {/* Infos produit */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                  {product.name}
                </h1>
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-6">
                  {typeof product.price === 'number'
                    ? product.price.toLocaleString('fr-FR')
                    : product.price}{' '}
                  FCFA
                </p>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  {product.description || 'Aucune description disponible pour ce produit.'}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                {/* Sélecteur de quantité */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    Quantité :
                  </span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-semibold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-1.5 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bouton d'ajout au panier */}
                <button
                  onClick={handleAddMultipleToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
                >
                  Ajouter au panier ({quantity})
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}