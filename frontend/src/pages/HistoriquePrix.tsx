import { useState, useEffect } from "react";
import { Produit, HistoriquePrix } from "../data/type";

export default function HistoriquePrixPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [selectedProduit, setSelectedProduit] = useState<number | "">("");
  const [historiques, setHistoriques] = useState<HistoriquePrix[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8081/api/produits")
      .then((res) => res.json())
      .then(setProduits);
  }, []);

  useEffect(() => {
    if (selectedProduit) {
      setLoading(true);
      fetch(
        `http://localhost:8081/api/historiques-prix/produit/${selectedProduit}`
      )
        .then((res) => res.json())
        .then((data) => {
          setHistoriques(data);
          setLoading(false);
        });
    } else {
      setHistoriques([]);
    }
  }, [selectedProduit]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Historique des prix</h1>
      <div className="max-w-xs">
        <label className="block mb-1">Sélectionner un produit :</label>
        <select
          className="border p-1 w-full"
          value={selectedProduit}
          onChange={(e) => setSelectedProduit(Number(e.target.value))}
        >
          <option value="">-- Choisir --</option>
          {produits.map((p) => (
            <option key={p.idProduit} value={p.idProduit}>
              {p.nomProduit}
            </option>
          ))}
        </select>
      </div>

      {loading && <div>Chargement...</div>}

      {historiques.length > 0 && (
        <div className="bg-white rounded shadow p-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">
            Évolution du prix pour{" "}
            {produits.find((p) => p.idProduit === selectedProduit)?.nomProduit}
          </h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Prix (€)</th>
                <th className="px-4 py-2 text-left">Début</th>
                <th className="px-4 py-2 text-left">Fin</th>
              </tr>
            </thead>
            <tbody>
              {historiques.map((h) => (
                <tr key={h.idHistoriquePrix}>
                  <td className="px-4 py-2">{h.prix.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {new Date(h.dateDebut).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {h.dateFin ? new Date(h.dateFin).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedProduit && historiques.length === 0 && !loading && (
        <div className="text-gray-500 mt-4">
          Aucun historique pour ce produit.
        </div>
      )}
    </div>
  );
}
