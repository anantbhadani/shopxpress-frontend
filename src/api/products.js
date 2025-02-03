import axios from 'axios';

const BASE_URL = 'https://shopxpress-backend-production.up.railway.app/api';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    // Ensure the response contains an array of products
    return Array.isArray(response.data.products) ? response.data.products : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array in case of error
  }
};

export const addProduct = async (productData) => {
  const formData = new FormData();
  Object.keys(productData).forEach((key) => formData.append(key, productData[key]));

  return axios.post(`${BASE_URL}/add-product`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteProduct = async (productId) => {
  return axios.delete(`${BASE_URL}/product/${productId}`);
};
