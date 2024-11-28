// useFetchReport.js
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // To get access token

const useFetchReport = (id) => {
  const [isGenerating, setIsGenerating] = useState(true);  // Indicates whether the report is still being generated
  const [error, setError] = useState(null);  // Holds any error messages
  const [attempts, setAttempts] = useState(0);  // Tracks the number of polling attempts
  const [reportData, setReportData] = useState(null);  // Stores the final report data
  const maxAttempts = 10;  // Maximum number of polling attempts before stopping
  const { authData } = useAuth(); // Get the access token from the AuthContext
  const access_token = authData?.access_token || authData?.accessToken;

  useEffect(() => {
    const fetchReportStatus = async () => {
      try {
        const response = await fetch(`https://app.spiralreports.com/api/evaluations/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const data = await response.json();
        
        if (data.statusCode === 200) {
          if (data.data.isGenerated) {
            setIsGenerating(false);  // Set to false once the report is generated
            setReportData(data.data);  // Store the final report data
          } else {
            setIsGenerating(true);   // Continue polling if not generated
          }
        } else {
          setError('Failed to fetch report status. Please try again later.');
          setIsGenerating(false);  // Stop polling if error occurs
        }
      } catch (err) {
        setError('Failed to fetch report status. Please try again later.');
        setIsGenerating(false);  // Stop polling on error
      }
    };

    // Start by fetching the report status immediately
    fetchReportStatus();

    // Poll every 3 seconds (3000 ms) and limit attempts
    const interval = setInterval(() => {
      if (isGenerating && attempts < maxAttempts) {
        setAttempts((prev) => prev + 1);  // Increment the attempt counter
        fetchReportStatus();
      } else {
        clearInterval(interval);  // Stop polling if generated or max attempts reached
      }
    }, 3000); // 3 seconds

    // Cleanup the interval when the component is unmounted or when the report is generated
    return () => clearInterval(interval);
  }, [id, isGenerating, attempts, access_token]);  // Dependencies updated to include access_token

  return { isGenerating, error, attempts, reportData };
};

export default useFetchReport;
