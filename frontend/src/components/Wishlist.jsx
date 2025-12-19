import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from '../config/api';
import { getImageUrl } from '../utils/image';
import Logout from './Logout';
import "../styles/dashboard.css";

function Wishlist() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        const checkAuth = async () => {
            try {
                const response = await apiFetch('/check-session.php', {
                    credentials: 'include'
                });
                const data = await response.json();

                if (!data.authenticated || !data.user) {
                    alert('Please login to access your wishlist');
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

                // Fetch wishlist items
                fetchWishlist(data.user.customer_id);
            } catch (error) {
                console.error('Auth check failed:', error);
                alert('Session expired. Please login again.');
                localStorage.removeItem('user');
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    const fetchWishlist = async (customerId) => {
        try {
            setLoading(true);
            const response = await apiFetch(`/wishlist.php?customer_id=${customerId}`);
            const data = await response.json();

            if (data.success) {
                setWishlistItems(data.wishlist || []);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const response = await apiFetch('/wishlist.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: user.customer_id,
                    product_id: productId
                })
            });

            const data = await response.json();
            if (data.success) {
                // Refresh wishlist
                fetchWishlist(user.customer_id);
            } else {
                alert('Failed to remove item from wishlist');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            alert('Failed to remove item from wishlist');
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1 className="welcome-title">
                            {getGreeting()}, {user?.first_name || 'Welcome'}! 👋
                        </h1>
                        <p className="welcome-subtitle">
                            Your saved items
                        </p>
                    </div>

                    <div className="welcome-actions">
                        <button className="wishlist-btn" onClick={handleBackToDashboard}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                            <span>Back to Dashboard</span>
                        </button>
                        <Logout className="logout-btn-dashboard" />
                    </div>
                </div>

                {/* Wishlist Section */}
                <div className="products-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            My Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
                        </h2>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading wishlist...</p>
                        </div>
                    ) : wishlistItems.length === 0 ? (
                        <div className="empty-state">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <h3>Your wishlist is empty</h3>
                            <p>Start adding products you love!</p>
                            <button onClick={handleBackToDashboard} className="wishlist-btn" style={{marginTop: '1rem'}}>
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {wishlistItems.map(item => (
                                <article
                                    key={item.wishlist_id}
                                    className="product-card"
                                >
                                    <div className="product-image" onClick={() => handleProductClick(item.product_id)}>
                                        {item.image_url ? (
                                            <img src={getImageUrl(item.image_url)} alt={item.name} />
                                        ) : (
                                            <div className="image-placeholder">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                    <polyline points="21 15 16 10 5 21"></polyline>
                                                </svg>
                                            </div>
                                        )}
                                        {item.stock_quantity === 0 && (
                                            <div className="out-of-stock-badge">Out of Stock</div>
                                        )}
                                    </div>

                                    <div className="product-details">
                                        <h3 className="product-name" onClick={() => handleProductClick(item.product_id)}>
                                            {item.name}
                                        </h3>

                                        {item.category && (
                                            <span className="product-category">{item.category}</span>
                                        )}

                                        <p className="product-description">
                                            {item.description?.substring(0, 100)}
                                            {item.description?.length > 100 ? '...' : ''}
                                        </p>

                                        <div className="product-footer">
                                            <div className="product-price">
                                                <span className="currency">GH₵</span>
                                                <span className="amount">{parseFloat(item.price).toFixed(2)}</span>
                                            </div>

                                            <div className="product-stock">
                                                {item.stock_quantity > 0 ? (
                                                    <span className="in-stock">
                                                        <span className="stock-dot"></span>
                                                        {item.stock_quantity} in stock
                                                    </span>
                                                ) : (
                                                    <span className="out-of-stock">
                                                        <span className="stock-dot"></span>
                                                        Out of stock
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            className="remove-from-wishlist-btn"
                                            onClick={() => handleRemoveFromWishlist(item.product_id)}
                                        >
                                            Remove from Wishlist
                                        </button>
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

export default Wishlist;
