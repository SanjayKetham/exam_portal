import axiosInstance from '../lib/axios'; // adjust path as needed

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
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  
};

export const settingsAPI = {
  saveSettings: async (userId: number, settings: {
    full_name: string;
    email: string;
    phone: string;
    notifications: Record<string, boolean>;
    theme: string;
    language: string;
  }) => {
    try {
      const response = await axiosInstance.put(`/user/settings/${userId}`, settings);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to save settings');
    }
  }
};
