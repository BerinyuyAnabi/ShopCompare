import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import '../styles/shop-dashboard.css';
import { apiFetch, getApiUrl } from '../config/api';

const ShopDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Check session with PHP backend
    const checkAuth = async () => {
      try {
        const response = await apiFetch('/check-session.php', {
          credentials: 'include' // Important for sending cookies
        });
        const data = await response.json();

        if (!data.authenticated || !data.user) {
          alert('Please login to access this page');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        // Store user data in localStorage for quick access
        localStorage.setItem('user', JSON.stringify(data.user));

        // Check if user is a shop owner
        if (data.user.user_type !== 'shop_owner') {
          alert('This page is only accessible to shop owners');
          navigate('/dashboard');
          return;
        }

        // Check if shop_id exists
        if (!data.user.shop_id) {
          alert('Shop information not found. Please login again.');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        // Fetch products after authentication is confirmed
        fetchProducts();
      } catch (error) {
        console.error('Auth check failed:', error);
        alert('Session expired. Please login again.');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
  const response = await apiFetch(`/products.php?shop_id=${user.shop_id}`);
  const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      let imageUrl = formData.image_url;

      // Upload image if file is selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        imageFormData.append('shop_id', user.shop_id);

        const uploadResponse = await fetch(getApiUrl('/upload-image.php'), {
          method: 'POST',
          body: imageFormData,
          credentials: 'include'
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Image upload failed:', uploadResponse.status, errorText);
          throw new Error(`Image upload failed: ${uploadResponse.status}`);
        }

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          imageUrl = uploadData.image_url;
        } else {
          throw new Error(uploadData.message || 'Image upload failed');
        }
      }

      const response = await apiFetch('/products.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
          shop_id: user.shop_id
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();

      if (data.success) {
        setShowAddForm(false);
        setFormData({
          name: '',
          description: '',
          price: '',
          stock_quantity: '',
          category: '',
          image_url: ''
        });
        setImageFile(null);
        setImagePreview(null);
        fetchProducts();
      } else {
        alert(data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Failed to add product: ${error.message}`);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      let imageUrl = formData.image_url;

      // Upload image if new file is selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        imageFormData.append('shop_id', user.shop_id);

        const uploadResponse = await fetch(getApiUrl('/upload-image.php'), {
          method: 'POST',
          body: imageFormData,
          credentials: 'include'
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          imageUrl = uploadData.image_url;
        }
      }

      const response = await apiFetch('/products.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
          product_id: editingProduct.product_id
        })
      });

      const data = await response.json();

      if (data.success) {
        setEditingProduct(null);
        setFormData({
          name: '',
          description: '',
          price: '',
          stock_quantity: '',
          category: '',
          image_url: ''
        });
        setImageFile(null);
        setImagePreview(null);
        fetchProducts();
      } else {
        alert(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await apiFetch('/products.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchProducts();
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock_quantity: product.stock_quantity,
      category: product.category || '',
      image_url: product.image_url || ''
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category: '',
      image_url: ''
    });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="shop-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Shop Dashboard</h1>
          <div className="header-actions">
            <Logout className="logout-btn" />
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="actions-bar">
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingProduct(null);
              setFormData({
                name: '',
                description: '',
                price: '',
                stock_quantity: '',
                category: '',
                image_url: ''
              });
            }}
            className="add-product-btn"
          >
            + Add New Product
          </button>
        </div>

        {(showAddForm || editingProduct) && (
          <div className="product-form-container">
            <div className="form-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  cancelEdit();
                }}
                className="close-form-btn"
              >
                ✕
              </button>
            </div>
            <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Electronics, Clothing"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock_quantity">Stock Quantity *</label>
                  <input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Enter product description"
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="product_image">Upload Product Image</label>
                  <input
                    type="file"
                    id="product_image"
                    name="product_image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                  {!imagePreview && editingProduct && editingProduct.image_url && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={editingProduct.image_url}
                        alt="Current"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>Current image</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    cancelEdit();
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="products-section">
          <h2>Your Products</h2>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <p>No products yet. Add your first product to get started!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.product_id} className="product-card">
                  {product.image_url && (
                    <div className="product-image">
                      <img src={product.image_url} alt={product.name} />
                    </div>
                  )}
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    {product.category && (
                      <span className="product-category">{product.category}</span>
                    )}
                    <p className="product-description">{product.description}</p>
                    <div className="product-details">
                      <span className="product-price">GH₵ {parseFloat(product.price).toFixed(2)}</span>
                      <span className="product-stock">Stock: {product.stock_quantity}</span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={() => startEdit(product)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.product_id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
