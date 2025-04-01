import React, { useState } from "react";
import { Produit } from "../data/type"; // Ajuste le chemin

export default function CreateProduit() {
  // On stocke les valeurs du formulaire au format string pour pouvoir
  // récupérer la saisie utilisateur, puis on convertira en number quand on POST.
  const [formData, setFormData] = useState({
    nomProduit: "",
    categorie: "",
    conditionnement: "",
    prixAchatHt: "",
    tva: "",
    prixVenteTtc: "",
    margeTotale: "",
  });

  const [message, setMessage] = useState("");

  // Fonction pour gérer le changement dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convertir les champs string en nombre
    const payload: Omit<Produit, "idProduit"> = {
      nomProduit: formData.nomProduit,
      categorie: formData.categorie,
      conditionnement: formData.conditionnement,
      prixAchatHt: parseFloat(formData.prixAchatHt),
      tva: parseFloat(formData.tva),
      prixVenteTtc: parseFloat(formData.prixVenteTtc),
      margeTotale: parseFloat(formData.margeTotale),
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

      const createdProduit = await response.json(); // L'objet créé, renvoyé par le backend
      setMessage(
        `Produit créé avec succès : ${createdProduit.nomProduit} (ID: ${createdProduit.idProduit})`
      );

      // Réinitialiser le formulaire
      setFormData({
        nomProduit: "",
        categorie: "",
        conditionnement: "",
        prixAchatHt: "",
        tva: "",
        prixVenteTtc: "",
        margeTotale: "",
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
          <input
            type="text"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Conditionnement :</label>
          <input
            type="text"
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
            name="prixAchatHt"
            step="0.01"
            value={formData.prixAchatHt}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">TVA :</label>
          <input
            type="number"
            name="tva"
            step="0.01"
            value={formData.tva}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Prix Vente TTC :</label>
          <input
            type="number"
            name="prixVenteTtc"
            step="0.01"
            value={formData.prixVenteTtc}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Marge Totale :</label>
          <input
            type="number"
            name="margeTotale"
            step="0.01"
            value={formData.margeTotale}
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
