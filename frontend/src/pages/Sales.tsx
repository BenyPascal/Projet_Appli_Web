"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Eye } from "lucide-react"
import { sales, produits, type Sale, getProduitById } from "../data/mockData"
import toast from "react-hot-toast"

const Sales = () => {
  const [salesList, setSalesList] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentSale, setCurrentSale] = useState<Sale | null>(null)
  const [formData, setFormData] = useState({
    produitId: "",
    quantity: "",
    unitPrice: "",
    customer: "",
  })

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setSalesList(sales)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value)
  }

  const filteredSales = salesList.filter((sale) => {
    const produit = getProduitById(sale.produitId)
    if (!produit) return false

    const matchesSearch =
      produit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.customer && sale.customer.toLowerCase().includes(searchTerm.toLowerCase()))

    let matchesDate = true
    const saleDate = new Date(sale.saleDate)
    const today = new Date()

    if (dateFilter === "today") {
      matchesDate = saleDate.toDateString() === today.toDateString()
    } else if (dateFilter === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(today.getDate() - 7)
      matchesDate = saleDate >= weekAgo
    } else if (dateFilter === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(today.getMonth() - 1)
      matchesDate = saleDate >= monthAgo
    }

    return matchesSearch && matchesDate
  })

  const handleAddSale = () => {
    setFormData({
      produitId: "",
      quantity: "",
      unitPrice: "",
      customer: "",
    })
    setShowAddModal(true)
  }

  const handleViewSale = (sale: Sale) => {
    setCurrentSale(sale)
    setShowViewModal(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "produitId" && value) {
      const produit = getProduitById(value)
      if (produit) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          unitPrice: produit.price.toString(),
        }))
        return
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.produitId || !formData.quantity || !formData.unitPrice) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    // Calculate total price
    const quantity = Number.parseInt(formData.quantity)
    const unitPrice = Number.parseFloat(formData.unitPrice)
    const totalPrice = quantity * unitPrice

    // Create new sale
    const newSale: Sale = {
      id: (salesList.length + 1).toString(),
      produitId: formData.produitId,
      quantity,
      unitPrice,
      totalPrice,
      saleDate: new Date().toISOString(),
      customer: formData.customer || undefined,
    }

    // Add to list
    setSalesList([...salesList, newSale])
    setShowAddModal(false)
    toast.success("Vente ajoutée avec succès")
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
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Ventes</h1>
        <button
          onClick={handleAddSale}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une vente
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
              placeholder="Rechercher un produit ou un client..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              value={dateFilter}
              onChange={handleDateFilterChange}
            >
              <option value="">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Produit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantité
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Prix unitaire
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Prix total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Client
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date de vente
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => {
                const produit = getProduitById(sale.produitId)
                return (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{produit?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sale.quantity} {produit?.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sale.unitPrice.toFixed(2)} €</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sale.totalPrice.toFixed(2)} €</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{sale.customer || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(sale.saleDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleViewSale(sale)} className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune vente trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sale Modal */}
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
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Ajouter une vente</h3>
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
                            {produits.map((produit) => (
                              <option key={produit.id} value={produit.id}>
                                {produit.name}
                              </option>
                            ))}
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
                          <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">
                            Prix unitaire (€) *
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
                          />
                        </div>
                        <div>
                          <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                            Client
                          </label>
                          <input
                            type="text"
                            name="customer"
                            id="customer"
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={formData.customer}
                            onChange={handleFormChange}
                          />
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

      {/* View Sale Modal */}
      {showViewModal && currentSale && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Détails de la vente</h3>
                    <div className="mt-4 space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Produit</p>
                            <p className="mt-1 text-sm text-gray-900">{getProduitById(currentSale.produitId)?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Quantité</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {currentSale.quantity} {getProduitById(currentSale.produitId)?.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Prix unitaire</p>
                            <p className="mt-1 text-sm text-gray-900">{currentSale.unitPrice.toFixed(2)} €</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Prix total</p>
                            <p className="mt-1 text-sm text-gray-900">{currentSale.totalPrice.toFixed(2)} €</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Client</p>
                            <p className="mt-1 text-sm text-gray-900">{currentSale.customer || "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Date de vente</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {new Date(currentSale.saleDate).toLocaleDateString()}
                            </p>
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

export default Sales

