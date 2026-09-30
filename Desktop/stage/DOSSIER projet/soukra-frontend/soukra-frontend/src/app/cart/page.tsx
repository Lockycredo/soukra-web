"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Votre Panier</h1>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🛒
              </div>
              <h2 className="text-xl font-bold text-gray-800">Votre panier est vide</h2>
              <p className="text-gray-500 text-sm">Découvrez nos produits et ajoutez-les à votre panier.</p>
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
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400 font-semibold shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          "IMAGE"
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">{product.name}</h3>
                        <p className="text-blue-600 font-bold text-sm sm:text-base">{product.price} FCFA</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* BOUTONS D'AJUSTEMENT QUANTITÉ */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold text-gray-800">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
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
                  className="text-xs text-gray-500 hover:text-red-600 underline transition-colors pt-2"
                >
                  Vider complètement le panier
                </button>
              </div>

              {/* RÉSUMÉ COMMANDE */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-4">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Résumé de la commande
                </h2>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-semibold text-gray-900">{totalPrice} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-emerald-600 font-semibold">Gratuite</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-black text-blue-600">{totalPrice} FCFA</span>
                </div>

                <button
                  onClick={() => alert("Commande simulée avec succès !")}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 mt-4"
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