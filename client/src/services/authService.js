import axios from 'axios'
import { HOST } from '../utils/constants'

const API_BASE_URL = HOST || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for network issues
  withCredentials: true, // Use cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`[Auth API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('[Auth API Request Error]', error);
    return Promise.reject(error);
  }
)

// Handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log(`[Auth API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('[Auth API Response Error]', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network Error: Backend server might not be running or CORS issue');
      error.message = 'Unable to connect to server. Please ensure the backend is running on ' + API_BASE_URL;
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Don't redirect automatically, let the app handle it
    }
    return Promise.reject(error)
  }
)

// export interface User {
//   _id: string
//   name: string
//   email: string
//   avatar?: string
//   isOnline: boolean
//   lastSeen: Date
//   phone?: string
// }

// export interface AuthResponse {
//   success: boolean
//   user: User
//   token: string
//   message?: string
// }

// export interface LoginData {
//   email: string
//   password: string
// }

// export interface SignupData {
//   name: string
//   email: string
//   password: string
//   phone?: string
// }

class AuthService {
  async login(data) {
    const response = await api.post('/api/auth/login', data)
    
    if (response.data && response.data.user) {
      // Store user info in localStorage for quick access
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  }

  async signup(data) {
    const response = await api.post('/api/auth/signup', data)
    
    if (response.data && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  }

  async logout() {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  async getCurrentUser(){
    const response = await api.get('/api/auth/user-info')
    // Backend returns user data directly, not wrapped in { user: ... }
    if (response.data && response.data.id) {
      return {
        id: response.data.id,
        email: response.data.email,
        profileSetup: response.data.profileSetup,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        image: response.data.image,
        color: response.data.color,
        isAdmin: response.data.isAdmin,
      }
    }
    return response.data
  }

  async updateProfile(data) {
    const response = await api.post('/api/auth/update-profile', data)
    
    if (response.data && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return response.data.user
    }
    
    return response.data
  }

  getStoredUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isAuthenticated() {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
export default api