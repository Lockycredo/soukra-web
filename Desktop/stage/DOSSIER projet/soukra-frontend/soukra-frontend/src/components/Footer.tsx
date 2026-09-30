"use client";

import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";

type LanguageCode = "fr" | "en" | "ar";

export default function Footer() {
  const [lang, setLang] = useState<LanguageCode>("fr");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentYear(new Date().getFullYear());

    // Détection du scroll pour afficher le bouton "Retour en haut"
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (selectedLang: LanguageCode) => {
    setLang(selectedLang);
    // Optionnel: Vous pouvez émettre un événement ou appeler votre i18n handler ici
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setFeedback({ message: "Veuillez entrer une adresse e-mail valide.", isError: true });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ message: "Inscription en cours...", isError: false });

    try {
      // Simulation d'un appel API (ex: POST /api/newsletter ou votre backend Spring Boot)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFeedback({ message: "Merci ! Vous êtes maintenant inscrit à notre newsletter.", isError: false });
      setEmail("");
    } catch {
      setFeedback({ message: "Une erreur est survenue. Veuillez réessayer.", isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0b0f19] text-slate-300 pt-20 pb-10 mt-20 overflow-hidden border-t border-slate-800/60 font-sans">
      
      {/* SEPARATION ONDULÉE FLUIDE (SVG WAVE) */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10 -translate-y-[99%] pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 md:h-16 text-[#0b0f19] fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* EFFET VISUEL GLOW DE FOND */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* SECTION NEWSLETTER */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-slate-800 shadow-2xl mb-16 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Abonnez-vous à notre newsletter
            </h3>
            <p className="text-slate-400 text-sm max-w-md">
              Recevez en avant-première nos offres exclusives et les nouveautés de la plateforme SOUKRA.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex-1 max-w-md space-y-2">
            <div className="flex items-center bg-slate-950/80 border border-slate-700/60 rounded-xl p-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <input
                type="email"
                placeholder="Votre adresse email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-all duration-200 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
              >
                {isSubmitting ? "Envoi..." : "S'abonner"}
              </button>
            </div>
            {feedback && (
              <p
                className={`text-xs px-2 ${
                  feedback.isError ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {feedback.message}
              </p>
            )}
          </form>
        </div>

        {/* GRILLE DU FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-slate-800/80">
          
          {/* COLONNE 1 : BRANDING & BIO */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                S
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                SOUKRA
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Plateforme e-commerce moderne conçue pour une expérience d&apos;achat fluide, connectée directement à notre API Spring Boot & PostgreSQL.
            </p>
            
            {/* RÉSEAUX SOCIAUX */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
                </svg>
              </a>
            </div>
          </div>

          {/* COLONNE 2 : ACCÈS RAPIDES */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Catalogue Produits
                </Link>
              </li>
              <li>
                <a href="#categories" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Catégories
                </a>
              </li>
              <li>
                <Link href="/cart" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Mon Panier
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Suivi de Commande
                </Link>
              </li>
            </ul>
          </div>

          {/* COLONNE 3 : STACK TECHNIQUE */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Technologies
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Next.js 16 (App Router)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Spring Boot REST API
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> PostgreSQL Database
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span> Tailwind CSS & TypeScript
              </li>
            </ul>
          </div>

          {/* COLONNE 4 : LANGUE ET INFOS */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Préférences
            </h3>
            
            {/* SÉLECTEUR DE LANGUE */}
            <div className="space-y-2">
              <span className="text-xs text-slate-500 block">Langue de l&apos;interface :</span>
              <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl gap-1">
                {(["fr", "en", "ar"] as LanguageCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    aria-pressed={lang === code}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                      lang === code
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* COPYRIGHT & INFOS BAS DE PAGE */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} SOUKRA E-Commerce. Tous droits réservés.
          </p>
          <p className="font-medium text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800/80">
            Projet de Stage Fullstack — Document N° 07-78[cite: 1]
          </p>
        </div>

      </div>

      {/* BOUTON RETOUR EN HAUT (FLOATING) */}
      <button
        onClick={scrollToTop}
        aria-label="Retour en haut de page"
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 transition-all duration-300 ${
          showBackToTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <svg
          className="w-5 h-5 fill-none stroke-current stroke-2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

    </footer>
  );
}