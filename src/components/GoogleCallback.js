import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AUTH_ENDPOINTS } from '../utils/constants';
import OTPPopup from './cards/OtpPopup';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/AuthContext';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthData } = useAuth();
  const [error, setError] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const state = urlParams.get('state');
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
          throw new Error(decodeURIComponent(error));
        }

        if (!code) {
          throw new Error('Authorization code not found');
        }

        if (!state) {
          throw new Error('State parameter missing');
        }

        // Verify state matches what we stored
        const storedState = sessionStorage.getItem('googleOAuthState');
        if (state !== storedState) {
          throw new Error('Invalid state parameter');
        }

        // Clear stored state
        sessionStorage.removeItem('googleOAuthState');

        // Call the backend with the authorization code
        const response = await fetch(AUTH_ENDPOINTS.GOOGLE_CALLBACK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state
          }),
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to authenticate');
        }

        const data = await response.json();
        
        if (!data || !data.email) {
          throw new Error('Invalid response from server');
        }

        setUserEmail(data.email);
        setUserId(data.userId);
        
        // Check if user exists
        if (data.isNewUser) {
          // Redirect to signup with pre-filled email
          navigate('/signup', {
            state: {
              email: data.email,
              googleAuth: true
            }
          });
          return;
        }

        // Store initial auth data if provided
        if (data.initialAuthData) {
          setAuthData(data.initialAuthData);
          localStorage.setItem('authData', JSON.stringify(data.initialAuthData));
        }

        // Show OTP popup for verification
        setIsLoading(false);
        setShowOtpPopup(true);

      } catch (error) {
        console.error('Authentication Error:', error);
        setError(error.message || 'Authentication failed');
        setIsLoading(false);
        
        toast.error(error.message || 'Authentication failed. Please try again.', {
          position: "bottom-right",
          autoClose: 5000
        });

        // Delay redirect to show error message
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              error: error.message || 'Authentication failed. Please try again.' 
            } 
          });
        }, 5000);
      }
    };

    processOAuthCallback();
  }, [location, navigate, setAuthData]);

  const handleOtpSubmit = async (otpValue) => {
    try {
      setIsLoading(true);
      
      // Verify OTP and complete authentication
      const verifyResponse = await fetch(AUTH_ENDPOINTS.VERIFY_GOOGLE_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          otp: otpValue,
          type: "EMAIL",
          context: "TWOFA"
        }),
        credentials: 'include'
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || 'Invalid verification code');
      }

      const data = await verifyResponse.json();
      
      if (!data.data || !data.data.access_token || !data.data.refresh_token) {
        throw new Error('Invalid authentication response');
      }

      const { access_token, refresh_token, user } = data.data;

      // Store authentication data
      const authData = {
        ...user,
        accessToken: access_token,
        refreshToken: refresh_token,
      };

      setAuthData(authData);
      localStorage.setItem('authData', JSON.stringify(authData));

      toast.success('Successfully authenticated! Redirecting to dashboard...', {
        position: "bottom-right",
        autoClose: 3000
      });

      // Navigate to dashboard after successful verification
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (error) {
      console.error('OTP Verification Error:', error);
      setError(error.message || 'Verification failed');
      setShowOtpPopup(false);
      
      toast.error(error.message || 'Verification failed. Please try again.', {
        position: "bottom-right",
        autoClose: 5000
      });

      // Show error briefly before redirecting
      setTimeout(() => {
        navigate('/login', {
          state: {
            error: 'Verification failed. Please try again.'
          }
        });
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2 text-gray-500">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showOtpPopup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OTPPopup
          isOpen={showOtpPopup}
          onClose={() => {
            setShowOtpPopup(false);
            navigate('/login');
          }}
          onSubmit={handleOtpSubmit}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Completing Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we finish setting up your account...
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
