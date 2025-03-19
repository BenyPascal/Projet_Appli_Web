"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Check, ShoppingCart, Trash2 } from "lucide-react"
import { shoppingList, products, type ShoppingListItem, getProductById, stock } from "../data/mockData"
import toast from "react-hot-toast"

const ShoppingList = () => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    productId: "",
    quantityNeeded: "",
    priority: "Moyenne",
  })

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setShoppingItems(shoppingList)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handlePriorityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value)
  }

  const filteredItems = shoppingItems.filter((item) => {
    const product = getProductById(item.productId)
    if (!product) return false

    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || item.status === statusFilter
    const matchesPriority = priorityFilter === "" || item.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleAddItem = () => {
    setFormData({
      productId: "",
      quantityNeeded: "",
      priority: "Moyenne",
    })
    setShowAddModal(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.productId || !formData.quantityNeeded) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    // Create new shopping list item
    const newItem: ShoppingListItem = {
      id: (shoppingItems.length + 1).toString(),
      productId: formData.productId,
      quantityNeeded: Number.parseInt(formData.quantityNeeded),
      priority: formData.priority as "Haute" | "Moyenne" | "Basse",
      status: "À acheter",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to list
    setShoppingItems([...shoppingItems, newItem])
    setShowAddModal(false)
    toast.success("Produit ajouté à la liste de courses")
  }

  const handleUpdateStatus = (item: ShoppingListItem, newStatus: "À acheter" | "En cours" | "Acheté") => {
    const updatedItems = shoppingItems.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }
      }
      return i
    })

    setShoppingItems(updatedItems)
    toast.success(`Statut mis à jour: ${newStatus}`)
  }

  const handleDeleteItem = (item: ShoppingListItem) => {
    const updatedItems = shoppingItems.filter((i) => i.id !== item.id)
    setShoppingItems(updatedItems)
    toast.success("Produit retiré de la liste de courses")
  }

  const generateShoppingList = () => {
    // Find products with low stock
    const lowStockItems = stock.filter((item) => item.currentQuantity < item.desiredQuantity * 0.7)

    // Create shopping list items for low stock products
    const newItems: ShoppingListItem[] = lowStockItems
      .map((stockItem, index) => {
        // Check if item is already in shopping list
        const existingItem = shoppingItems.find((item) => item.productId === stockItem.productId)
        if (existingItem) return null

        const quantityNeeded = stockItem.desiredQuantity - stockItem.currentQuantity

        return {
          id: (shoppingItems.length + index + 1).toString(),
          productId: stockItem.productId,
          quantityNeeded,
          priority: quantityNeeded > stockItem.desiredQuantity * 0.5 ? "Haute" : "Moyenne",
          status: "À acheter",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      })
      .filter(Boolean) as ShoppingListItem[]

    if (newItems.length === 0) {
      toast.info("Aucun produit à ajouter à la liste de courses")
      return
    }

    setShoppingItems([...shoppingItems, ...newItems])
    toast.success(`${newItems.length} produits ajoutés à la liste de courses`)
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
        <h1 className="text-2xl font-bold text-gray-900">Liste de Courses</h1>
        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={generateShoppingList}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Générer liste
          </button>
          <button
            onClick={handleAddItem}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </button>
        </div>
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
              placeholder="Rechercher un produit..."
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
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="">Tous les statuts</option>
              <option value="À acheter">À acheter</option>
              <option value="En cours">En cours</option>
              <option value="Acheté">Acheté</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={priorityFilter}
              onChange={handlePriorityFilterChange}
            >
              <option value="">Toutes les priorités</option>
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shopping List */}
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
                  Quantité nécessaire
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Priorité
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date d'ajout
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
              {filteredItems.map((item) => {
                const product = getProductById(item.productId)

                let priorityColor = ""
                if (item.priority === "Haute") {
                  priorityColor = "bg-red-100 text-red-800"
                } else if (item.priority === "Moyenne") {
                  priorityColor = "bg-yellow-100 text-yellow-800"
                } else {
                  priorityColor = "bg-green-100 text-green-800"
                }

                let statusColor = ""
                if (item.status === "À acheter") {
                  statusColor = "bg-gray-100 text-gray-800"
                } else if (item.status === "En cours") {
                  statusColor = "bg-blue-100 text-blue-800"
                } else {
                  statusColor = "bg-green-100 text-green-800"
                }

                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.quantityNeeded} {product?.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor}`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {item.status !== "Acheté" && (
                          <button
                            onClick={() => handleUpdateStatus(item, "Acheté")}
                            className="text-green-600 hover:text-green-900"
                            title="Marquer comme acheté"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        )}
                        {item.status === "À acheter" && (
                          <button
                            onClick={() => handleUpdateStatus(item, "En cours")}
                            className="text-blue-600 hover:text-blue-900"
                            title="Marquer comme en cours"
                          >
                            <ShoppingCart className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun produit dans la liste de courses
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
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
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Ajouter un produit à la liste de courses
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
                            Produit *
                          </label>
                          <select
                            name="productId"
                            id="productId"
                            required
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={formData.productId}
                            onChange={handleFormChange}
                          >
                            <option value="">Sélectionner un produit</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="quantityNeeded" className="block text-sm font-medium text-gray-700">
                            Quantité nécessaire *
                          </label>
                          <input
                            type="number"
                            name="quantityNeeded"
                            id="quantityNeeded"
                            required
                            min="1"
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={formData.quantityNeeded}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                            Priorité
                          </label>
                          <select
                            name="priority"
                            id="priority"
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={formData.priority}
                            onChange={handleFormChange}
                          >
                            <option value="Haute">Haute</option>
                            <option value="Moyenne">Moyenne</option>
                            <option value="Basse">Basse</option>
                          </select>
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
    </div>
  )
}

export default ShoppingList

