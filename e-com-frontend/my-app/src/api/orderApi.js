import axiosInstance from './axiosInstance';

// Checkout
export const checkout = async () => {
    const response = await axiosInstance.post('/orders/checkout');
    return response.data;
};

// Get all orders
export const getOrders = async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
};