'use client';

import Link from 'next/link';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Récupération de la fonction d'ajout au panier globale
  const { addToCart } = useCart();

  // Extraction sécurisée du nom de la catégorie (soit objet {name: ''}, soit string)
  const categoryName = typeof product.category === 'object' && product.category !== null
    ? (product.category as { name?: string }).name
    : typeof product.category === 'string'
    ? product.category
    : 'Général';

  // Formatage sécurisé du prix
  const formattedPrice = typeof product.price === 'number' 
    ? product.price.toLocaleString('fr-FR') 
    : product.price;

  // Gestion du clic sur le bouton
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden flex flex-col justify-between">
      
      {/* SECTION IMAGE AVEC LIEN VERS LA PAGE DÉTAILS */}
      <Link href={`/products/${product.id}`} className="relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden block">
        
        {/* Badge de catégorie */}
        <div className="absolute top-3 left-3 z-30">
          <span className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-white/20 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            {categoryName}
          </span>
        </div>

        {/* Effet d'ombrage au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Image du produit */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/50">
            <svg className="w-10 h-10 mb-1 opacity-40 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">SOUKRA Media</span>
          </div>
        )}
      </Link>

      {/* CONTENU TEXTE ET INFORMATIONS */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Titre du produit cliquable */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mt-1 line-clamp-2">
            {product.description || 'Disponible sur la plateforme SOUKRA.'}
          </p>
        </div>

        {/* PRIX ET BOUTON D'ACTION */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Prix</span>
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {formattedPrice} <span className="text-xs font-bold text-blue-600">FCFA</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}