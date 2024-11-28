// src/components/forms/EmailInput.js
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const EmailInput = ({ onVerify }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    // Here you would send the email to your backend for verification
    try {
      const response = await fetch('https://app.spiralreports.com/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send verification');
      }

      // Call the onVerify function passed as a prop
      onVerify(email);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-semibold text-center">Verify Your Email</h1>
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      <form onSubmit={handleVerify}>
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Verify</Button>
      </form>
    </div>
  );
};

export default EmailInput;
