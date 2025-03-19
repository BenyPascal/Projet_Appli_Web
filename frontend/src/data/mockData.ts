// Mock data for the application

// Product categories
export const categories = [
  "Boissons",
  "Snacks",
  "Confiseries",
  "Produits frais",
  "Produits d'entretien",
  "Fournitures",
  "Divers",
]

// Products
export interface Product {
  id: string
  name: string
  category: string
  price: number
  unit: string
  supplier: string
  reference: string
  createdAt: string
  updatedAt: string
}

export const products: Product[] = [
  {
    id: "1",
    name: "Coca-Cola",
    category: "Boissons",
    price: 1.2,
    unit: "Bouteille 33cl",
    supplier: "Distributeur A",
    reference: "COCA-33CL",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Eau minérale",
    category: "Boissons",
    price: 0.8,
    unit: "Bouteille 50cl",
    supplier: "Distributeur B",
    reference: "EAU-50CL",
    createdAt: "2023-01-15T10:35:00Z",
    updatedAt: "2023-01-15T10:35:00Z",
  },
  {
    id: "3",
    name: "Chips nature",
    category: "Snacks",
    price: 1.5,
    unit: "Paquet 100g",
    supplier: "Distributeur C",
    reference: "CHIPS-NAT",
    createdAt: "2023-01-16T09:20:00Z",
    updatedAt: "2023-01-16T09:20:00Z",
  },
  {
    id: "4",
    name: "Barre chocolatée",
    category: "Confiseries",
    price: 1.0,
    unit: "Unité",
    supplier: "Distributeur D",
    reference: "CHOCO-BAR",
    createdAt: "2023-01-16T09:25:00Z",
    updatedAt: "2023-01-16T09:25:00Z",
  },
  {
    id: "5",
    name: "Jus d'orange",
    category: "Boissons",
    price: 1.3,
    unit: "Bouteille 33cl",
    supplier: "Distributeur A",
    reference: "JUS-ORANGE",
    createdAt: "2023-01-17T11:10:00Z",
    updatedAt: "2023-01-17T11:10:00Z",
  },
  {
    id: "6",
    name: "Sandwich jambon-fromage",
    category: "Produits frais",
    price: 3.5,
    unit: "Unité",
    supplier: "Fournisseur local",
    reference: "SAND-JF",
    createdAt: "2023-01-17T11:15:00Z",
    updatedAt: "2023-01-17T11:15:00Z",
  },
  {
    id: "7",
    name: "Produit nettoyant multi-surfaces",
    category: "Produits d'entretien",
    price: 4.2,
    unit: "Flacon 750ml",
    supplier: "Distributeur E",
    reference: "NETT-MULTI",
    createdAt: "2023-01-18T14:30:00Z",
    updatedAt: "2023-01-18T14:30:00Z",
  },
  {
    id: "8",
    name: "Stylos bleus",
    category: "Fournitures",
    price: 0.8,
    unit: "Unité",
    supplier: "Distributeur F",
    reference: "STY-BLEU",
    createdAt: "2023-01-18T14:35:00Z",
    updatedAt: "2023-01-18T14:35:00Z",
  },
]

// Stock
export interface StockItem {
  id: string
  productId: string
  currentQuantity: number
  desiredQuantity: number
  lastUpdated: string
}

export const stock: StockItem[] = [
  {
    id: "1",
    productId: "1",
    currentQuantity: 45,
    desiredQuantity: 50,
    lastUpdated: "2023-03-10T15:30:00Z",
  },
  {
    id: "2",
    productId: "2",
    currentQuantity: 30,
    desiredQuantity: 40,
    lastUpdated: "2023-03-10T15:35:00Z",
  },
  {
    id: "3",
    productId: "3",
    currentQuantity: 15,
    desiredQuantity: 25,
    lastUpdated: "2023-03-11T09:20:00Z",
  },
  {
    id: "4",
    productId: "4",
    currentQuantity: 20,
    desiredQuantity: 30,
    lastUpdated: "2023-03-11T09:25:00Z",
  },
  {
    id: "5",
    productId: "5",
    currentQuantity: 25,
    desiredQuantity: 35,
    lastUpdated: "2023-03-12T11:10:00Z",
  },
  {
    id: "6",
    productId: "6",
    currentQuantity: 5,
    desiredQuantity: 10,
    lastUpdated: "2023-03-12T11:15:00Z",
  },
  {
    id: "7",
    productId: "7",
    currentQuantity: 3,
    desiredQuantity: 5,
    lastUpdated: "2023-03-13T14:30:00Z",
  },
  {
    id: "8",
    productId: "8",
    currentQuantity: 50,
    desiredQuantity: 50,
    lastUpdated: "2023-03-13T14:35:00Z",
  },
]

// Purchases
export interface Purchase {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  supplier: string
  purchaseDate: string
  invoiceNumber?: string
}

export const purchases: Purchase[] = [
  {
    id: "1",
    productId: "1",
    quantity: 50,
    unitPrice: 0.9,
    totalPrice: 45,
    supplier: "Distributeur A",
    purchaseDate: "2023-02-05T10:30:00Z",
    invoiceNumber: "INV-2023-001",
  },
  {
    id: "2",
    productId: "2",
    quantity: 40,
    unitPrice: 0.6,
    totalPrice: 24,
    supplier: "Distributeur B",
    purchaseDate: "2023-02-05T10:35:00Z",
    invoiceNumber: "INV-2023-002",
  },
  {
    id: "3",
    productId: "3",
    quantity: 30,
    unitPrice: 1.2,
    totalPrice: 36,
    supplier: "Distributeur C",
    purchaseDate: "2023-02-06T09:20:00Z",
    invoiceNumber: "INV-2023-003",
  },
  {
    id: "4",
    productId: "4",
    quantity: 40,
    unitPrice: 0.8,
    totalPrice: 32,
    supplier: "Distributeur D",
    purchaseDate: "2023-02-06T09:25:00Z",
    invoiceNumber: "INV-2023-004",
  },
  {
    id: "5",
    productId: "5",
    quantity: 35,
    unitPrice: 1.0,
    totalPrice: 35,
    supplier: "Distributeur A",
    purchaseDate: "2023-02-07T11:10:00Z",
    invoiceNumber: "INV-2023-005",
  },
  {
    id: "6",
    productId: "6",
    quantity: 15,
    unitPrice: 2.8,
    totalPrice: 42,
    supplier: "Fournisseur local",
    purchaseDate: "2023-02-07T11:15:00Z",
    invoiceNumber: "INV-2023-006",
  },
  {
    id: "7",
    productId: "7",
    quantity: 5,
    unitPrice: 3.5,
    totalPrice: 17.5,
    supplier: "Distributeur E",
    purchaseDate: "2023-02-08T14:30:00Z",
    invoiceNumber: "INV-2023-007",
  },
  {
    id: "8",
    productId: "8",
    quantity: 100,
    unitPrice: 0.5,
    totalPrice: 50,
    supplier: "Distributeur F",
    purchaseDate: "2023-02-08T14:35:00Z",
    invoiceNumber: "INV-2023-008",
  },
]

// Sales
export interface Sale {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  saleDate: string
  customer?: string
}

export const sales: Sale[] = [
  {
    id: "1",
    productId: "1",
    quantity: 5,
    unitPrice: 1.2,
    totalPrice: 6,
    saleDate: "2023-03-01T10:30:00Z",
  },
  {
    id: "2",
    productId: "2",
    quantity: 10,
    unitPrice: 0.8,
    totalPrice: 8,
    saleDate: "2023-03-01T11:15:00Z",
  },
  {
    id: "3",
    productId: "3",
    quantity: 8,
    unitPrice: 1.5,
    totalPrice: 12,
    saleDate: "2023-03-02T09:45:00Z",
  },
  {
    id: "4",
    productId: "4",
    quantity: 15,
    unitPrice: 1.0,
    totalPrice: 15,
    saleDate: "2023-03-02T14:20:00Z",
  },
  {
    id: "5",
    productId: "5",
    quantity: 7,
    unitPrice: 1.3,
    totalPrice: 9.1,
    saleDate: "2023-03-03T10:10:00Z",
  },
  {
    id: "6",
    productId: "6",
    quantity: 10,
    unitPrice: 3.5,
    totalPrice: 35,
    saleDate: "2023-03-03T12:30:00Z",
    customer: "Événement association",
  },
]

// Invoices
export interface Invoice {
  id: string
  invoiceNumber: string
  supplier: string
  totalAmount: number
  issueDate: string
  dueDate: string
  status: "Payée" | "En attente" | "En retard"
  purchaseIds: string[]
  fileUrl?: string
}

export const invoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2023-001",
    supplier: "Distributeur A",
    totalAmount: 45,
    issueDate: "2023-02-05T10:30:00Z",
    dueDate: "2023-03-05T10:30:00Z",
    status: "Payée",
    purchaseIds: ["1"],
    fileUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "2",
    invoiceNumber: "INV-2023-002",
    supplier: "Distributeur B",
    totalAmount: 24,
    issueDate: "2023-02-05T10:35:00Z",
    dueDate: "2023-03-05T10:35:00Z",
    status: "Payée",
    purchaseIds: ["2"],
    fileUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "3",
    invoiceNumber: "INV-2023-003",
    supplier: "Distributeur C",
    totalAmount: 36,
    issueDate: "2023-02-06T09:20:00Z",
    dueDate: "2023-03-06T09:20:00Z",
    status: "Payée",
    purchaseIds: ["3"],
    fileUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "4",
    invoiceNumber: "INV-2023-004",
    supplier: "Distributeur D",
    totalAmount: 32,
    issueDate: "2023-02-06T09:25:00Z",
    dueDate: "2023-03-06T09:25:00Z",
    status: "Payée",
    purchaseIds: ["4"],
    fileUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "5",
    invoiceNumber: "INV-2023-005",
    supplier: "Distributeur A",
    totalAmount: 35,
    issueDate: "2023-02-07T11:10:00Z",
    dueDate: "2023-03-07T11:10:00Z",
    status: "En attente",
    purchaseIds: ["5"],
    fileUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "6",
    invoiceNumber: "INV-2023-006",
    supplier: "Fournisseur local",
    totalAmount: 42,
    issueDate: "2023-02-07T11:15:00Z",
    dueDate: "2023-03-07T11:15:00Z",
    status: "En attente",
    purchaseIds: ["6"],
    fileUrl: "/placeholder.svg?height=300&width=200",
  },
]

// Shopping List
export interface ShoppingListItem {
  id: string
  productId: string
  quantityNeeded: number
  priority: "Haute" | "Moyenne" | "Basse"
  status: "À acheter" | "En cours" | "Acheté"
  createdAt: string
  updatedAt: string
}

export const shoppingList: ShoppingListItem[] = [
  {
    id: "1",
    productId: "1",
    quantityNeeded: 5,
    priority: "Moyenne",
    status: "À acheter",
    createdAt: "2023-03-15T10:30:00Z",
    updatedAt: "2023-03-15T10:30:00Z",
  },
  {
    id: "2",
    productId: "2",
    quantityNeeded: 10,
    priority: "Haute",
    status: "À acheter",
    createdAt: "2023-03-15T10:35:00Z",
    updatedAt: "2023-03-15T10:35:00Z",
  },
  {
    id: "3",
    productId: "3",
    quantityNeeded: 10,
    priority: "Basse",
    status: "À acheter",
    createdAt: "2023-03-16T09:20:00Z",
    updatedAt: "2023-03-16T09:20:00Z",
  },
  {
    id: "4",
    productId: "6",
    quantityNeeded: 5,
    priority: "Haute",
    status: "En cours",
    createdAt: "2023-03-16T09:25:00Z",
    updatedAt: "2023-03-16T09:25:00Z",
  },
]

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id)
}

// Helper function to get stock by product ID
export const getStockByProductId = (productId: string): StockItem | undefined => {
  return stock.find((item) => item.productId === productId)
}

// Helper function to get purchases by product ID
export const getPurchasesByProductId = (productId: string): Purchase[] => {
  return purchases.filter((purchase) => purchase.productId === productId)
}

// Helper function to get sales by product ID
export const getSalesByProductId = (productId: string): Sale[] => {
  return sales.filter((sale) => sale.productId === productId)
}

// Helper function to get invoice by ID
export const getInvoiceById = (id: string): Invoice | undefined => {
  return invoices.find((invoice) => invoice.id === id)
}

// Helper function to get shopping list items by product ID
export const getShoppingListItemsByProductId = (productId: string): ShoppingListItem[] => {
  return shoppingList.filter((item) => item.productId === productId)
}

// Dashboard statistics
export interface DashboardStats {
  totalProducts: number
  lowStockProducts: number
  totalPurchasesAmount: number
  totalSalesAmount: number
  recentPurchases: Purchase[]
  recentSales: Sale[]
  stockStatus: {
    optimal: number
    warning: number
    critical: number
  }
}

export const getDashboardStats = (): DashboardStats => {
  const totalProducts = products.length

  const lowStockProducts = stock.filter((item) => item.currentQuantity < item.desiredQuantity * 0.5).length

  const totalPurchasesAmount = purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0)

  const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.totalPrice, 0)

  const recentPurchases = [...purchases]
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 5)

  const recentSales = [...sales]
    .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
    .slice(0, 5)

  const stockStatus = {
    optimal: stock.filter((item) => item.currentQuantity >= item.desiredQuantity * 0.8).length,
    warning: stock.filter(
      (item) => item.currentQuantity >= item.desiredQuantity * 0.5 && item.currentQuantity < item.desiredQuantity * 0.8,
    ).length,
    critical: stock.filter((item) => item.currentQuantity < item.desiredQuantity * 0.5).length,
  }

  return {
    totalProducts,
    lowStockProducts,
    totalPurchasesAmount,
    totalSalesAmount,
    recentPurchases,
    recentSales,
    stockStatus,
  }
}

