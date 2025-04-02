"use client";
import { useState } from "react";
import { Stock } from "../data/type";
import toast from "react-hot-toast";

interface InventoryProps {
  stocks: Stock[];
  onUpdateStock: (idStock: number, newQuantity: number) => void;
}

export default function Inventory({ stocks, onUpdateStock }: InventoryProps) {
  const [currentIndex, setCurrentIndex] = useState(0); // Index du produit actuel
  const [currentQuantity, setCurrentQuantity] = useState(""); // Quantité saisie par l'utilisateur

  // Trier les stocks par catégorie
  const sortedStocks = [...stocks].sort((a, b) =>
    a.produit.categorie.localeCompare(b.produit.categorie)
  );

  const currentStock = sortedStocks[currentIndex];

  const handleNext = () => {
    if (!currentQuantity) {
      toast.error("Veuillez entrer une quantité !");
      return;
    }

    // Mettre à jour la quantité via la fonction passée en prop
    onUpdateStock(currentStock.idStock, parseInt(currentQuantity, 10));

    // Réinitialiser la quantité et passer au produit suivant
    setCurrentQuantity("");
    if (currentIndex < sortedStocks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.success("Inventaire terminé !");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentStock) {
    return <div>Aucun produit à inventorier.</div>;
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Inventaire</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Catégorie : <span className="font-medium">{currentStock.produit.categorie}</span>
        </p>
        <p className="text-sm text-gray-500">
          Produit : <span className="font-medium">{currentStock.produit.nomProduit}</span>
        </p>
        <p className="text-sm text-gray-500">
          Quantité actuelle :{" "}
          <span className="font-medium">{currentStock.quantiteDisponible}</span>
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Nouvelle quantité
        </label>
        <input
          type="number"
          id="quantity"
          value={currentQuantity}
          onChange={(e) => setCurrentQuantity(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded ${
            currentIndex === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Précédent
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {currentIndex < sortedStocks.length - 1 ? "Suivant" : "Terminer"}
        </button>
      </div>
    </div>
  );
}