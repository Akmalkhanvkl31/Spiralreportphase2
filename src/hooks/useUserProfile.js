// src/hooks/useUserProfile.js
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useUserContext } from '../context/UserContext';

const useUserProfile = () => {
  const { authData } = useAuth();
  const { setUserProfile, userProfile } = useUserContext(); // Assuming you have userProfile in context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const access_token = authData?.access_token || authData?.accessToken;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!access_token) {
        setLoading(false);
        setError('Access token is missing');
        return;
      }

      try {
        const response = await fetch('https://app.spiralreports.com/api/users/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserProfile(data.data);  // Store the fetched profile in context
        } else {
          setError(data.message || 'Error fetching profile');
        }
      } catch (error) {
        setError('An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [access_token, setUserProfile]);

  return { userProfile, loading, error };
};

export default useUserProfile;
