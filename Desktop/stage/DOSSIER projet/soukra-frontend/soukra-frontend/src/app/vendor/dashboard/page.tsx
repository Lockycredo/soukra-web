'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Wallet, ShoppingBag, Package, TrendingUp, Loader2, Radio, AlertTriangle, Inbox } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  fetchVendorStats,
  fetchVendorRecentOrders,
  type VendorStats,
  type RecentOrder,
} from '@/lib/api';

const POLLING_MS = 10_000; // rafraîchissement automatique toutes les 10 secondes
const MAX_RECENT_ORDERS = 10;

const fcfa = (n: number | undefined | null): string =>
  `${Math.round(Number(n) || 0).toLocaleString('fr-FR')} FCFA`;

// Accepte une date ISO ("2026-09-28") comme un libellé libre ("Lun")
const shortDate = (d: string): string => {
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

const formatDateTime = (d?: string): string => {
  if (!d) return '—';
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? d : date.toLocaleString('fr-FR');
};

const cardCls =
  'bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6';

const STATUS_STYLES: Record<string, string> = {
  PAID: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30',
  DELIVERED: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30',
  PENDING: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
  CANCELLED: 'bg-red-100 text-red-500 dark:bg-red-900/30',
};

type Kpi = {
  label: string;
  value: string;
  icon: typeof Wallet;
  color: string;
};

export default function VendorDashboardPage() {
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let active = true;

    const refresh = async (): Promise<void> => {
      try {
        const [s, o] = await Promise.all([fetchVendorStats(), fetchVendorRecentOrders()]);
        if (!active) return;
        setStats(s);
        // Tri décroissant + limite côté client, au cas où l'API renvoie toutes les commandes
        const list = Array.isArray(o) ? [...o] : [];
        list.sort((a, b) => b.id - a.id);
        setOrders(list.slice(0, MAX_RECENT_ORDERS));
        setError('');
        setLastUpdate(new Date());
      } catch (e) {
        console.error(e);
        if (active) setError('Impossible de charger les statistiques. Nouvelle tentative automatique...');
      } finally {
        if (active) setLoading(false);
      }
    };

    refresh();
    const timer = setInterval(refresh, POLLING_MS);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const kpis: Kpi[] = useMemo(() => {
    if (!stats) return [];
    return [
      {
        label: "Chiffre d'affaires",
        value: fcfa(stats.totalRevenue),
        icon: Wallet,
        color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
      },
      {
        label: 'Commandes',
        value: Number(stats.totalOrders ?? 0).toLocaleString('fr-FR'),
        icon: ShoppingBag,
        color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      },
      {
        label: 'Articles vendus',
        value: Number(stats.productsSold ?? 0).toLocaleString('fr-FR'),
        icon: Package,
        color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      },
      {
        label: 'Panier moyen',
        value: fcfa(stats.averageOrderValue),
        icon: TrendingUp,
        color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
      },
    ];
  }, [stats]);

  const salesData = stats?.salesData ?? [];
  const categorySales = stats?.categorySales ?? [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-white">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-3xl font-extrabold">Tableau de bord vendeur</h1>
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <Radio size={14} className="text-emerald-500 animate-pulse" />
              {lastUpdate ? `Mis à jour à ${lastUpdate.toLocaleTimeString('fr-FR')}` : 'Connexion...'}
            </span>
          </div>

          {error && (
            <div className="p-4 flex items-center gap-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-semibold">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-32 text-slate-400">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : (
            stats && (
              <>
                {/* Cartes KPI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpis.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className={`${cardCls} flex items-center gap-4`}>
                      <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon size={22} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
                        <p className="text-lg font-black truncate">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Graphiques */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={`${cardCls} lg:col-span-2`}>
                    <h2 className="text-lg font-bold mb-4">Évolution du chiffre d&apos;affaires et des ventes</h2>
                    {salesData.length === 0 ? (
                      <p className="text-sm text-slate-400 py-20 text-center">Pas encore de données de ventes.</p>
                    ) : (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={salesData}>
                            <defs>
                              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                            <XAxis dataKey="date" tickFormatter={shortDate} fontSize={12} />
                            <YAxis
                              yAxisId="left"
                              fontSize={12}
                              tickFormatter={(v: number) => v.toLocaleString('fr-FR')}
                            />
                            <YAxis yAxisId="right" orientation="right" fontSize={12} allowDecimals={false} />
                            <Tooltip
                              labelFormatter={(label) => shortDate(String(label))}
                              formatter={(value, name) =>
                                name === "Chiffre d'affaires" ? fcfa(Number(value)) : value
                              }
                            />
                            <Legend />
                            <Area
                              yAxisId="left"
                              type="monotone"
                              dataKey="revenue"
                              name="Chiffre d'affaires"
                              stroke="#10b981"
                              strokeWidth={2}
                              fill="url(#revenueGradient)"
                            />
                            <Area
                              yAxisId="right"
                              type="monotone"
                              dataKey="salesCount"
                              name="Ventes"
                              stroke="#2563eb"
                              strokeWidth={2}
                              fill="url(#salesGradient)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  <div className={cardCls}>
                    <h2 className="text-lg font-bold mb-4">Ventes par catégorie</h2>
                    {categorySales.length === 0 ? (
                      <p className="text-sm text-slate-400 py-20 text-center">Pas encore de données.</p>
                    ) : (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categorySales}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                            <XAxis dataKey="categoryName" fontSize={11} />
                            <YAxis fontSize={12} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="totalSales" name="Ventes" fill="#2563eb" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>

                {/* Commandes récentes (polling) */}
                <div className={cardCls}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Commandes récentes</h2>
                    <span className="text-xs text-slate-400">Actualisation toutes les {POLLING_MS / 1000} s</span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                      <Inbox size={32} />
                      <p className="text-sm">Aucune commande pour le moment.</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                      {orders.map((o) => (
                        <li key={o.id} className="flex items-center justify-between py-3 text-sm gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold truncate">
                              #{o.id} · {o.customerName}
                            </p>
                            <p className="text-xs text-slate-400">{formatDateTime(o.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {o.status && (
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  STATUS_STYLES[o.status] ?? 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                }`}
                              >
                                {o.status}
                              </span>
                            )}
                            <span className="font-black text-emerald-500">{fcfa(o.totalAmount)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}