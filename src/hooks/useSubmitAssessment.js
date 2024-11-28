import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/AuthContext';

/**
 * Custom hook for submitting the assessment data along with selected tools.
 * @returns {Object} - Provides submit function, loading, error, and success states.
 */
const useSubmitAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { authData } = useAuth();
  const access_token = authData?.access_token || authData?.accessToken;
  const submitAssessment = async (assessmentData, toolsUsed) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const API_URL = "https://app.spiralreports.com/api/evaluations/new";  // Change to the actual API URL

    try {
      // Prepare request body
      const requestBody = {
        assessmentId: assessmentData.assessmentId,
        receipient: assessmentData.receipient||"SELF",
        name: assessmentData.name || "string",
        compliance: assessmentData.compliance || "string",
        response: assessmentData.questions.map((question) => ({
          question: question.question,
          considerScore: question.considerScore || true,  // Assuming considerScore is optional
          options: question.options.map((option) => ({
            text: option.text,
            level: option.level,
          })),
        })),
        toolsUsed: toolsUsed,  // Send the tools used
      };

      // API call
      const response = await axios.post(API_URL, requestBody, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess(true);
      setLoading(false);
      return response.data;  // Return the data received from the API (for further processing)
    } catch (err) {
      setError('Error submitting the assessment. Please try again.');
      setLoading(false);
      throw err;  // Rethrow error to allow handling in the component
    }
  };

  return {
    submitAssessment,
    loading,
    error,
    success,
  };
};

export default useSubmitAssessment;
