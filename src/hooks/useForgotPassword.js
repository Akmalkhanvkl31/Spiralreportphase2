/* eslint-disable no-unused-vars */
import { useState } from 'react';

const useForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const sendForgotPasswordRequest = async (email) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('https://app.spiralreports.com/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const responseData = await response.json(); // parse response body if needed
        setSuccessMessage('Password reset link has been sent to your email!');
      } else {
        // Error handling when response is not successful
        const errorData = await response.json();
        console.error('Error response data:', errorData); // Log the error data for debugging
        setErrorMessage(errorData.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      console.error('API error:', error); // Log the error in the console
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    errorMessage,
    successMessage,
    sendForgotPasswordRequest,
  };
};

export default useForgotPassword;
