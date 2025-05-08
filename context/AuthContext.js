import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken, storeAuthToken, removeAuthToken } from '../services/authStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await getAuthToken();
      setAuthToken(token);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (token) => {
    await storeAuthToken(token);
    setAuthToken(token);
  };

  const logout = async () => {
    await removeAuthToken();
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};