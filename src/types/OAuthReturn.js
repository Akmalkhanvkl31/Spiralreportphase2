import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthReturn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthReturn = () => {
      try {
        // Get the state parameter from URL
        const urlParams = new URLSearchParams(window.location.search);
        const stateParam = urlParams.get('state');

        if (!stateParam) {
          throw new Error('No state parameter found');
        }

        // Decode the base64 state parameter
        const decodedState = atob(stateParam);
        
        // Split the decoded state to get userId and refreshToken
        const [userId, refreshToken] = decodedState.split('$:$');

        if (!userId || !refreshToken) {
          throw new Error('Invalid state parameter format');
        }

        // Store the tokens
        localStorage.setItem('userId', userId);
        localStorage.setItem('refreshToken', refreshToken);

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('OAuth return error:', error);
        navigate('/login?error=auth_failed');
      }
    };

    handleOAuthReturn();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processing your sign in...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default OAuthReturn;