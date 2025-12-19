// customer dashboard

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from '../config/api';
import { getImageUrl } from '../utils/image';
import Logout from './Logout';
import "../styles/dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        // Only check authentication when on the /dashboard route
        if (location.pathname !== '/dashboard') {
            return;
        }

        // Check session with PHP backend
        const checkAuth = async () => {
            try {
                const response = await apiFetch('/check-session.php', {
                    credentials: 'include'
                });
                const data = await response.json();

                if (!data.authenticated || !data.user) {
                    alert('Please login to access the dashboard');
                    localStorage.removeItem('user');
                    navigate('/login');
                    return;
                }

                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect shop owners to their dashboard
                if (data.user.user_type === 'shop_owner') {
                    navigate('/shop-dashboard');
                    return;
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                alert('Session expired. Please login again.');
                localStorage.removeItem('user');
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate, location.pathname]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiFetch('/products.php');
                const data = await response.json();

                if (data.success) {
                    setProducts(data.products || []);
                    setFilteredProducts(data.products || []);

                    // Extract unique categories
                    const uniqueCategories = [...new Set(data.products.map(p => p.category).filter(Boolean))];
                    setCategories(uniqueCategories);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle search and filtering
    useEffect(() => {
        let filtered = products;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Filter by category
        if (selectedCategory && selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        setFilteredProducts(filtered);
    }, [searchQuery, selectedCategory, products]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleWishlistClick = () => {
        navigate('/wishlist');
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="dashboard-page">
            {/* <Header /> */}

            <div className="dashboard-container">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1 className="welcome-title">
                            {getGreeting()}, {user?.first_name || 'Welcome'}! 👋
                        </h1>
                        <p className="welcome-subtitle">
                            Discover the best prices across multiple shops
                        </p>
                    </div>

                    <div className="welcome-actions">
                        <button className="wishlist-btn" onClick={handleWishlistClick}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>Wishlist</span>
                        </button>
                        <Logout className="logout-btn-dashboard" />
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="search-filter-section">
                    <div className="search-container">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="category-filters">
                        <button
                            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            All Categories
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Section */}
                <div className="products-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            {searchQuery ? `Search Results (${filteredProducts.length})` : 'All Products'}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading products...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="empty-state">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
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
        </div>
    );
}

export default Dashboard;
