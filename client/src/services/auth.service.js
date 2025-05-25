import axios from 'axios';

const API_URL = 'https://hotelmanagementhust.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch event for auth state change instead of direct navigation
      window.dispatchEvent(new Event('authStateChange'));
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Sign in
  signIn: async (username, password) => {
    try {
      console.log('Attempting sign in with:', { username });
      const response = await api.post('/auth/signin', { username, password });
      console.log('Sign in response:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        if (!token || !user) {
          throw new Error('Invalid response format: missing token or user data');
        }
        return response.data;
      } else {
        throw {
          error: {
            message: response.data.error?.message || 'Invalid username or password',
            status: response.data.error?.status || 401
          }
        };
      }
    } catch (error) {
      console.error('Sign in error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Handle specific error cases
      if (error.response?.status === 500) {
        throw {
          error: {
            message: 'Server error. Please try again later.',
            status: 500
          }
        };
      }
      
      throw error.response?.data || {
        error: {
          message: 'An unexpected error occurred',
          status: error.response?.status || 500
        }
      };
    }
  },

  // Sign up
  signUp: async (userData) => {
    try {
      console.log('Attempting sign up with:', { ...userData, password: '[REDACTED]' });
      const response = await api.post('/auth/signup', userData);
      console.log('Sign up response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Sign up error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Handle specific error cases
      if (error.response?.status === 500) {
        throw {
          error: {
            message: 'Server error. Please try again later.',
            status: 500
          }
        };
      }
      
      throw error.response?.data || {
        error: {
          message: 'An unexpected error occurred',
          status: error.response?.status || 500
        }
      };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await api.post('/auth/signout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out error:', error);
      // Still remove local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user by ID
  getUserById: async (userId) => {
    if (!userId) {
      console.error('getUserById called with undefined userId');
      throw new Error('User ID is required');
    }

    try {
      console.log('Fetching user with ID:', userId);
      const response = await api.get(`/users/${userId}`);
      console.log('Get user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get user error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        userId
      });
      throw error.response?.data || error;
    }
  },

  // Get user profile (using get user by ID)
  getProfile: async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('No user logged in');
    }

    if (!user.user_id) {
      console.error('Current user object:', user);
      throw new Error('User ID not found in user object');
    }

    try {
      console.log('Getting profile for user:', user.user_id);
      const response = await authService.getUserById(user.user_id);
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (updateData) => {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('No user logged in');
    }

    if (!user.user_id) {
      console.error('Current user object:', user);
      throw new Error('User ID not found in user object');
    }

    try {
      console.log('Updating profile for user:', user.user_id);
      const response = await api.put(`/users/${user.user_id}`, updateData);
      console.log('Update profile response:', response.data);
      
      if (response.data.success) {
        // Update local storage with new user data
        const updatedUser = {
          ...user,
          ...response.data.data
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Updated user in localStorage:', updatedUser);
      }
      return response.data;
    } catch (error) {
      console.error('Update profile error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        userId: user.user_id
      });
      throw error.response?.data || error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      console.log('Attempting to change password');
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      console.log('Change password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Change password error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error.response?.data || error;
    }
  }
};

export default authService; 