"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Package, AlertTriangle, ShoppingCart, CreditCard } from "lucide-react";
import { Produit } from "../data/type"; // Assure-toi d'importer le type Produit

type Purchase = {
  id: string;
  produitId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  purchaseDate: string;
};

type Sale = {
  id: string;
  produitId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleDate: string;
};

type DashboardStats = {
  totalProduits: number;
  lowStockProduits: number;
  depensesAnnee: number;
  recettesAnnee: number;
  depensesSemaine: number;
  recettesSemaine: number;
  stockStatus: {
    optimal: number;
    warning: number;
    critical: number;
  };
  ventesMensuelles: number[]; // <-- Ajoute ceci
  // Si tu veux afficher les achats/ventes récents, ajoute-les ici
  recentPurchases: Purchase[];
  recentSales: Sale[];
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState<Produit[]>([]); // <-- Ajoute ceci

  useEffect(() => {
    fetch("http://localhost:8081/api/dashboard")
      .then((res) => {
        if (!res.ok)
          throw new Error(
            "Erreur lors de la récupération des stats du dashboard"
          );
        return res.json();
      })
      .then((data: DashboardStats) => {
        // Correction du mapping pour les achats récents
        data.recentPurchases = data.recentPurchases.map((purchase: any) => ({
          ...purchase,
          purchaseDate: purchase.purchaseDate || purchase.dateAchat,
          produitId:
            purchase.produitId || purchase.produit?.idProduit?.toString(),
          totalPrice: purchase.totalPrice ?? purchase.prixTotal,
          quantity: purchase.quantity ?? purchase.quantite,
        }));
        data.recentSales = data.recentSales.map((sale: any) => ({
          ...sale,
          saleDate: sale.saleDate || sale.dateVente,
          produitId: sale.produitId || sale.produit?.idProduit?.toString(),
          totalPrice: sale.totalPrice ?? sale.prixTotal,
          quantity: sale.quantity ?? sale.quantite,
        }));
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Ajoute ce useEffect pour charger les produits
  useEffect(() => {
    fetch("http://localhost:8081/api/produits")
      .then((res) => res.json())
      .then((data: Produit[]) => setProduits(data));
  }, []);

  // Ajoute cette fonction utilitaire
  const getProduitById = (id: string) =>
    produits.find((p) => p.idProduit?.toString() === id);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stockStatusData = [
    { name: "Optimal", value: stats.stockStatus.optimal, color: "#10b981" },
    { name: "Attention", value: stats.stockStatus.warning, color: "#f59e0b" },
    { name: "Critique", value: stats.stockStatus.critical, color: "#ef4444" },
  ];

  const monthLabels = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  const salesData = stats.ventesMensuelles.map((value, idx) => ({
    name: monthLabels[idx],
    value,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Produits</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalProduits}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Stock Faible</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.lowStockProduits}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-emerald-100 p-3 mr-4">
            <ShoppingCart className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Achats</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.depensesAnnee.toFixed(2)} €
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Ventes</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.recettesAnnee.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            État du Stock
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ventes Mensuelles
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Ventes (€)" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achats récents */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Achats Récents
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentPurchases.map((purchase) => {
              const produit = getProduitById(purchase.produitId);
              return (
                <div
                  key={purchase.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {produit?.nomProduit}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(purchase.purchaseDate).toLocaleDateString()} -{" "}
                      {purchase.quantity} {produit?.conditionnement}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    {purchase.totalPrice?.toFixed(2)} €
                  </p>
                </div>
              );
            })}
            {stats.recentPurchases.length === 0 && (
              <div className="px-6 py-4 text-center text-gray-500">
                Aucun achat récent
              </div>
            )}
          </div>
        </div>

        {/* Ventes récentes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Ventes Récentes
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentSales.map((sale) => {
              const produit = getProduitById(sale.produitId);
              return (
                <div
                  key={sale.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {produit?.nomProduit}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(sale.saleDate).toLocaleDateString()} -{" "}
                      {sale.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    {sale.totalPrice?.toFixed(2)} €
                  </p>
                </div>
              );
            })}
            {stats.recentSales.length === 0 && (
              <div className="px-6 py-4 text-center text-gray-500">
                Aucune vente récente
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Low Stock Alert */}
      {stats.lowStockProduits > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <span className="font-medium">Alerte stock faible!</span>{" "}
                {stats.lowStockProduits} produits ont un niveau de stock
                critique.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
