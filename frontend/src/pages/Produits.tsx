"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import CreateProduit from "@/components/CreateProduit";
import { Produit } from "../data/type";

// Remplacer les catégories statiques par celles définies dans CreateProduit
const categories = [
  "Sirop",
  "Cannette / Jus",
  "Consommable Sucré",
  "Consommable Salé",
  "Café / Thé",
  "Viennoiserie",
  "Autre",
];

export default function Produits() {
  const [produitsList, setProduitsList] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour la fenêtre modale
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Produit | null>(null);
  const modalRef = useRef<HTMLDivElement>(null); // Référence pour la fenêtre modale

  const addProduit = (newProduit: Produit) => {
    setProduitsList((prevList) => [...prevList, newProduit]);
    setIsModalOpen(false); // Ferme la modal après ajout
    toast.success(`Produit ${newProduit.nomProduit} ajouté avec succès`);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8081/api/produits")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }
        return response.json();
      })
      .then((data: Produit[]) => {
        setProduitsList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        toast.error("Impossible de charger les produits");
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsModalOpen(false); // Ferme la fenêtre modale si on clique à l'extérieur
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen]);

  const handleEditProduit = (produit: Produit) => {
    setEditForm(produit);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editForm) return;
    const { name, value } = e.target;

    // Traiter les champs numériques
    if (name === "prixVenteTtc") {
      // Assurer que la valeur est un nombre valide
      const numValue = value === "" ? 0 : parseFloat(value);
      setEditForm({ ...editForm, [name]: numValue });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    try {
      // Créer une version nettoyée de l'objet à envoyer
      const produitToUpdate = {
        ...editForm,
        // S'assurer que prixVenteTtc est bien un nombre
        prixVenteTtc:
          typeof editForm.prixVenteTtc === "string"
            ? parseFloat(editForm.prixVenteTtc)
            : editForm.prixVenteTtc,
      };

      const response = await fetch(
        `http://localhost:8081/api/produits/${editForm.idProduit}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(produitToUpdate),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la modification");
      }

      // Récupérer le produit mis à jour du serveur
      const updatedProduit = await response.json();

      // Fermer la modal AVANT de mettre à jour l'état pour éviter des problèmes de rendu
      setIsEditModalOpen(false);

      // Mettre à jour la liste des produits
      setProduitsList((prevList) =>
        prevList.map((p) =>
          p.idProduit === updatedProduit.idProduit ? updatedProduit : p
        )
      );

      toast.success("Produit modifié avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la modification");
    }
  };

  const filteredProduits = produitsList.filter((produit) => {
    const matchesSearch = produit.nomProduit
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || produit.categorie === selectedCategory;
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
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des Produits
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ajouter un produit
          </button>
        </div>
      </div>

      {/* Modale pour ajouter un produit avec CreateProduit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-auto max-h-[90vh] relative"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
            >
              ✕
            </button>
            <CreateProduit onProduitCreated={addProduit} />
          </div>
        </div>
      )}

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
                  TVA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProduits.map((produit) => (
                <tr key={produit.idProduit}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {produit.nomProduit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {produit.categorie}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {produit.prixVenteTtc?.toFixed(2)} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {produit.conditionnement}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {produit.tva || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => handleEditProduit(produit)}
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProduits.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Aucun produit trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale de modification */}
      {isEditModalOpen && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Modifier le produit</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Nom du produit</label>
                <input
                  type="text"
                  name="nomProduit"
                  value={editForm.nomProduit}
                  onChange={handleEditChange}
                  className="border p-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Prix Vente TTC</label>
                <input
                  type="number"
                  name="prixVenteTtc"
                  value={editForm.prixVenteTtc}
                  onChange={handleEditChange}
                  className="border p-1 w-full"
                  required
                />
              </div>
              {/* Ajoute d'autres champs si besoin */}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
