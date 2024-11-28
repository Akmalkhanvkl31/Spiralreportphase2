// services/authService.js

/**
 * Handles all authentication-related API calls
 */
export const authService = {
    /**
     * Initiates Google OAuth sign-in process
     * @returns {Promise<{authUrl: string}>} The Google OAuth URL to redirect to
     * @throws {Error} If the API call fails
     */
    googleSignIn: async () => {
      try {
        const response = await fetch('https://app.spiralreports.com/api/auth/user/login/google', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Google sign in API error:', error);
        throw new Error('Failed to connect to Google sign in service');
      }
    },
  
    /**
     * Handles traditional email/password login
     * @param {Object} credentials
     * @param {string} credentials.username
     * @param {string} credentials.password
     * @returns {Promise<Object>} User data
     * @throws {Error} If the API call fails
     */
    login: async (credentials) => {
      // Implement your traditional login API call here
      throw new Error('Traditional login not implemented');
    },
  };