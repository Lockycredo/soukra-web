/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';

interface HeroProps {
  onCategorySelect?: (category: string) => void;
}

export default function Hero({ onCategorySelect }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'auto' | 'immo' | 'biens'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (tab: 'all' | 'auto' | 'immo' | 'biens') => {
    setActiveTab(tab);
    if (onCategorySelect) {
      onCategorySelect(tab === 'all' ? '' : tab);
    }
  };

  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-[#0D1B2A] via-[#1A2A6C] to-[#5C2D91] text-white shadow-2xl mb-12">
      
      {/* Effets de lumière ambiante et lueurs cinématiques */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* CÔTÉ GAUCHE (55% / 7 Colonnes) */}
        <div className="lg:col-span-7 space-y-6 z-10">
          
          {/* Badge officiel de confiance */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>N°1 des annonces vérifiées au Togo</span>
          </div>

          {/* Titre Principal */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Trouvez. <span className="bg-gradient-to-r from-blue-300 via-purple-200 to-white bg-clip-text text-transparent">Négociez.</span> Possédez.
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/80 font-normal max-w-xl leading-relaxed">
              Voitures, biens immobiliers et objets de valeur — tout en un seul endroit de confiance.
            </p>
          </div>

          {/* CROSSBAR DE NAVIGATION / FILTRE RAPIDE ANIMÉ */}
          <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl max-w-xl transition-all duration-300">
            
            {/* Navigation rapide par onglet */}
            <div className="flex gap-1 p-1 bg-black/20 rounded-xl mb-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'all' ? 'bg-white text-slate-900 shadow-md font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Tout voir
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('auto')}
                className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'auto' ? 'bg-[#1A2A6C] text-white shadow-md font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Automobile
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('immo')}
                className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'immo' ? 'bg-[#5C2D91] text-white shadow-md font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Immobilier
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('biens')}
                className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'biens' ? 'bg-blue-600 text-white shadow-md font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Biens Divers
              </button>
            </div>

            {/* Barre de Recherche Interactive */}
            <div className="flex items-center gap-2 bg-white/10 dark:bg-slate-900/40 rounded-xl px-3 py-2 border border-white/10">
              <svg className="w-5 h-5 text-blue-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={
                  activeTab === 'auto' ? 'Rechercher une marque, SUV, berline...' :
                  activeTab === 'immo' ? 'Villa, appartement, quartier, terrain...' :
                  activeTab === 'biens' ? 'Meubles, électronique, montres...' :
                  'Que recherchez-vous aujourd\'hui ?'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-blue-200/60 focus:outline-none"
              />
              <button
                type="button"
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-lg transition-transform active:scale-95 shrink-0"
              >
                Rechercher
              </button>
            </div>
          </div>

          {/* Boutons d'action CTA */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#products"
              className="bg-white text-[#1A2A6C] hover:bg-blue-50 font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Explorer les annonces
            </a>
            <a
              href="/publish"
              className="border-2 border-white/30 hover:border-white/80 text-white font-bold text-sm px-7 py-3.5 rounded-xl backdrop-blur-md hover:bg-white/10 transition-all duration-200"
            >
              Déposer une annonce
            </a>
          </div>

          {/* Rangée de Réputation / Confiance */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-blue-200/80 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-extrabold text-sm">4.9 ★</span>
              <span>Avis Google</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div><strong className="text-white">+1 200</strong> annonces actives</div>
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Transactions sécurisées</span>
            </div>
          </div>

        </div>

        {/* CÔTÉ DROIT (45% / 5 Colonnes) - Composite Visuel dynamique selon la Crossbar */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          
          {/* Card interactive 1 : Immobilier */}
          <div className={`relative w-full h-100 rounded-2xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-500 transform ${
            activeTab === 'immo' ? 'scale-105 z-20 ring-4 ring-purple-500/50' : 'opacity-90 hover:scale-102'
          }`}>
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
              alt="Immobilier SOUKRA"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Floating Overlay Badge Auto/Biens */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-xl text-xs font-bold text-white shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Villa Duplex • Lomé</span>
            </div>

            {/* Inset Product Card : Véhicule / SUV */}
            <div className={`absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-xl border border-white/15 transition-all duration-300 ${
              activeTab === 'auto' ? 'border-blue-400 bg-slate-900/95 scale-102' : ''
            }`}>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Sélection Premium</p>
                  <p className="font-bold text-white text-sm">Mercedes-Benz GLE 450</p>
                </div>
                <span className="text-blue-400 font-extrabold text-sm">45 000 000 FCFA</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}