import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role?: 'user' | 'admin';
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  created_at: string;
  last_login?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('auth_token', token);
    
    return { token, user };
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', userData);
    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('auth_token', token);
    
    return { token, user };
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
};

export const examAPI = {
  async getExams() {
    const response = await apiClient.get('/exams');
    return response.data;
  },

  async createExam(examData: any) {
    const response = await apiClient.post('/exams', examData);
    return response.data;
  }
};

export const userAPI = {
  async getUsers(page = 1, limit = 10) {
    const response = await apiClient.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  async updateProfile(profileData: { full_name?: string; avatar_url?: string }) {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  }
};

export default apiClient;