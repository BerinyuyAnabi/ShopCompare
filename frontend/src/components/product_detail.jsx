import React, { useState } from "react";
import Header from "./header.jsx";
import "../styles/product_detail.css";

function ProductDetail({ product }) {
    const [selectedShop, setSelectedShop] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');

    if (!product) {
        return (
            <>
                <Header />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading product details...</p>
                </div>
            </>
        );
    }

    // Mock data for comprehensive details
    const shops = [
        { name: "Shop A", price: 299.99, savings: 50, inStock: true, rating: 4.5, reviews: 120 },
        { name: "Shop B", price: 319.99, savings: 30, inStock: true, rating: 4.2, reviews: 85 },
        { name: "Shop C", price: 334.99, savings: 15, inStock: false, rating: 4.0, reviews: 45 }
    ];

    const specifications = [
        { label: "Brand", value: "Premium Brand" },
        { label: "Model Number", value: "PB-2024-X" },
        { label: "Dimensions", value: "15 x 10 x 5 inches" },
        { label: "Weight", value: "2.5 lbs" },
        { label: "Material", value: "Premium Quality" },
        { label: "Color Options", value: "Black, White, Gray" },
        { label: "Warranty", value: "2 Year Manufacturer Warranty" },
        { label: "Country of Origin", value: "USA" }
    ];

    const customerReviews = [
        { name: "John D.", rating: 5, date: "2024-01-15", comment: "Excellent product! Worth every penny. The quality exceeded my expectations.", verified: true },
        { name: "Sarah M.", rating: 4, date: "2024-01-10", comment: "Good value for money. Great customer service.", verified: true },
        { name: "Mike R.", rating: 5, date: "2024-01-05", comment: "Amazing quality! Highly recommend this product to anyone looking for reliability.", verified: false },
        { name: "Emily P.", rating: 4, date: "2023-12-28", comment: "Very satisfied with my purchase. The product arrived on time and in perfect condition.", verified: true }
    ];

    const relatedProducts = [
        { id: 1, name: "Related Product 1", price: 199.99, image: "" },
        { id: 2, name: "Related Product 2", price: 249.99, image: "" },
        { id: 3, name: "Related Product 3", price: 179.99, image: "" },
        { id: 4, name: "Related Product 4", price: 299.99, image: "" }
    ];

    return (
        <>
            <Header />
            <div className="product-detail-container">
                {/* Breadcrumb Navigation */}
                <nav className="breadcrumb">
                    <a href="/">Home</a> / <a href="/dashboard">Products</a> / <span>{product.name || "Product Name"}</span>
                </nav>

                {/* Main Product Section */}
                <div className="product-main-section">
                    {/* Product Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            {product.image && <img src={product.image} alt={product.name || "Product"} />}
                            <div className="image-badge">Best Seller</div>
                        </div>
                        <div className="thumbnail-images">
                            <div className="thumbnail active"></div>
                            <div className="thumbnail"></div>
                            <div className="thumbnail"></div>
                            <div className="thumbnail"></div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-section">
                        <h1 className="product-title">{product.name || "Premium Quality Product"}</h1>

                        <div className="product-rating">
                            <div className="stars-large">★★★★☆</div>
                            <span className="rating-text">4.3 out of 5</span>
                            <span className="review-link">(250 customer reviews)</span>
                        </div>

                        <div className="price-section">
                            <div className="current-price">${product.price || "299.99"}</div>
                            <div className="original-price">$349.99</div>
                            <div className="discount-badge">Save 15%</div>
                        </div>

                        <div className="stock-status in-stock">
                            <span className="status-icon">✓</span> In Stock
                        </div>

                        <div className="product-description">
                            <h3>Product Description</h3>
                            <p>{product.description || "This is a premium quality product designed to meet your needs. Crafted with attention to detail and built to last, this product offers exceptional value and performance."}</p>
                        </div>


                        <div className="action-buttons">
                            {/* <button className="btn-add-cart">Add to Cart</button> */}
                            <button className="btn-buy-now">Buy Now</button>
                            <button className="btn-wishlist">♥ Add to Wishlist</button>
                        </div>
                    </div>
                </div>

                {/* Price Comparison Section */}
                <div className="price-comparison-section">
                    <h2>Compare Prices Across Shops</h2>
                    <div className="comparison-table">
                        {shops.map((shop, index) => (
                            <div
                                key={index}
                                className={`shop-price-card ${selectedShop === index ? 'selected' : ''} ${!shop.inStock ? 'out-of-stock' : ''}`}
                                onClick={() => setSelectedShop(index)}
                            >
                                <div className="shop-header">
                                    <h3>{shop.name}</h3>
                                    {index === 0 && <span className="best-price-badge">Best Price</span>}
                                </div>
                                <div className="shop-price">${shop.price}</div>
                                <div className="shop-savings">Save ${shop.savings}</div>
                                <div className="shop-rating">
                                    <span className="stars">★★★★☆</span>
                                    <span>({shop.reviews} reviews)</span>
                                </div>
                                <div className="shop-stock">
                                    {shop.inStock ? (
                                        <span className="in-stock">✓ In Stock</span>
                                    ) : (
                                        <span className="out-stock">✗ Out of Stock</span>
                                    )}
                                </div>
                                <button className="shop-visit-btn" disabled={!shop.inStock}>
                                    {shop.inStock ? 'Visit Shop' : 'Notify Me'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detailed Information Tabs */}
                <div className="product-tabs-section">
                    <div className="tabs-header">
                        <button
                            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        {/* <button
                            className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('specifications')}
                        >
                            Specifications
                        </button> */}
                        <button
                            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Customer Reviews
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'location' ? 'active' : ''}`}
                            onClick={() => setActiveTab('location')}
                        >
                            Location & Directions
                        </button>
                    </div>

                    <div className="tabs-content">
                        {activeTab === 'overview' && (
                            <div className="tab-panel">
                                <h3>Product Overview</h3>
                                <p>This comprehensive product offers outstanding quality and performance. Designed with the user in mind, it combines functionality with style to deliver an exceptional experience.</p>
                                <p>Whether you're a professional or enthusiast, this product provides the features and reliability you need. Built to last and backed by excellent customer support.</p>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="tab-panel specifications-grid">
                                {specifications.map((spec, index) => (
                                    <div key={index} className="spec-row">
                                        <div className="spec-label">{spec.label}</div>
                                        <div className="spec-value">{spec.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="tab-panel reviews-section">
                                <div className="reviews-summary">
                                    <div className="summary-rating">
                                        <div className="big-rating">4.3</div>
                                        <div className="stars-large">★★★★☆</div>
                                        <p>Based on 250 reviews</p>
                                    </div>
                                    <div className="rating-breakdown">
                                        <div className="rating-bar">
                                            <span>5 ★</span>
                                            <div className="bar"><div className="fill" style={{width: '60%'}}></div></div>
                                            <span>150</span>
                                        </div>
                                        <div className="rating-bar">
                                            <span>4 ★</span>
                                            <div className="bar"><div className="fill" style={{width: '25%'}}></div></div>
                                            <span>63</span>
                                        </div>
                                        <div className="rating-bar">
                                            <span>3 ★</span>
                                            <div className="bar"><div className="fill" style={{width: '10%'}}></div></div>
                                            <span>25</span>
                                        </div>
                                        <div className="rating-bar">
                                            <span>2 ★</span>
                                            <div className="bar"><div className="fill" style={{width: '3%'}}></div></div>
                                            <span>8</span>
                                        </div>
                                        <div className="rating-bar">
                                            <span>1 ★</span>
                                            <div className="bar"><div className="fill" style={{width: '2%'}}></div></div>
                                            <span>4</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="reviews-list">
                                    {customerReviews.map((review, index) => (
                                        <div key={index} className="review-card">
                                            <div className="review-header">
                                                <div className="reviewer-info">
                                                    <div className="reviewer-avatar">{review.name.charAt(0)}</div>
                                                    <div>
                                                        <h4>{review.name}</h4>
                                                        {review.verified && <span className="verified-badge">✓ Verified Purchase</span>}
                                                    </div>
                                                </div>
                                                <div className="review-date">{review.date}</div>
                                            </div>
                                            <div className="review-rating">
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                                            </div>
                                            <p className="review-comment">{review.comment}</p>
                                            <div className="review-actions">
                                                <button>👍 Helpful (12)</button>
                                                <button>Report</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="btn-write-review">Write a Review</button>
                            </div>
                        )}

                        {activeTab === 'location' && (
                            <div className="tab-panel location-info">
                                <h3>Shop Locations & Directions</h3>

                                {shops.map((shop, index) => (
                                    <div key={index} className="location-card">
                                        <div className="location-header">
                                            <h4>📍 {shop.name}</h4>
                                            {shop.inStock ? (
                                                <span className="stock-badge in-stock">In Stock</span>
                                            ) : (
                                                <span className="stock-badge out-stock">Out of Stock</span>
                                            )}
                                        </div>

                                        <div className="location-details">
                                            <div className="address-section">
                                                <p className="address-line">
                                                    <strong>Address:</strong> 123 Main Street, Suite {100 + index}
                                                </p>
                                                <p className="address-line">
                                                    City, State 12345
                                                </p>
                                                <p className="address-line">
                                                    <strong>Phone:</strong> (555) {1000 + index * 100}-{2000 + index}
                                                </p>
                                            </div>

                                            <div className="hours-section">
                                                <strong>Store Hours:</strong>
                                                <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                                                <p>Saturday: 10:00 AM - 6:00 PM</p>
                                                <p>Sunday: 11:00 AM - 5:00 PM</p>
                                            </div>

                                            {/* <div className="distance-section">
                                                <p className="distance">🚗 {2 + index} miles away</p>
                                                <p className="travel-time">Approximately {10 + index * 5} minutes drive</p>
                                            </div> */}

                                            {/* <div className="map-placeholder">
                                                <div className="map-box">
                                                    <p>Map View</p>
                                                    <small>Interactive map would appear here</small>
                                                </div>
                                            </div> */}

                                            <div className="direction-buttons">
                                                <button className="btn-get-directions">
                                                    🧭 Get Directions
                                                </button>
                                                <button className="btn-call-store">
                                                    📞 Call Store
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {/* <div className="related-products-section">
                    <h2>You May Also Like</h2>
                    <div className="related-products-grid">
                        {relatedProducts.map((relProd) => (
                            <div key={relProd.id} className="related-product-card">
                                <div className="related-image"></div>
                                <h3>{relProd.name}</h3>
                                <div className="related-price">${relProd.price}</div>
                                <div className="related-rating">★★★★☆ (45)</div>
                                <button className="btn-quick-view">Quick View</button>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </>
    );
}

export default ProductDetail;