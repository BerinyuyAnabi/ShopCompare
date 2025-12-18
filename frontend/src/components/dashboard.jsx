// customer dashboard

import { useNavigate } from "react-router-dom";
// import FeaturedShops from "./FeaturedShops";
import "../styles/dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="dashboard">
            {/* Display all shops */}
            {/* <FeaturedShops requireLogin={false} /> */}

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
                                <span className="product-price">$299.99</span>
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
                                <span className="product-price">$299.99</span>
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
