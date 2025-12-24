import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authLogin, authLogout } from '../store/slices/authSlice';
import { loginUser } from '../helper/requests-method/apiMethods';
import { getDashboardPath } from '../utils/routeUtils';

const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing user session on app load
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        dispatch(authLogin({ user: parsed, token }));
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      
      if (response.token && response.role) {
        const userData = {
          id: response.id || 1,
          email,
          role: response.role.toLowerCase(),
          name: response.name || 'User',
          token: response.token
        };

        setUser(userData);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(userData));
        dispatch(authLogin({ user: userData, token: response.token }));
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberEmail');
    // Clear sidebar state
    localStorage.removeItem('studentSidebar:openDropdown');
    localStorage.removeItem('teacherSidebar:openDropdown');
    localStorage.removeItem('sidebar:openDropdown');
    localStorage.removeItem('studentSidebar:isOpen');
    localStorage.removeItem('teacherSidebar:isOpen');
    localStorage.removeItem('sidebar:isOpen');
    dispatch(authLogout());
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('authToken');
  };

  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  const getDashboardPathForUser = () => {
    return getDashboardPath(user?.role);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    getDashboardPath: getDashboardPathForUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};