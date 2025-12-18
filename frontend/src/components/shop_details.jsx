import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/shop-page.css';
import ContactPopup from './ContactPopup';

const ShopDetails = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  useEffect(() => {
    fetchShopData();
    fetchShopProducts();
  }, [shopId]);

  const fetchShopData = async () => {
    try {
      const response = await fetch(`/api/shop.php?shop_id=${shopId}`);
      const data = await response.json();

      if (data.success) {
        setShop(data.shop);
      } else {
        setError('Shop not found');
      }
    } catch (err) {
      console.error('Error fetching shop data:', err);
      setError('Failed to load shop data');
    }
  };

  const fetchShopProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products.php?shop_id=${shopId}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (error) {
    return (
      <div className="shop-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleBackToDashboard} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <button onClick={handleBackToDashboard} className="back-to-dashboard">
          ← Back to Dashboard
        </button>

        {shop && (
          <div className="shop-info">
            <div className="shop-logo-large">
              {shop.logo_url ? (
                <img src={shop.logo_url} alt={shop.shop_name} />
              ) : (
                <div className="shop-logo-placeholder">
                  {shop.shop_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="shop-details">
              <h1>{shop.shop_name}</h1>
              {shop.description && <p className="shop-description">{shop.description}</p>}
              <div className="shop-meta">
                {shop.street_address && (
                  <div className="shop-address">
                    <span className="meta-label">Address:</span>
                    <button
                      className="contact-info-btn"
                      onClick={() => setShowLocationPopup(true)}
                    >
                      {shop.street_address}{shop.country && `, ${shop.country}`}
                    </button>
                  </div>
                )}
                {shop.phone && (
                  <div className="shop-phone">
                    <span className="meta-label">Phone:</span>
                    <button
                      className="contact-info-btn"
                      onClick={() => setShowPhonePopup(true)}
                    >
                      {shop.phone}
                    </button>
                  </div>
                )}
                {shop.email && (
                  <div className="shop-email">
                    <span className="meta-label">Email:</span> {shop.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="shop-products-section">
        <h2>Products from this Shop</h2>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <p>This shop hasn't added any products yet.</p>
          </div>
        ) : (
          <div className="shop-products-grid">
            {products.map((product) => (
              <div
                key={product.product_id}
                className="shop-product-card"
                onClick={() => handleProductClick(product.product_id)}
              >
                <div className="shop-product-image">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} />
                  ) : (
                    <div className="product-image-placeholder">No Image</div>
                  )}
                  {product.stock_quantity === 0 && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                  )}
                </div>

                <div className="shop-product-info">
                  <h3>{product.name}</h3>
                  {product.category && (
                    <span className="product-category">{product.category}</span>
                  )}
                  <p className="product-description">
                    {product.description || 'No description available'}
                  </p>
                  <div className="product-footer">
                    <span className="product-price">GH₵ {parseFloat(product.price).toFixed(2)}</span>
                    <span className="product-stock">
                      {product.stock_quantity > 0
                        ? `${product.stock_quantity} in stock`
                        : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Popups */}
      {shop && shop.phone && (
        <ContactPopup
          isOpen={showPhonePopup}
          onClose={() => setShowPhonePopup(false)}
          type="phone"
          value={shop.phone}
          label="Phone Number"
        />
      )}

      {shop && shop.street_address && (
        <ContactPopup
          isOpen={showLocationPopup}
          onClose={() => setShowLocationPopup(false)}
          type="location"
          value={`${shop.street_address}${shop.country ? `, ${shop.country}` : ''}`}
          label="Location"
        />
      )}
    </div>
  );
};

export default ShopDetails;
