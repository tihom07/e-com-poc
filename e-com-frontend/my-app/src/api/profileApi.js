import axiosInstance from './axiosInstance';

// Get profile
export const getProfile = async () => {
    const response = await axiosInstance.get('/profile');
    return response.data;
};

// Update profile
export const updateProfile = async (profileData) => {
    const response = await axiosInstance.put('/profile/update', profileData);
    return response.data;
};

// Update password
export const updatePassword = async (passwordData) => {
    const response = await axiosInstance.put('/profile/password', passwordData);
    return response.data;
};