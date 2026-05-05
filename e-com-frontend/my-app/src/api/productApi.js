import axiosInstance from './axiosInstance';

// Get all products
export const getAllProducts = async () => {
    const response = await axiosInstance.get('/products');
    return response.data;
};

// Get single product
export const getProductById = async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
};

// Create product
export const createProduct = async (productData) => {
    const response = await axiosInstance.post('/products', productData);
    return response.data;
};

// Update product
export const updateProduct = async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
};

// Search by name
export const searchProducts = async (name) => {
    const response = await axiosInstance.get(`/products/search?name=${name}`);
    return response.data;
};

// Upload image
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};