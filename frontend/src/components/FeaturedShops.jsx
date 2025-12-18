import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function FeaturedShops({ requireLogin = false, maxShops = null }) {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shops.php');
      const data = await response.json();

      if (data.success) {
        const shopList = data.shops || [];
        // Limit shops if maxShops is specified
        setShops(maxShops ? shopList.slice(0, maxShops) : shopList);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitShop = (shopId) => {
    if (requireLogin) {
      // Check if user is logged in
      const user = localStorage.getItem('user');

      if (!user) {
        // Not logged in - show alert and redirect to login
        alert('Please login to view shop details');
        navigate('/login');
        return;
      }
    }

    // Navigate to shop details
    navigate(`/shop/${shopId}`);
  };

  return (
    <section className="featured-shops">
      <h1 className="section-title">Featured Shops</h1>

      {loading ? (
        <div className="loading">Loading shops...</div>
      ) : shops.length === 0 ? (
        <div className="no-shops">No shops available yet.</div>
      ) : (
        <div className="shops-grid">
          {shops.map((shop) => (
            <div key={shop.shop_id} className="shop-card">
              <div className="shop-logo">
                {shop.logo_url ? (
                  <img src={shop.logo_url} alt={shop.shop_name} />
                ) : (
                  <div className="shop-logo-placeholder">
                    {shop.shop_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="shop-name">{shop.shop_name}</h3>
              <p className="shop-description">
                {shop.description || 'Quality products at great prices'}
              </p>
              <button
                className="shop-btn"
                onClick={() => handleVisitShop(shop.shop_id)}
              >
                Visit Shop
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedShops;
