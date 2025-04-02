"use client";
import { useState, useEffect } from "react";
import { Search, Filter, AlertTriangle, Check } from "lucide-react";
import toast from "react-hot-toast";
import { Produit, Stock } from "../data/type";
import Inventory from "@/components/Inventory";

export default function Stocks() {
  const [stocksList, setStocksList] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isInventoryMode, setIsInventoryMode] = useState(false); // Mode inventaire

  useEffect(() => {
    setLoading(true);

    // Fetch stocks
    fetch("http://localhost:8081/api/stocks")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la récupération des stocks");
        return res.json();
      })
      .then((data: Stock[]) => {
        console.log("Données des stocks :", data); // Log pour vérifier les données
        setStocksList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        toast.error("Impossible de charger les stocks");
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleUpdateStock = (idStock: number, newQuantity: number) => {
    // Mettre à jour la quantité dans la liste des stocks
    setStocksList((prevStocks) =>
      prevStocks.map((stock) =>
        stock.idStock === idStock
          ? { ...stock, quantiteDisponible: newQuantity }
          : stock
      )
    );

    // Envoyer la mise à jour au serveur (optionnel)
    fetch(`http://localhost:8081/api/stocks/${idStock}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantiteDisponible: newQuantity }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la mise à jour du stock");
        toast.success("Quantité mise à jour avec succès !");
      })
      .catch((error) => {
        console.error("Erreur:", error);
        toast.error("Impossible de mettre à jour la quantité");
      });
  };

  const getStockStatus = (stock: Stock) => {
    const ratio = stock.quantiteDisponible / stock.quantiteVoulue;

    if (ratio >= 0.8) {
      return { status: "Optimal", color: "bg-green-100 text-green-800", icon: Check };
    } else if (ratio >= 0.5) {
      return { status: "Attention", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle };
    } else {
      return { status: "Critique", color: "bg-red-100 text-red-800", icon: AlertTriangle };
    }
  };

  const filteredStocks = stocksList.filter((stock) => {
    const produit = stock.produit;

    const matchesSearch = produit.nomProduit
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || produit.categorie === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Stocks</h1>
        <button
          onClick={() => setIsInventoryMode(!isInventoryMode)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isInventoryMode ? "Quitter l'inventaire" : "Faire l'inventaire"}
        </button>
      </div>

      {isInventoryMode ? (
        <Inventory stocks={stocksList} onUpdateStock={handleUpdateStock} />
      ) : (
        <>
          {/* Filtres */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Toutes les catégories</option>
                  {Array.from(new Set(stocksList.map((stock) => stock.produit.categorie))).map(
                    (category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Tableau des stocks */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité disponible
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité voulue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStocks.map((stock) => {
                    const produit = stock.produit;
                    const stockStatus = getStockStatus(stock);
                    const StatusIcon = stockStatus.icon;

                    return (
                      <tr key={stock.idStock}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{produit.nomProduit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{produit.categorie}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{stock.quantiteDisponible}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{stock.quantiteVoulue}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {stockStatus.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStocks.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Aucun stock trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

