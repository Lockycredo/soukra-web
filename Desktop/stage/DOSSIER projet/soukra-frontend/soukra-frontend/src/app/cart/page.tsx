'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-white">
      <div>
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Votre Panier</h1>

          {cart.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🛒
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Votre panier est vide</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Découvrez nos produits et ajoutez-les à votre panier.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-600/20"
              >
                Retourner à la boutique
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LISTE DES ARTICLES */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400 font-semibold shrink-0 overflow-hidden">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          "IMAGE"
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{product.name}</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base">
                          {typeof product.price === 'number' ? product.price.toLocaleString('fr-FR') : product.price} FCFA
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* BOUTONS D'AJUSTEMENT QUANTITÉ */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* SUPPRIMER */}
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        title="Supprimer"
                      >
                        <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 underline transition-colors pt-2"
                >
                  Vider complètement le panier
                </button>
              </div>

              {/* RÉSUMÉ COMMANDE */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm h-fit space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Résumé de la commande
                </h2>

                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {totalPrice.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Gratuite</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Total</span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {totalPrice.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 mt-4 active:scale-95"
                >
                  Commander maintenant
                </button>
              </div>

            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}