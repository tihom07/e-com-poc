import axiosInstance from './axiosInstance';

//  Checkout with address and payment
export const checkout = async (checkoutData) => {
    const response = await axiosInstance.post('/orders/checkout', checkoutData);
    return response.data;
};

//  Get all orders
export const getOrders = async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
};

//  Get single order by ID
export const getOrderById = async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
};

//  Cancel order
export const cancelOrder = async (id) => {
    const response = await axiosInstance.put(`/orders/${id}/cancel`);
    return response.data;
};