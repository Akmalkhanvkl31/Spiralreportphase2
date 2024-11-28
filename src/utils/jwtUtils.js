import { jwtDecode } from 'jwt-decode';  // Correct named import

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);  // Use the named export function
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp < currentTime;  // Return true if the token has expired
  } catch (error) {
    console.error("Error decoding token", error);
    return true;  // Return true if there was an issue with the token
  }
};
