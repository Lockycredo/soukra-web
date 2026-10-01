'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, PackageOpen, Loader2, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Product } from '@/types/product';
import {
  fetchVendorProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  type Category,
  type ProductPayload,
} from '@/lib/api';

const LOW_STOCK_THRESHOLD = 5;

const IMAGE_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='48' height='48' rx='12' fill='%23e2e8f0'/><path d='M14 32l7-9 5 6 4-5 6 8z' fill='%2394a3b8'/></svg>";

const fcfa = (n: number): string => `${Math.round(n).toLocaleString('fr-FR')} FCFA`;

const getEffectivePrice = (
  p: Pick<Product, 'price' | 'discountPercentage' | 'effectivePrice'>
): number => {
  if (p.effectivePrice !== undefined && p.effectivePrice !== null) return Number(p.effectivePrice);
  if (p.discountPercentage && p.discountPercentage > 0) {
    return p.price * (1 - p.discountPercentage / 100);
  }
  return p.price || 0;
};

type FormState = {
  name: string;
  description: string;
  price: string;
  discountPercentage: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
};

const emptyForm: FormState = {
  name: '',
  description: '',
  price: '',
  discountPercentage: '0',
  stock: '',
  imageUrl: '',
  categoryId: '',
};

const inputCls =
  'w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600';
const labelCls = 'block text-xs font-bold uppercase text-slate-500 mb-1';

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-500 text-white">
        Rupture
      </span>
    );
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-500 dark:bg-red-900/30">
        Faible · {stock}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
      En stock · {stock}
    </span>
  );
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async (): Promise<void> => {
    try {
      setError('');
      const [prods, cats] = await Promise.all([fetchVendorProducts(), fetchCategories()]);
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (e) {
      console.error(e);
      setError('Impossible de charger vos annonces. Vérifiez que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  // Recherche par nom + filtre par catégorie, en temps réel
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchName = !q || p.name.toLowerCase().includes(q);
      const matchCategory = categoryFilter === 'all' || String(p.category?.id) === categoryFilter;
      return matchName && matchCategory;
    });
  }, [products, search, categoryFilter]);

  // Calcul dynamique du prix effectif pour la prévisualisation du formulaire
  const previewPrice = useMemo(() => {
    const price = Number(form.price) || 0;
    const discount = Math.min(Math.max(Number(form.discountPercentage) || 0, 0), 100);
    return price * (1 - discount / 100);
  }, [form.price, form.discountPercentage]);

  const previewSaving = useMemo(() => (Number(form.price) || 0) - previewPrice, [form.price, previewPrice]);

  const openCreate = (): void => {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0] ? String(categories[0].id) : '' });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (p: Product): void => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: String(p.price),
      discountPercentage: String(p.discountPercentage ?? 0),
      stock: String(p.stock),
      imageUrl: p.imageUrl ?? '',
      categoryId: String(p.category?.id ?? ''),
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = (): void => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormError('');

    const payload: ProductPayload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountPercentage: Number(form.discountPercentage) || 0,
      stock: Number(form.stock),
      imageUrl: form.imageUrl.trim(),
      categoryId: Number(form.categoryId),
    };

    if (!payload.categoryId) {
      setFormError('Veuillez choisir une catégorie.');
      return;
    }
    if (!(payload.price > 0)) {
      setFormError('Le prix doit être supérieur à 0.');
      return;
    }
    if ((payload.discountPercentage ?? 0) < 0 || (payload.discountPercentage ?? 0) > 100) {
      setFormError('La réduction doit être comprise entre 0 et 100 %.');
      return;
    }
    if (!Number.isInteger(payload.stock) || payload.stock < 0) {
      setFormError('Le stock doit être un entier positif ou nul.');
      return;
    }

    setSaving(true);
    try {
      if (editingId !== null) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      console.error(err);
      setFormError("Échec de l'enregistrement. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Product): Promise<void> => {
    if (!window.confirm(`Supprimer définitivement « ${p.name} » ?`)) return;
    setDeletingId(p.id);
    try {
      await deleteProduct(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err) {
      console.error(err);
      setError('Suppression impossible. Veuillez réessayer.');
    } finally {
      setDeletingId(null);
    }
  };

  const resetFilters = (): void => {
    setSearch('');
    setCategoryFilter('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-white">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold">Mes annonces</h1>
              <p className="text-sm text-slate-500 mt-1">
                {products.length} produit{products.length > 1 ? 's' : ''} publié{products.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Plus size={18} /> Nouveau produit
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 flex items-center gap-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-semibold">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {/* Recherche & filtres */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un produit par nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${inputCls} pl-10 bg-white dark:bg-slate-900`}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`${inputCls} sm:w-56 bg-white dark:bg-slate-900`}
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tableau des produits */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
                <PackageOpen size={40} />
                <p className="text-sm">Aucun produit trouvé.</p>
                {(search || categoryFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full text-sm min-w-205">
                <thead>
                  <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <th className="p-4">Produit</th>
                    <th className="p-4">Catégorie</th>
                    <th className="p-4">Prix original</th>
                    <th className="p-4">Prix effectif</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const effective = getEffectivePrice(p);
                    const hasDiscount = (p.discountPercentage ?? 0) > 0;
                    return (
                      <tr key={p.id} className="border-b last:border-0 border-slate-100 dark:border-slate-800">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.imageUrl || IMAGE_FALLBACK}
                              alt={p.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = IMAGE_FALLBACK;
                              }}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
                            />
                            <span className="font-semibold">{p.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500">{p.category?.name ?? '—'}</td>
                        <td className={`p-4 ${hasDiscount ? 'line-through text-slate-400' : ''}`}>
                          {fcfa(p.price)}
                        </td>
                        <td className="p-4 font-bold text-emerald-500">
                          {fcfa(effective)}
                          {hasDiscount && <span className="ml-1 text-xs">(-{p.discountPercentage}%)</span>}
                        </td>
                        <td className="p-4">
                          <StockBadge stock={p.stock ?? 0} />
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(p)}
                              aria-label={`Éditer ${p.name}`}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(p)}
                              disabled={deletingId === p.id}
                              aria-label={`Supprimer ${p.name}`}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                            >
                              {deletingId === p.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <Footer />

      {/* Modal création / édition */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingId !== null ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button type="button" onClick={closeModal} aria-label="Fermer">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-xs font-semibold">
                {formError}
              </div>
            )}

            <div>
              <label className={labelCls}>Nom</label>
              <input
                required
                type="text"
                placeholder="Ex: Casque Bluetooth"
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea
                required
                rows={3}
                placeholder="Décrivez votre produit..."
                className={inputCls}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Prix (FCFA)</label>
                <input
                  required
                  type="number"
                  min={0}
                  step="any"
                  className={inputCls}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Réduction (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  className={inputCls}
                  value={form.discountPercentage}
                  onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                />
              </div>
            </div>

            {/* Prévisualisation du prix effectif */}
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Prix effectif affiché aux clients</span>
                <span className="font-black text-emerald-500">{fcfa(previewPrice)}</span>
              </div>
              {previewSaving > 0 && (
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Économie pour le client</span>
                  <span className="font-semibold text-emerald-500">-{fcfa(previewSaving)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Stock</label>
                <input
                  required
                  type="number"
                  min={0}
                  step={1}
                  className={inputCls}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Catégorie</label>
                <select
                  required
                  className={inputCls}
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                >
                  <option value="" disabled>
                    Choisir...
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>URL de l&apos;image</label>
              <input
                required
                type="url"
                placeholder="https://..."
                className={inputCls}
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white text-sm font-bold transition-all"
              >
                {saving ? 'Enregistrement...' : editingId !== null ? 'Mettre à jour' : 'Publier'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}