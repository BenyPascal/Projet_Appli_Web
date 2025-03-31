"use client";
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import CreateProduct from "@/components/CreateProduct";

// Exemple de catégories statiques (si besoin de filtrer en front)
const categories = ["Sirop", "Boisson", "Autre"];

// Type minimal pour un produit
export interface Product {
  idProduct: number;
  nomProduit: string;
  categorie: string;
  conditionnement: string;
  prixAchatHt?: number;
  tva: number;
  prixVenteTtc: number;
  margeTotale: number;
}

/**
 * Composant principal : affiche la liste des produits de la base
 * via un endpoint GET /api/produits sur le backend Spring Boot
 */
export default function Products() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Recherche & Catégorie
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // useEffect : aller chercher la liste depuis le backend
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8081/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }
        return response.json();
      })
      .then((data: Product[]) => {
        setProductsList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        toast.error("Impossible de charger les produits");
        setLoading(false);
      });
  }, []);

  // Gestion de la barre de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Gestion du select catégorie
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Filtrage en front : nom + reference + catégorie
  const filteredProducts = productsList.filter((product) => {
    const matchesSearch =
      product.nomProduit.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.categorie === selectedCategory;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
      </div>

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
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des produits */}
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
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conditionnement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.idProduct}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.nomProduit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.categorie}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.prixVenteTtc.toFixed(2)} €</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.conditionnement}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.tva || "N/A"}</div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun produit trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div>
      <CreateProduct/>
      </div>
    </div>
    
  );
}
