// Base API URL based on environment
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://app.spiralreports.com';

// Frontend callback URL for Google OAuth
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
const GOOGLE_REDIRECT_URI = `${FRONTEND_URL}/oauth/google/callback`;

// Auth endpoints
export const AUTH_ENDPOINTS = {
  // Include state parameter in Google login URL for security
  GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/user/login/google`,
  // Pass redirect_uri as a query parameter in the callback
  GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/oauth/google?redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}`,
  SEND_CONFIRM_EMAIL: `${API_BASE_URL}/api/users/send-confirm-email`,
  CONFIRM_EMAIL: `${API_BASE_URL}/api/users/confirm-email`,
  // Use the correct OTP verification endpoint from API docs
  VERIFY_GOOGLE_OTP: `${API_BASE_URL}/api/auth/verify-otp-login`,
};
