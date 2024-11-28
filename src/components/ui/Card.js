// Card.js (create this file in ../components/ui/)
import React from 'react';

const Card = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {children}
    </div>
  );
};

export default Card;
