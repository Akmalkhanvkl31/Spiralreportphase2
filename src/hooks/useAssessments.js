import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';

// Custom Hook to Fetch and Manage Assessment Data
const useAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authData } = useAuth();
  
  const access_token = authData?.access_token || authData?.accessToken;

  // Fetch assessments on component mount or when the access token changes
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('https://app.spiralreports.com/api/evaluations?limit=1000&orderBy=desc', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.statusCode === 200) {
          setAssessments(data.data.data); // Store the fetched assessments data
        } else {
          setError(data.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false); // Set loading to false once data is fetched or an error occurs
      }
    };

    fetchAssessments();
  }, [access_token]); // Re-run the effect if access_token changes

  // Function to delete an assessment
  const deleteAssessment = async (assessmentId) => {
    try {
      console.log('Attempting to delete assessment with ID:', assessmentId);
  
      const response = await fetch(`https://app.spiralreports.com/api/evaluations/${assessmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      });
  
      // If the response is not ok, log the error
      if (!response.ok) {
        console.error('Failed to delete assessment. Response:', response);
        const data = await response.json();
        setError(data.message || 'Failed to delete the assessment');
        return;
      }
  
      const data = await response.json();
      console.log('API response after deletion:', data); // Log the API response
  
      if (data.statusCode === 200) {
        console.log('Assessment deleted successfully');
        // Remove the deleted assessment from the list
        setAssessments(prevAssessments =>
          prevAssessments.filter(assessment => assessment.id !== assessmentId)
        );
      } else {
        setError(data.message || 'Failed to delete the assessment');
      }
    } catch (err) {
      console.error('Error during delete:', err);
      setError(err.message || 'Something went wrong while deleting');
    }
  };

  // Return all necessary values so the consuming component can access them
  return { assessments, loading, error, deleteAssessment };
};

export default useAssessments;
