/**
 * API Service
 * Handles all communication with PHP backend
 */

const API_BASE_URL = '/api';

class ApiService {
  /**
   * Test API connection
   */
  static async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/test.php`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API connection test failed:', error);
      throw error;
    }
  }

  /**
   * Get all products
   */
  static async getProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products.php`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get single product by ID
   */
  static async getProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products.php?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  /**
   * Create new product
   */
  static async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update product
   */
  static async updateProduct(id, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...productData }),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete product
   */
  static async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products.php?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return await response.json();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export default ApiService;
