import { get, post, put, del, patch, uploadFile } from './api.js';

/**
 * Product Service
 * Handles all product-related API calls
 */

/**
 * Get all products
 * @param {object} params - Query parameters (page, limit, category, search, etc.)
 * @returns {Promise<object>} Products data with pagination
 */
export const getAllProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/products?${queryString}` : '/products';
  return await get(endpoint);
};

/**
 * Get products by category
 * @param {string} category - Product category (origen, bebida, postres, ediciones)
 * @returns {Promise<object>} Products in the category
 */
export const getProductsByCategory = async (category) => {
  return await get(`/products/category/${category}`);
};

/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<object>} Product details
 */
export const getProductById = async (id) => {
  return await get(`/products/${id}`);
};

/**
 * Get featured products
 * @returns {Promise<object>} Featured products
 */
export const getFeaturedProducts = async () => {
  return await get('/products/featured');
};

export const createProduct = async (productData) => {
  return await post('/products', productData);
};

export const updateProduct = async (id, productData) => {
  return await put(`/products/${id}`, productData);
};

export const deleteProduct = async (id) => {
  return await del(`/products/${id}`);
};

export const updateProductStock = async (id, quantity) => {
  return await patch(`/products/${id}/stock`, { stock_quantity: quantity });
};

export const uploadImage = async (file) => {
  return await uploadFile('/upload', file);
};

export default {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  uploadImage,
};
