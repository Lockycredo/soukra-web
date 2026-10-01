'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { createOrder, validateCoupon } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Product } from '@/types/product';

// Helper pour obtenir le prix effectif d'un produit (prix de base ou prix après réduction)
const getEffectivePrice = (product?: Product): number => {
  if (!product) return 0;
  if (product.effectivePrice !== undefined && product.effectivePrice !== null) {
    return Number(product.effectivePrice);
  }
  if (product.discountPercentage && product.discountPercentage > 0) {
    return product.price * (1 - product.discountPercentage / 100);
  }
  return product.price || 0;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    shippingAddress: '',
    paymentMethod: 'TMONEY' as 'TMONEY' | 'FLOOZ' | 'CARD',
  });

  // Gestion des codes promo
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercentage: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // 1. Calcul du sous-total en appliquant les réductions individuelles sur chaque produit
  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = getEffectivePrice(item.product);
    return sum + unitPrice * item.quantity;
  }, 0);

  // 2. Calcul du montant de la remise globale si un code promo est valide
  const discountAmount = appliedCoupon
    ? (subtotal * appliedCoupon.discountPercentage) / 100
    : 0;

  // 3. Montant total final à payer
  const finalTotal = subtotal - discountAmount;

  // Handler appelé au clic sur le bouton "Appliquer"
  const handleApplyCoupon = async () => {
    setCouponError('');

    if (!couponCodeInput.trim()) {
      setCouponError('Veuillez saisir un code promo.');
      return;
    }

    setIsCheckingCoupon(true);

    try {
      const result = await validateCoupon(couponCodeInput.trim().toUpperCase());

      if (result.valid && result.discountPercentage && result.code) {
        setAppliedCoupon({
          code: result.code,
          discountPercentage: result.discountPercentage,
        });
        setCouponCodeInput('');
        setCouponError('');
      } else {
        setAppliedCoupon(null);
        setCouponError(result.message || 'Code promo invalide ou expiré.');
      }
    } catch (err) {
      console.error(err);
      setAppliedCoupon(null);
      setCouponError('Erreur lors de la vérification du code.');
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (cart.length === 0) {
      setError('Votre panier est vide.');
      setLoading(false);
      return;
    }

    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        totalAmount: finalTotal,
        couponCode: appliedCoupon?.code || null,
        items: cart.map(({ product, quantity }) => ({
          productId: Number(product.id),
          quantity: quantity,
          price: getEffectivePrice(product),
        })),
      };

      await createOrder(orderPayload);
      clearCart();
      setSuccess(true);
    } catch (err: unknown) {
      console.error(err);
      setError('Impossible de valider la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-white">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-lg">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              ✓
            </div>
            <h1 className="text-2xl font-black mb-2">Commande Confirmée !</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Merci pour votre achat. Votre commande a été enregistrée avec succès.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              Retourner à la boutique
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-white">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-extrabold mb-8">Caisse / Finaliser la commande</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Formulaire Informations Client */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <h2 className="text-lg font-bold mb-2">Informations de livraison</h2>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kouami Mensah"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Téléphone (Mobile Money)</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 90 00 00 00"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Adresse de livraison</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Lomé, Quartier Hedzranawoé, rue 12"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Mode de Paiement */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Moyen de paiement</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['TMONEY', 'FLOOZ', 'CARD'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setFormData({ ...formData, paymentMethod: method })}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        formData.paymentMethod === method
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95"
              >
                {loading ? 'Validation en cours...' : `Payer ${finalTotal.toLocaleString('fr-FR')} FCFA`}
              </button>
            </form>

            {/* Récapitulatif Commande */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 h-fit space-y-4">
              <h2 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
                Récapitulatif de la commande
              </h2>

              {cart.length === 0 ? (
                <p className="text-slate-400 text-sm">Votre panier est vide.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {cart.map(({ product, quantity }) => {
                    const unitPrice = getEffectivePrice(product);
                    const hasDiscount = product.discountPercentage && product.discountPercentage > 0;

                    return (
                      <div key={product.id} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-xs text-slate-400">
                            Qté: {quantity} x {unitPrice.toLocaleString('fr-FR')} FCFA
                            {hasDiscount && (
                              <span className="ml-1 text-emerald-500 font-bold">(-{product.discountPercentage}%)</span>
                            )}
                          </p>
                        </div>
                        <span className="font-bold">
                          {(unitPrice * quantity).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Champ Saisie Code Promo */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <label className="block text-xs font-bold text-slate-500 mb-1">Code Promo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: WELCOME10"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isCheckingCoupon || !couponCodeInput.trim()}
                    className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isCheckingCoupon ? 'Vérification...' : 'Appliquer'}
                  </button>
                </div>

                {/* Message d'erreur */}
                {couponError && <p className="text-xs text-red-500 mt-1 font-semibold">{couponError}</p>}

                {/* Indication du coupon appliqué */}
                {appliedCoupon && (
                  <p className="text-xs text-emerald-500 mt-1 font-semibold">
                    Code <strong>{appliedCoupon.code}</strong> appliqué (-{appliedCoupon.discountPercentage}%) !
                  </p>
                )}
              </div>

              {/* Résumé Financier : sous-total, réduction et total final */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Sous-total</span>
                  <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Remise ({appliedCoupon.code} - {appliedCoupon.discountPercentage}%)</span>
                    <span>-{discountAmount.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-lg text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Total :</span>
                  <span className="text-blue-600">{finalTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}