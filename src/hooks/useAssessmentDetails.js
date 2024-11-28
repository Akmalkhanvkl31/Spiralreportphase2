import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';

function useAssessmentDetails(id) {
  const [assessmentDetails, setAssessmentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authData } = useAuth();
  
  const access_token = authData?.access_token || authData?.accessToken;

  // Check if the access_token exists
  useEffect(() => {
    if (!id || !access_token) {
      setError('No assessment ID or access token available');
      return;
    }

    setLoading(true);
    setError(null);

    const fetchAssessmentDetails = async () => {
      try {
        console.log('Fetching assessment details for id:', id);
        const response = await fetch(`https://app.spiralreports.com/api/assessments/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,  // Ensure valid access_token
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        // console.log('API Response Data:', data);  // Debugging the actual response

        if (data && data.data) {
          setAssessmentDetails(data.data);
        } else {
          throw new Error('No assessment details found');
        }

      } catch (error) {
        console.error('Error fetching assessment:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentDetails();
  }, [id, access_token]);  // Effect runs whenever `id` or `access_token` changes

  // Return all the relevant data
  return { assessmentDetails, loading, error };
}

export default useAssessmentDetails;
