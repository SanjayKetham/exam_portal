// frontend/src/api/api.ts
import axiosInstance from '../lib/axios'; // adjust path if needed

// ----- Auth API -----
export const authAPI = {
  register: async ({ email, password, full_name, role }: any) => {
    try {
      const response = await axiosInstance.post('/register', { email, password, full_name, role });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  login: async ({ email, password }: any) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      // JWT cookie is automatically stored in browser
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post('/logout');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Logout failed');
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/profile'); // backend route should return user info based on cookie
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  }
};

// ----- Settings API -----
export const settingsAPI = {
  saveSettings: async (
    userId: number,
    settings: {
      full_name: string;
      email: string;
      phone: string;
      notifications: Record<string, boolean>;
      theme: string;
      language: string;
    }
  ) => {
    try {
      const response = await axiosInstance.put(`/user/settings/${userId}`, settings);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to save settings');
    }
  }
};
