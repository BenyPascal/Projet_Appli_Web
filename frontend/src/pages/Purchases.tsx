"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Eye } from "lucide-react"
import { type Produit as ProduitApi } from "../data/type"
import toast from "react-hot-toast"

// Only the fields present in the backend response
interface Purchase {
  id: string
  produitId: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

const Purchases = () => {
  const [purchasesList, setPurchasesList] = useState<Purchase[]>([])
  const [produits, setProduits] = useState<ProduitApi[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null)
  const [formData, setFormData] = useState({
    produitId: "",
    quantity: "",
    unitPrice: "",
  })

  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:8081/api/achats")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des achats")
        return res.json()
      })
      .then((data) => {
        // Adapt mapping to backend response
        const mapped = Array.isArray(data)
          ? data.map((achat: any) => ({
              id: achat.idAchat?.toString() || "",
              produitId: achat.produit?.idProduit?.toString() || "",
              quantity: achat.quantite || 0,
              unitPrice: achat.prixUnitaire || 0,
              totalPrice: achat.prixTotal || 0,
            }))
          : []
        setPurchasesList(mapped)
        setLoading(false)
      })
      .catch(() => {
        toast.error("Erreur lors du chargement des achats")
        setLoading(false)
      })
  }, [])

  // Fetch products from backend and robustly map to Produit type
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8081/api/produits")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }
        return response.json();
      })
      .then((data: ProduitApi[]) => {
        setProduits(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        toast.error("Impossible de charger les produits");
        setLoading(false);
      });
  }, []);

  // Helper to get product by id from fetched produits
  const getProduitById = (id: string) => produits.find((p) => p.idProduit?.toString() === id)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredPurchases = purchasesList.filter((purchase) => {
    const produit = getProduitById(purchase.produitId)
    if (!produit) return false
    const matchesSearch =
      (produit.nomProduit || "").toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleAddPurchase = () => {
    setFormData({
      produitId: "",
      quantity: "",
      unitPrice: "",
    })
    setShowAddModal(true)
  }

  const handleViewPurchase = (purchase: Purchase) => {
    setCurrentPurchase(purchase)
    setShowViewModal(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.produitId || !formData.quantity) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }
    try {
      const params = new URLSearchParams()
      params.append("idProduit", formData.produitId)
      params.append("quantiteAchat", formData.quantity)
      const res = await fetch("http://localhost:8081/api/achats/ajouter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      })
      if (!res.ok) throw new Error("Erreur lors de l'ajout de l'achat")
      const achat = await res.json()
      setPurchasesList((prev) => [...prev, {
        id: achat.id?.toString() || (prev.length + 1).toString(),
        produitId: achat.produit?.id?.toString() || formData.produitId,
        quantity: achat.quantiteAchat || Number(formData.quantity),
        unitPrice: achat.prixUnitaire || Number(formData.unitPrice),
        totalPrice: achat.prixTotal || (Number(formData.quantity) * Number(formData.unitPrice)),
      }])
      setShowAddModal(false)
      toast.success("Achat ajouté avec succès")
    } catch (err) {
      toast.error("Erreur lors de l'ajout de l'achat")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Achats</h1>
        <button
          onClick={handleAddPurchase}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un achat
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un produit ou une facture..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix total</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => {
                const produit = getProduitById(purchase.produitId)
                return (
                  <tr key={purchase.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{produit?.nomProduit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{purchase.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{purchase.unitPrice.toFixed(2)} €</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{purchase.totalPrice.toFixed(2)} €</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewPurchase(purchase)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun achat trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Purchase Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Ajouter un achat</h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="produitId" className="block text-sm font-medium text-gray-700">
                            Produit *
                          </label>
                          <select
                            name="produitId"
                            id="produitId"
                            required
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={formData.produitId}
                            onChange={handleFormChange}
                          >
                            <option value="">Sélectionner un produit</option>
                            {produits && produits.length > 0 ? (
                              produits.map((produit: any) => (
                                <option key={produit.id || produit.idProduit} value={produit.id || produit.idProduit}>
                                  {produit.name || produit.nomProduit}
                                </option>
                              ))
                            ) : (
                              <option disabled>Aucun produit disponible</option>
                            )}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                            Quantité *
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            required
                            min="1"
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={formData.quantity}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div>
                          {/* <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">
                            Prix total (€) *
                          </label>
                          <input
                            type="number"
                            name="unitPrice"
                            id="unitPrice"
                            required
                            step="0.01"
                            min="0"
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={formData.unitPrice}
                            onChange={handleFormChange}
                          /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Purchase Modal */}
      {showViewModal && currentPurchase && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Détails de l'achat</h3>
                    <div className="mt-4 space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Produit</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {getProduitById(currentPurchase.produitId)?.nomProduit}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Quantité</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {currentPurchase.quantity} {getProduitById(currentPurchase.produitId)?.conditionnement}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Prix unitaire</p>
                            <p className="mt-1 text-sm text-gray-900">{currentPurchase.unitPrice.toFixed(2)} €</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Prix total</p>
                            <p className="mt-1 text-sm text-gray-900">{currentPurchase.totalPrice.toFixed(2)} €</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowViewModal(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Purchases

