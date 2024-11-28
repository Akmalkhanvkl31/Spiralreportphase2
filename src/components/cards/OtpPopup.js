import React, { useState, useRef, useEffect } from 'react';

const OTPPopup = ({ isOpen = true, onClose = () => {}, onSubmit = () => {} }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isValid, setIsValid] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (isOpen && inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setIsValid(otp.every(digit => digit !== ''));
  }, [otp]);

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value) || value.length > 1) return; // Allow only one digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const pastedArray = pastedData.split('').filter(char => !isNaN(char)); // Filter for digits

    if (pastedArray.length > 0) {
      setOtp(pastedArray.concat(Array(6 - pastedArray.length).fill('')));
      if (inputs.current[pastedArray.length]) {
        inputs.current[pastedArray.length].focus();
      }
    }
  };

  const handleSubmit = () => {
    if (isValid) {
      const otpValue = otp.join('');
      console.log("Submitting OTP:", otpValue); // Log the OTP value
      onSubmit(otpValue);
    }
  };

  const handleClose = () => {
    setOtp(['', '', '', '', '', '']); // Reset OTP state
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Enter Verification Code</h2>
        <p className="text-sm text-gray-600 mb-6">
          Please enter the 6-digit code sent to your device
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              ref={el => inputs.current[index] = el}
              value={digit}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-xl font-semibold border rounded-lg 
                focus:border-[#EF4444] focus:outline-none
                transition-colors"
              style={{
                boxShadow: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield'
              }}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg 
              hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            style={{
              backgroundColor: isValid ? '#EF4444' : '#D1D5DB',
              opacity: isValid ? 1 : 0.7,
              cursor: isValid ? 'pointer' : 'not-allowed'
            }}
            className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPPopup;
