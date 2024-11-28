import { useState } from 'react';
import axios from 'axios';  // You can use any HTTP client like axios
import { useAuth } from './AuthContext'; // To get access token

const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authData } = useAuth(); // Get the access token from the AuthContext

  const access_token = authData?.access_token || authData?.accessToken;

  const updateProfile = async (formData) => {
    setIsLoading(true);
    setError(null);  // Reset any previous errors

    try {
      const response = await axios.patch(
        'https://app.spiralreports.com/api/users',  // Ensure this is the correct endpoint
        {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,  // Pass company directly
          industry: formData.industry || '',  // Empty string as fallback if industry is not provided
          workRole: formData.workRole,
          country: formData.country || '',  // Same for country
          // Removed password field from the request
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Log and return the response data if needed
      console.log('Profile updated successfully:', response.data);
      return response.data;  // Return response for further handling in the calling component
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      
      // Log error for debugging (you can customize the error message here)
      console.error('Error details:', err.response ? err.response.data : err.message);  

      // Optionally, you can extract and display a more specific error message from the API response
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Failed to update profile.');
      }

      // Optionally, re-throw the error if you want the calling component to handle it
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading, error };
};

export default useUpdateProfile;
