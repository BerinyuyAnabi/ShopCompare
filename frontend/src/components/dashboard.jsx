// customer dashboard

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import FeaturedShops from "./FeaturedShops";
import "../styles/dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check session with PHP backend
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/check-session.php', {
                    credentials: 'include' // Important for sending cookies
                });
                const data = await response.json();

                if (!data.authenticated || !data.user) {
                    alert('Please login to access the dashboard');
                    localStorage.removeItem('user');
                    navigate('/login');
                    return;
                }

                // Store user data in localStorage for quick access
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
    }, [navigate]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="dashboard">
            {/* Display all shops */}
            <FeaturedShops requireLogin={false} />

            <section className="products-section">
                <h1 className="section-title">Shop by Product</h1>

                <div className="products-grid">
                    <article className="product-card" onClick={() => handleProductClick(1)}>
                        <div className="product-image">
                            <div className="savings-badge">
                                <span className="savings-amount">Save $50</span>
                                <span className="savings-percentage">15% cheaper</span>
                            </div>
                        </div>

                        <div className="product-details">
                            <h2 className="product-name">Product Name</h2>

                            <div className="product-info">
                                <span className="product-quantity">Quantity: 1 unit</span>
                                <span className="product-price">GH₵ 299.99</span>
                            </div>

                            <div className="availability">
                                <h3>Available at</h3>
                                <div className="shop-logos">
                                    <div className="shop-logo-mini"></div>
                                    <div className="shop-logo-mini"></div>
                                    <div className="shop-logo-mini"></div>
                                </div>
                            </div>

                            <div className="reviews-section">
                                <h3>Customer Reviews</h3>
                                <div className="rating">
                                    <span className="stars">★★★★☆</span>
                                    <span className="review-count">(24 reviews)</span>
                                </div>
                            </div>

                            <div className="product-actions">
                                <button className="btn-save" onClick={(e) => e.stopPropagation()}>Save for Later</button>
                                <button className="btn-review" onClick={(e) => e.stopPropagation()}>Write a Review</button>
                            </div>
                        </div>
                    </article>

                    <article className="product-card" onClick={() => handleProductClick(2)}>
                        <div className="product-image">
                            <div className="savings-badge">
                                <span className="savings-amount">Save $50</span>
                                <span className="savings-percentage">15% cheaper</span>
                            </div>
                        </div>

                        <div className="product-details">
                            <h2 className="product-name">Product Name 2</h2>

                            <div className="product-info">
                                <span className="product-quantity">Quantity: 1 unit</span>
                                <span className="product-price">GH₵ 299.99</span>
                            </div>

                            <div className="availability">
                                <h3>Available at</h3>
                                <div className="shop-logos">
                                    <div className="shop-logo-mini"></div>
                                    <div className="shop-logo-mini"></div>
                                    <div className="shop-logo-mini"></div>
                                </div>
                            </div>

                            <div className="reviews-section">
                                <h3>Customer Reviews</h3>
                                <div className="rating">
                                    <span className="stars">★★★★☆</span>
                                    <span className="review-count">(24 reviews)</span>
                                </div>
                            </div>

                            <div className="product-actions">
                                <button className="btn-save" onClick={(e) => e.stopPropagation()}>Save for Later</button>
                                <button className="btn-review" onClick={(e) => e.stopPropagation()}>Write a Review</button>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
