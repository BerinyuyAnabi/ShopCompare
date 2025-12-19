import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Header from "./header.jsx";
import "../styles/product_detail.css";
import { apiFetch, getApiUrl } from '../config/api';
import { getImageUrl } from '../utils/image';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [compareShops, setCompareShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [helpfulClicked, setHelpfulClicked] = useState({});
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Fetch product data
    useEffect(() => {
        fetchProductData();
    }, [id]);

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const response = await apiFetch(`/product.php?product_id=${id}`);
            const data = await response.json();

            if (data.success) {
                setProduct(data.product);
                setCompareShops(data.compare_shops || []);
            } else {
                setError(data.message || 'Product not found');
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            setError('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                {/* <Header /> */}
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading product details...</p>
                </div>
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                {/* <Header /> */}
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error || 'Product not found'}</p>
                    <button onClick={() => navigate('/dashboard')} className="back-btn">
                        Back to Dashboard
                    </button>
                </div>
            </>
        );
    }

    // Calculate savings for comparison
    const calculateSavings = (shopPrice) => {
        if (compareShops.length === 0) return 0;
        const maxPrice = Math.max(...compareShops.map(s => parseFloat(s.price)));
        return (maxPrice - parseFloat(shopPrice)).toFixed(2);
    };

    // Handle wishlist toggle
    const handleWishlistToggle = async () => {
        setWishlistLoading(true);
        try {
            // Get customer ID from localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const customerId = user.customer_id;

            if (!customerId) {
                alert('Please login to add items to your wishlist');
                navigate('/login');
                return;
            }

            if (isInWishlist) {
                // Remove from wishlist
                const response = await apiFetch('/wishlist.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer_id: customerId,
                        product_id: product.product_id
                    })
                });

                const data = await response.json();
                if (data.success) {
                    setIsInWishlist(false);
                    alert('Removed from wishlist');
                }
            } else {
                // Add to wishlist
                const response = await apiFetch('/wishlist.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer_id: customerId,
                        product_id: product.product_id
                    })
                });

                const data = await response.json();
                if (data.success) {
                    setIsInWishlist(true);
                    alert(data.already_exists ? 'Already in wishlist' : 'Added to wishlist!');
                }
            }
        } catch (err) {
            console.error('Error toggling wishlist:', err);
            alert('Failed to update wishlist');
        } finally {
            setWishlistLoading(false);
        }
    };


    // Handle helpful button click
    const handleHelpfulClick = async (reviewId) => {
        if (helpfulClicked[reviewId]) return;

        try {
            const response = await apiFetch('/reviews.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ review_id: reviewId })
            });

            const data = await response.json();
            if (data.success) {
                setHelpfulClicked({ ...helpfulClicked, [reviewId]: true });
            }
        } catch (err) {
            console.error('Error updating helpful count:', err);
        }
    };

    const customerReviews = [
        { review_id: 1, name: "John D.", rating: 5, date: "2024-01-15", comment: "Excellent product! Worth every penny. The quality exceeded my expectations.", verified: true, helpful_count: 12 },
        { review_id: 2, name: "Sarah M.", rating: 4, date: "2024-01-10", comment: "Good value for money. Great customer service.", verified: true, helpful_count: 8 },
        { review_id: 3, name: "Mike R.", rating: 5, date: "2024-01-05", comment: "Amazing quality! Highly recommend this product to anyone looking for reliability.", verified: false, helpful_count: 15 },
        { review_id: 4, name: "Emily P.", rating: 4, date: "2023-12-28", comment: "Very satisfied with my purchase. The product arrived on time and in perfect condition.", verified: true, helpful_count: 6 }
    ];

    return (
        <>
            {/* <Header /> */}
            <div className="product-detail-container">
                {/* Breadcrumb Navigation */}
                {/* Back Button */}
                <button onClick={() => navigate('/dashboard')} className="back-to-dashboard">
                    ← Back to Dashboard
                </button>

                {/* Main Product Section */}
                <div className="product-main-section">
                    {/* Product Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            {product.image_url ? (
                                <img src={getImageUrl(product.image_url)} alt={product.name} />
                            ) : (
                                <div className="image-placeholder">No Image Available</div>
                            )}
                            {compareShops.length > 0 && compareShops[0].product_id === product.product_id && (
                                <div className="image-badge">Best Price</div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-section">
                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-category-badge">
                            {product.category || 'General'}
                        </div>

                        <div className="product-rating">
                            <div className="stars-large">★★★★☆</div>
                            <span className="rating-text">4.3 out of 5</span>
                        </div>

                        <div className="price-section">
                            <div className="current-price">GH₵ {parseFloat(product.price).toFixed(2)}</div>
                            {compareShops.length > 1 && (
                                <div className="discount-badge">
                                    Save up to GH₵ {calculateSavings(product.price)}
                                </div>
                            )}
                        </div>

                        <div className={`stock-status ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            <span className="status-icon">{product.stock_quantity > 0 ? '✓' : '✗'}</span>
                            {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
                        </div>

                        <div className="product-description">
                            <h3>Product Description</h3>
                            <p>{product.description || "No description available."}</p>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-buy-now">Buy Now</button>
                            <button
                                className={`btn-wishlist ${isInWishlist ? 'in-wishlist' : ''}`}
                                onClick={handleWishlistToggle}
                                disabled={wishlistLoading}
                            >
                                ♥ {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Price Comparison Section */}
                {compareShops.length > 0 && (
                    <div className="price-comparison-section">
                        <h2>Compare Prices Across Shops</h2>
                        <div className="comparison-table">
                            {compareShops.map((shop, index) => (
                                <div
                                    key={shop.product_id}
                                    className={`shop-price-card ${selectedShop === index ? 'selected' : ''} ${shop.stock_quantity === 0 ? 'out-of-stock' : ''}`}
                                    onClick={() => setSelectedShop(index)}
                                >
                                    <div className="shop-header">
                                        <h3>{shop.shop_name}</h3>
                                        {index === 0 && <span className="best-price-badge">Best Price</span>}
                                    </div>
                                    <div className="shop-price">GH₵ {parseFloat(shop.price).toFixed(2)}</div>
                                    {index > 0 && (
                                        <div className="shop-savings">
                                            GH₵ {(parseFloat(shop.price) - parseFloat(compareShops[0].price)).toFixed(2)} more
                                        </div>
                                    )}
                                    <div className="shop-stock">
                                        {shop.stock_quantity > 0 ? (
                                            <span className="in-stock">✓ In Stock ({shop.stock_quantity})</span>
                                        ) : (
                                            <span className="out-stock">✗ Out of Stock</span>
                                        )}
                                    </div>
                                    {shop.street_address && (
                                        <div className="shop-location">
                                            {shop.street_address}
                                        </div>
                                    )}
                                    <button
                                        className="shop-visit-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/shop/${shop.shop_id}`);
                                        }}
                                        disabled={shop.stock_quantity === 0}
                                    >
                                        {shop.stock_quantity > 0 ? 'Visit Shop' : 'Notify Me'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                                <div className="overview-content">
                                    <p>{product.description || "No detailed overview available."}</p>

                                    <div className="product-details-grid">
                                        <div className="detail-item">
                                            <strong>Category:</strong>
                                            <span>{product.category || 'Not specified'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Stock:</strong>
                                            <span>{product.stock_quantity} units available</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Price:</strong>
                                            <span>GH₵ {parseFloat(product.price).toFixed(2)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Sold by:</strong>
                                            <span>{product.shop_name}</span>
                                        </div>
                                    </div>
                                </div>
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
                                                <button
                                                    onClick={() => handleHelpfulClick(review.review_id)}
                                                    disabled={helpfulClicked[review.review_id]}
                                                    className={helpfulClicked[review.review_id] ? 'clicked' : ''}
                                                >
                                                    👍 Helpful ({review.helpful_count + (helpfulClicked[review.review_id] ? 1 : 0)})
                                                </button>
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

                                {compareShops.map((shop, index) => (
                                    <div key={shop.shop_id} className="location-card">
                                        <div className="location-header">
                                            <h4>📍 {shop.shop_name}</h4>
                                            {shop.stock_quantity > 0 ? (
                                                <span className="stock-badge in-stock">In Stock</span>
                                            ) : (
                                                <span className="stock-badge out-stock">Out of Stock</span>
                                            )}
                                        </div>

                                        <div className="location-details">
                                            <div className="address-section">
                                                {shop.street_address && (
                                                    <>
                                                        <p className="address-line">
                                                            <strong>Address:</strong> {shop.street_address}
                                                        </p>
                                                        {shop.country && (
                                                            <p className="address-line">{shop.country}</p>
                                                        )}
                                                    </>
                                                )}
                                                {shop.shop_phone && (
                                                    <p className="address-line">
                                                        <strong>Phone:</strong> {shop.shop_phone}
                                                    </p>
                                                )}
                                                <p className="address-line">
                                                    <strong>Price:</strong> GH₵ {parseFloat(shop.price).toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="direction-buttons">
                                                {shop.street_address && (
                                                    <button
                                                        className="btn-get-directions"
                                                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.street_address + ', ' + (shop.country || ''))}`, '_blank')}
                                                    >
                                                        Get Directions
                                                    </button>
                                                )}
                                                {shop.shop_phone && (
                                                    <button
                                                        className="btn-call-store"
                                                        onClick={() => window.location.href = `tel:${shop.shop_phone}`}
                                                    >
                                                        📞 Call Store
                                                    </button>
                                                )}
                                                <button
                                                    className="btn-visit-shop"
                                                    onClick={() => navigate(`/shop/${shop.shop_id}`)}
                                                >
                                                    Visit Shop Page
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