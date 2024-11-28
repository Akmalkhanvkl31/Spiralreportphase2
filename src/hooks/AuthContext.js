/* eslint-disable react-hooks/exhaustive-deps */
// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Use navigate in the context of the existing Router

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const storedData = localStorage.getItem('authData');
    return storedData ? JSON.parse(storedData) : null;
  });

  const [otpResponse, setOtpResponse] = useState(null); // New state for OTP response
  const [isRefreshing, setIsRefreshing] = useState(false); // To prevent multiple refresh calls
  const navigate = useNavigate(); // Now safe to use useNavigate()

  useEffect(() => {
    // If authData exists, check if the access token is expired
    if (authData && authData.accessToken) {
      const isTokenExpired = checkTokenExpiry(authData.accessToken);
      if (isTokenExpired) {
        refreshToken(); // Call the refresh token function if expired
      }
    }
  }, [authData]);

  // Function to check if the JWT token is expired
  const checkTokenExpiry = (token) => {
    try {
      const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return exp < currentTime; // Return true if the token is expired
    } catch (e) {
      console.error('Error checking token expiry:', e);
      return true; // If decoding fails, assume expired
    }
  };

  // Function to refresh the token if expired
  const refreshToken = async () => {
    if (isRefreshing || !authData?.refreshToken || !authData?.userId) {
      return; // Prevent multiple refresh calls
    }

    setIsRefreshing(true);

    try {
      const response = await fetch('https://app.spiralreports.com/api/auth/user/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authData.userId,
          refreshToken: authData.refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.accessToken) {
          // Successfully refreshed token
          setAuthData((prevState) => ({
            ...prevState,
            accessToken: data.accessToken,
          }));
          localStorage.setItem(
            'authData',
            JSON.stringify({ ...authData, accessToken: data.accessToken })
          );
        } else {
          // Handle case where there's no new access token returned
          console.error('No new access token returned, logging out...');
          logoutAndRedirect();
        }
      } else {
        // If refresh API call fails, log out and redirect to login page
        console.error('Refresh token API failed, logging out...');
        logoutAndRedirect();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logoutAndRedirect();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper function to log out and navigate to the login page
  const logoutAndRedirect = () => {
    setAuthData(null);
    localStorage.removeItem('authData');
    setOtpResponse(null); // Clear OTP response on logout
    navigate('/login'); // Redirect to login page
  };

  const login = (data) => {
    setAuthData(data);
    localStorage.setItem('authData', JSON.stringify(data));
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('authData');
    setOtpResponse(null); // Clear OTP response on logout
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        login,
        setAuthData,
        logout,
        otpResponse,
        setOtpResponse,
        refreshToken, // Add refreshToken here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
