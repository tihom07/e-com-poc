import axiosInstance from './axiosInstance';

// Get cart
export const getCart = async () => {
    const response = await axiosInstance.get('/cart');
    return response.data;
};

// Add to cart
export const addToCart = async (productId, quantity) => {
    const response = await axiosInstance.post('/cart/add', {
        productId,
        quantity
    });
    return response.data;
};

// Update quantity
export const updateCartItem = async (itemId, quantity) => {
    const response = await axiosInstance.put(
        `/cart/update/${itemId}?quantity=${quantity}`
    );
    return response.data;
};

// Remove item
export const removeFromCart = async (itemId) => {
    const response = await axiosInstance.delete(`/cart/remove/${itemId}`);
    return response.data;
};

// Clear cart
export const clearCart = async () => {
    const response = await axiosInstance.delete('/cart/clear');
    return response.data;
};