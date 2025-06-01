import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Produits from "./pages/Produits";
import Stock from "./pages/Stock";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import ShoppingList from "./pages/ShoppingList";
import Invoices from "./pages/Invoices";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import HistoriquePrixPage from "./pages/HistoriquePrix";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="produits" element={<Produits />} />
            <Route path="stock" element={<Stock />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="sales" element={<Sales />} />
            <Route path="shopping-list" element={<ShoppingList />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="historique-prix" element={<HistoriquePrixPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
