import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 text-slate-300 pt-16 pb-12 mt-20 overflow-hidden">
      
      {/* SEPARATION ONDULÉE FLUIDE (SVG WAVE) */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10 translate-y-[-99%]">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-12 md:h-16 text-slate-900 fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* COLONNE 1 : BRANDING */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg">
                S
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                SOUKRA
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Plateforme e-commerce moderne conçue pour une expérience d&apos;achat fluide, connectée directement à notre API Spring Boot & PostgreSQL.
            </p>
          </div>

          {/* COLONNE 2 : ACCÈS RAPIDES */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Catalogue Produits
                </Link>
              </li>
              <li>
                <a href="#categories" className="hover:text-blue-400 transition-colors">
                  Catégories
                </a>
              </li>
            </ul>
          </div>

          {/* COLONNE 3 : STACK TECHNIQUE */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Technologies
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Next.js 16 (App Router)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Spring Boot REST API
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> PostgreSQL Database
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> Tailwind CSS & TypeScript
              </li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT & BASE */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} SOUKRA E-Commerce. Tous droits réservés.
          </p>
          <p className="font-medium text-slate-400">
            Projet de Stage Fullstack — Document N° 07-78[cite: 1]
          </p>
        </div>
      </div>
    </footer>
  );
}