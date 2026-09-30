'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  cartCount?: number;
  searchQuery?: string;
  setSearchQuery?: Dispatch<SetStateAction<string>> | ((query: string) => void);
}

export default function Navbar({ 
  cartCount, 
  searchQuery = '', 
  setSearchQuery = () => {} 
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Récupération du total des articles directement depuis le CartContext
  const { totalItems } = useCart();
  
  // Utilise cartCount s'il est passé en prop, sinon utilise totalItems du Context
  const displayCartCount = cartCount !== undefined ? cartCount : totalItems;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* LOGO SOUKRA */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                SOUKRA
              </span>
              <span className="text-[10px] font-semibold text-blue-600 tracking-widest uppercase -mt-1">
                E-Commerce
              </span>
            </div>
          </Link>

          {/* BARRE DE RECHERCHE DESKTOP */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
          </div>

          {/* ACTIONS : PANIER + MENU PROFIL */}
          <div className="flex items-center gap-3">
            
            {/* Bouton Panier redirigeant vers /cart */}
            <Link 
              href="/cart"
              aria-label="Voir le panier"
              className="relative p-2.5 text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {displayCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-pulse">
                  {displayCartCount}
                </span>
              )}
            </Link>

            {/* MENU PROFIL / OPTIONS */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold px-3 py-2 rounded-xl transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                  U
                </div>
                <span className="hidden sm:inline">Mon Compte</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Menu déroulant de profil */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Connecté en tant que</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Utilisateur SOUKRA</p>
                  </div>

                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors flex items-center justify-between">
                      Profil & Commandes
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors flex items-center justify-between">
                      Paramètres
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* HAMBURGER MOBILE */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>

        {/* BARRE DE RECHERCHE MOBILE */}
        <div className="pb-3 md:hidden">
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        </div>
      </div>
    </header>
  );
}