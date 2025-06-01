import React, { useState, useEffect } from "react";
import { Facture } from "../data/type";
import toast from "react-hot-toast";

const Invoices = () => {
  const [invoices, setInvoices] = useState<Facture[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [issueDate, setIssueDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/api/factures")
      .then((res) => res.json())
      .then(setInvoices);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !issueDate) {
      toast.error("PDF et date obligatoires");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("issueDate", issueDate);
    if (supplier) formData.append("supplier", supplier);
    if (totalAmount) formData.append("totalAmount", totalAmount);

    const res = await fetch("http://localhost:8081/api/factures/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      toast.success("Facture uploadée !");
      const newInvoice = await res.json();
      setInvoices((prev) => [newInvoice, ...prev]);
      setFile(null);
      setIssueDate("");
      setSupplier("");
      setTotalAmount("");
    } else {
      toast.error("Erreur lors de l'upload");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
      <form
        onSubmit={handleUpload}
        className="space-y-4 bg-white p-4 rounded shadow max-w-md"
      >
        <div>
          <label className="block mb-1">PDF *</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Date de la facture *</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Fournisseur</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Montant total (€)</label>
          <input
            type="number"
            step="0.01"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Liste des factures</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">PDF</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Fournisseur</th>
              <th className="px-4 py-2">Montant</th>
              <th className="px-4 py-2">Télécharger</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-4 py-2">{inv.fileName}</td>
                <td className="px-4 py-2">{inv.issueDate}</td>
                <td className="px-4 py-2">{inv.supplier || "-"}</td>
                <td className="px-4 py-2">
                  {inv.totalAmount?.toFixed(2) ?? "-"}
                </td>
                <td className="px-4 py-2">
                  <a
                    href={`http://localhost:8081/api/factures/file/${inv.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    PDF
                  </a>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  Aucune facture
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
