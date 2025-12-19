// Products listing component for landing page (no header/search)
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from '../config/api';
import { getImageUrl } from '../utils/image';
import "../styles/dashboard.css";

function ProductsList() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await apiFetch('/products.php');
            const data = await response.json();

            if (data.success) {
                // Show first 6 products on landing page
                setProducts((data.products || []).slice(0, 6));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productId) => {
        // Redirect to login if not logged in
        const user = localStorage.getItem('user');
        if (!user) {
            alert('Please login to view product details');
            navigate('/login');
            return;
        }
        navigate(`/product/${productId}`);
    };

    return (
        <div className="products-section" style={{background: 'white', padding: '3rem 2rem'}}>
            <div className="dashboard-container">
                <div className="section-header">
                    <h2 className="section-title">Featured Products</h2>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <h3>No products available</h3>
                        <p>Check back later for new products</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map(product => (
                            <article
                                key={product.product_id}
                                className="product-card"
                                onClick={() => handleProductClick(product.product_id)}
                            >
                                <div className="product-image">
                                    {product.image_url ? (
                                        <img src={getImageUrl(product.image_url)} alt={product.name} />
                                    ) : (
                                        <div className="image-placeholder">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                <polyline points="21 15 16 10 5 21"></polyline>
                                            </svg>
                                        </div>
                                    )}
                                    {product.stock_quantity === 0 && (
                                        <div className="out-of-stock-badge">Out of Stock</div>
                                    )}
                                </div>

                                <div className="product-details">
                                    <h3 className="product-name">{product.name}</h3>

                                    {product.category && (
                                        <span className="product-category">{product.category}</span>
                                    )}

                                    <p className="product-description">
                                        {product.description?.substring(0, 100)}
                                        {product.description?.length > 100 ? '...' : ''}
                                    </p>

                                    <div className="product-footer">
                                        <div className="product-price">
                                            <span className="currency">GH₵</span>
                                            <span className="amount">{parseFloat(product.price).toFixed(2)}</span>
                                        </div>

                                        <div className="product-shop">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                            </svg>
                                            <span>{product.shop_name}</span>
                                        </div>
                                    </div>

                                    <div className="product-stock">
                                        {product.stock_quantity > 0 ? (
                                            <span className="in-stock">
                                                <span className="stock-dot"></span>
                                                {product.stock_quantity} in stock
                                            </span>
                                        ) : (
                                            <span className="out-of-stock">
                                                <span className="stock-dot"></span>
                                                Out of stock
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductsList;
