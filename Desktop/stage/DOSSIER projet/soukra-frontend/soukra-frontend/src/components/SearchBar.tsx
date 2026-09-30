'use client';

import React, { Dispatch, SetStateAction } from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>> | ((query: string) => void);
  placeholder?: string;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  placeholder = "Rechercher un produit dans SOUKRA...",
}: SearchBarProps) {
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          id="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-700 bg-slate-800/90 py-2 pl-4 pr-10 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
        />

        <div className="absolute right-3 flex items-center justify-center">
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Effacer"
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <div className="pointer-events-none text-slate-400">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}