import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button'; // Assuming you have this Button component or use Tailwind for custom styles
import { Input } from '../components/ui/Input'; // Same as above for Input
import useForgotPassword from '../hooks/useForgotPassword'; // Import the custom hook

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const { isSubmitting, errorMessage, successMessage, sendForgotPasswordRequest } = useForgotPassword();
  const [isSuccess, setIsSuccess] = useState(false); // Track success status

  // Close modal automatically after success
  useEffect(() => {
    if (isSuccess) {
      // Delay the modal close by 2 seconds to show success message
      const timer = setTimeout(() => {
        onClose(); // Close the modal after success
      }, 2000); // 2 seconds delay for success message visibility
      return () => clearTimeout(timer); // Clean up timeout if component unmounts or state changes
    }
  }, [isSuccess, onClose]);

  if (!isOpen) return null; // Don't render the modal if it's not open

  const handleSubmit = async () => {
    if (!email) {
      alert('Please enter a valid email address');
      return;
    }

    // Reset success/error states before making the API call
    setIsSuccess(false);

    // Call the API to send the reset link
    const response = await sendForgotPasswordRequest(email);
    
    if (response && response.statusCode === 200) {
      // If success, show success message and close the modal after delay
      setIsSuccess(true); // Set success status
    } else {
      // Handle failure or display error
      console.log("Error occurred during password reset:", response);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full sm:w-96">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Forgot Password</h2>

        {/* Error or Success Message */}
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
        {isSuccess ? (
          <p className="text-green-500 text-sm mb-4">Password reset link has been sent!</p>
        ) : successMessage && !isSuccess ? (
          <p className="text-green-500 text-sm mb-4">{successMessage}</p> // Show the success message from the API response
        ) : null}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={onClose} // Close the modal on cancel
            className="px-4 py-2 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Button>
          <Button
            variant="ghost"
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
