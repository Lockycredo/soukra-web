'use client';

import { useState } from 'react';

export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: string;
  description: string;
  images: { name: string; meta: string; src: string; alt: string }[];
  documents?: { name: string; meta: string; size: string }[];
}

interface RealEstateCardProps {
  property: Property;
  onContact?: () => void;
}

export default function RealEstateCard({ property, onContact }: RealEstateCardProps) {
  const [selectedImage, setSelectedImage] = useState(property.images[0]?.src);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden max-w-lg mx-auto">
      
      {/* 1. IMAGE PRINCIPALE SÉLECTIONNÉE */}
      <div className="relative w-full aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={selectedImage || property.images[0]?.src}
          alt={property.title}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md uppercase tracking-wider">
            {property.type}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 z-10">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-lg font-black px-4 py-1.5 rounded-2xl shadow-lg border border-white/10">
            {property.price.toLocaleString('fr-FR')} <span className="text-xs text-blue-400 font-bold">FCFA</span>
          </span>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* TITRE ET LOCALISATION */}
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {property.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-1 font-medium">
            <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>
        </div>

        {/* 2. GALERIE D'IMAGES STYLE ATTACHMENT */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Aperçu de la propriété ({property.images.length} photos)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img.src)}
                className={`relative group rounded-xl overflow-hidden border-2 transition-all aspect-video text-left ${
                  selectedImage === img.src ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-transparent hover:border-slate-200'
                }`}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-1.5 flex flex-col justify-end">
                  <span className="text-[10px] font-semibold text-white truncate">{img.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. DOCUMENTS / RENSEIGNEMENTS (ATTACHMENT GROUP) */}
        {property.documents && property.documents.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Documents vérifiés
            </p>
            <div className="space-y-2">
              {property.documents.map((doc, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px] sm:max-w-[220px]">
                        {doc.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {doc.meta} · {doc.size}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900">
                    Certifié
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOUTON D'ACTION PRINCIPAL */}
        <button
          onClick={onContact}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Contacter l&apos;agent / Réserver une visite
        </button>

      </div>
    </div>
  );
}