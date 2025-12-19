/**
 * API Service
 * Uses the central API helpers for connection 
 */

import { apiFetch, getApiUrl } from '../config/api';

class ApiService {
  static async testConnection() {
    try {
      const response = await apiFetch('/test.php');
      return await response.json();
    } catch (error) {
      console.error('API connection test failed:', error);
      throw error;
    }
  }

  static async getProducts() {
    try {
      const response = await apiFetch('/products.php');
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async getProduct(id) {
    try {
      // Use getApiUrl for query string construction
      const url = getApiUrl(`/products.php?id=${encodeURIComponent(id)}`);
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  static async createProduct(productData) {
    try {
      const response = await apiFetch('/products.php', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(id, productData) {
    try {
      const response = await apiFetch('/products.php', {
        method: 'PUT',
        body: JSON.stringify({ id, ...productData }),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(id) {
    try {
      const url = getApiUrl(`/products.php?id=${encodeURIComponent(id)}`);
      const response = await fetch(url, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error('Failed to delete product');
      return await response.json();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export default ApiService;
