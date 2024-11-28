// src/context/UserContext.js

import React, { createContext, useContext, useState } from "react";

// Create a UserContext
const UserContext = createContext();

// Create a custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};

// Create a provider component to wrap the app
export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
