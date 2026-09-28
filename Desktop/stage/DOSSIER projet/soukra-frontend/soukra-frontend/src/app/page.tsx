'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Category {
  id: number;
  name?: string;
  nom_categorie?: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Erreur Backend:', err));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">SOUKRA - Test Connexion Backend</h1>
      <h2 className="text-xl font-semibold text-gray-700">Catégories :</h2>
      <ul className="list-disc ml-6 mt-2">
        {categories.map((cat) => (
          <li key={cat.id}>{cat.name || cat.nom_categorie}</li>
        ))}
      </ul>
    </main>
  );
}