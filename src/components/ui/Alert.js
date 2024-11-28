// Alert.js
import React from 'react';

const Alert = ({ variant, children, className }) => {
  const baseClasses = `p-4 mb-4 rounded-lg ${className}`;
  const variantClasses = {
    destructive: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant] || ''}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }) => {
  return <div>{children}</div>;
};

export default Alert; // Ensure this is the default export
