// useDashboardData.js
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';

const useDashboardData = (token) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authData } = useAuth();
  
  const access_token = authData?.access_token || authData?.accessToken;
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://app.spiralreports.com/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,  // Pass token in the header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result);  // Set the fetched data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (access_token) {
      fetchDashboardData();
    }
  }, [access_token]);

  return { data, loading, error };
};

export default useDashboardData;
