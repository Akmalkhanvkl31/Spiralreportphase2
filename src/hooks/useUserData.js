// hooks/useUserData.js
import { useState, useContext, createContext } from 'react';

// Create a context to store user data
const UserDataContext = createContext();

export const useUserData = () => {
  return useContext(UserDataContext);
};

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const setUser = (data) => {
    setUserData(data); // Store user data
  };

  return (
    <UserDataContext.Provider value={{ userData, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};
