import { useState } from "react";
import { CategorieProduit } from "../data/type";
import toast from "react-hot-toast";

interface CreateCategorieProduitProps {
  onCategorieCreated?: (categorie: CategorieProduit) => void;
}

export default function CreateCategorieProduit({
  onCategorieCreated,
}: CreateCategorieProduitProps) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      toast.error("Le nom est obligatoire");
      return;
    }
    setLoading(true);
    const res = await fetch("http://localhost:8081/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, description }),
    });
    setLoading(false);
    if (res.ok) {
      const newCat = await res.json();
      toast.success("Catégorie créée !");
      setNom("");
      setDescription("");
      onCategorieCreated?.(newCat);
    } else {
      toast.error("Erreur lors de la création");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow max-w-sm"
    >
      <h2 className="text-lg font-bold mb-2">Créer une catégorie</h2>
      <div>
        <label className="block mb-1">Nom *</label>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="border p-1 w-full"
        />
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-1 w-full"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
