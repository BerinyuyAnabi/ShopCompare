import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ApiService from "./services/api";
import Header from "./components/header.jsx";
import Hero from "./components/Hero.jsx";
import ShopList from "./components/shoplist.jsx";
import Stats from "./components/stats.jsx";
import Footer from "./components/footer.jsx";
import Dashboard from "./components/dashboard.jsx";
import ProductDetail from "./components/product_detail.jsx";
import SignupForm from "./components/form.jsx";
import LoginForm from "./components/login.jsx";
import ShopSignup from "./components/ShopSignup.jsx";
import ShopDashboard from "./components/ShopDashboard.jsx";
import ShopDetails from "./components/shop_details.jsx";

function App() {
  // const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);

  // Test API connection on mount
  useEffect(() => {
    testApi();
    // loadProducts();
  }, []);

  const testApi = async () => {
    try {
      const result = await ApiService.testConnection();
      setApiStatus(result);
    } catch {
      setApiStatus({ status: "error", message: "Cannot connect to API" });
    }
  };

  // const loadProducts = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await ApiService.getProducts();
  //     setProducts(data);
  //     setError(null);
  //   } catch {
  //     setError("Failed to load products. Make sure MAMP is running!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this product?")) {
  //     try {
  //       await ApiService.deleteProduct(id);
  //       loadProducts(); // Reload products after deletion
  //     } catch {
  //       alert("Failed to delete product");
  //     }
  //   }
  // };

  // Home page component
  const HomePage = () => (
    <>
      <Header />
      <Hero />
      <ShopList />
      <Stats />
      <Dashboard/>
      <Footer />

    </>
  );

  // Product detail page wrapper
  const ProductDetailPage = () => {
    return <ProductDetail />;
  };

  // Determine basename based on environment
  const basename = import.meta.env.DEV ? '/' : '/~logan.anabi/ShopCompare/frontend/';

  return (
    <Router basename={basename}>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shop-dashboard" element={<ShopDashboard />} />
          <Route path="/shop/:shopId" element={<ShopDetails />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/storeSignup" element={<ShopSignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
