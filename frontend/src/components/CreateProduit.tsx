import React, { useState, useEffect } from "react";
import { Produit } from "../data/type";

interface CreateProduitProps {
  onProduitCreated: (produit: Produit) => void;
}

export default function CreateProduit({
  onProduitCreated,
}: CreateProduitProps) {
  const [formData, setFormData] = useState({
    nomProduit: "",
    categorie: "",
    conditionnement: "",
    prixAchatHt: "",
    tva: "",
    prixVenteTtc: "",
    margeTotale: "",
    quantiteVoulue: "",
  });

  const [message, setMessage] = useState("");

  // Liste des catégories prédéfinies
  const categorieOptions = [
    "Sirop",
    "Cannette / Jus",
    "Consommable Sucré",
    "Consommable Salé",
    "Café / Thé",
    "Viennoiserie",
    "Autre",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Omit<Produit, "idProduit"> = {
      nomProduit: formData.nomProduit,
      categorie: formData.categorie,
      conditionnement: parseFloat(formData.conditionnement),
      prixAchatHt: parseFloat(formData.prixAchatHt),
      tva: parseFloat(formData.tva),
      prixVenteTtc: parseFloat(formData.prixVenteTtc),
      margeTotale:
        parseFloat(formData.prixVenteTtc) -
        parseFloat(formData.prixAchatHt) * (1 + parseFloat(formData.tva) / 100),
      quantiteVoulue: parseFloat(formData.quantiteVoulue),
    };

    try {
      const response = await fetch("http://localhost:8081/api/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du produit");
      }

      const createdProduit = await response.json();

      onProduitCreated(createdProduit);

      setMessage(
        `Produit créé avec succès : ${createdProduit.nomProduit} (ID: ${createdProduit.idProduit})`
      );

      setFormData({
        nomProduit: "",
        categorie: "",
        conditionnement: "",
        prixAchatHt: "",
        tva: "",
        prixVenteTtc: "",
        margeTotale: "",
        quantiteVoulue: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("Échec de la création du produit");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Créer un nouveau produit</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label className="block mb-1">Nom du Produit :</label>
          <input
            type="text"
            name="nomProduit"
            required
            value={formData.nomProduit}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Catégorie :</label>
          <select
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            required
            className="border p-1 w-full"
          >
            <option value="">Sélectionnez une catégorie</option>
            {categorieOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Conditionnement :</label>
          <input
            type="number"
            name="conditionnement"
            value={formData.conditionnement}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Prix Achat HT :</label>
          <input
            type="number"
            name="prixAchatHt" // <-- corrige ici
            step="0.01"
            value={formData.prixAchatHt}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">TVA :</label>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-3 py-1 rounded border ${
                formData.tva === "5.5"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800"
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, tva: "5.5" }))}
            >
              5.5%
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded border ${
                formData.tva === "20"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800"
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, tva: "20" }))}
            >
              20%
            </button>
          </div>
        </div>

        <div>
          <label className="block mb-1">Prix Vente TTC :</label>
          <input
            type="number"
            name="prixVenteTtc" // <-- corrige ici
            step="0.01"
            value={formData.prixVenteTtc}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Quantité voulue :</label>
          <input
            type="number"
            name="quantiteVoulue"
            step="0.01"
            value={formData.quantiteVoulue}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Créer
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
