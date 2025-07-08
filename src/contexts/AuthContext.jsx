import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/axios';
import { STORAGE_KEYS } from '../config/constants';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext useEffect running');
    // Check if user is already logged in
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          console.log('Token expired, clearing user data');
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          setCurrentUser(null);
        } else {
          // Get user data from local storage if available
          const userData = localStorage.getItem(STORAGE_KEYS.USER);
          if (userData) {
            const parsedUserData = JSON.parse(userData);
            console.log('Retrieved user data from localStorage:', parsedUserData);
            setCurrentUser(parsedUserData);
          }
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    setIsLoading(false);
  }, []);

  // Add effect to log currentUser changes
  useEffect(() => {
    console.log('currentUser state updated:', currentUser);
  }, [currentUser]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for email:', email);
      const response = await api.post('/auth/login/', {
        email,
        password,
      });
      
      console.log('Login Response:', response.data);
      
      const { token, user } = response.data;
      
      console.log('User data from backend:', user);
      
      // Save token and user data to localStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      
      console.log('Saved user data:', JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)));
      
      // Set user in state
      setCurrentUser(user);
      
      console.log('Set currentUser in state:', user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (name, email, password, wantAdmin) => {
    try {
      // Format username to be valid for Django (lowercase, no spaces)
      const username = name.toLowerCase().replace(/\s+/g, '_');
      
      const response = await api.post('/auth/register/', {
        username,
        email,
        password,
        password2: password,
        first_name: name.split(' ')[0] || '',
        last_name: name.split(' ').slice(1).join(' ') || '',
        is_admin: wantAdmin,
      });
      
      return { success: true };
    } catch (error) {
      // Return the full error response from backend
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data || {},
      };
    }
  };

  const logout = () => {
    console.log('Logging out, clearing user data');
    // Remove data from localStorage
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    // Clear user from state
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
  };

  console.log('AuthContext providing value:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 