import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // To get access token

const useTransactions = (page = 1, limit = 10, orderBy = 'desc') => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0); // To store total pages info
  const { authData } = useAuth(); // Get the access token from the AuthContext
  const access_token = authData?.access_token || authData?.accessToken;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!access_token) {
        setError('Access token is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://app.spiralreports.com/api/transactions/all?page=${page}&limit=${limit}&orderBy=${orderBy}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();

        // Assuming the response data is structured like:
        // data: { results: [], totalPages: 3 }
        setTransactions(data.data.results); // Set the transactions array
        setTotalPages(data.data.totalPages); // Set total pages for pagination
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch transactions if access_token is available
    if (access_token) {
      fetchTransactions();
    }
  }, [access_token, page, limit, orderBy]); // Re-fetch when any of these dependencies change

  return { transactions, loading, error, totalPages };
};

export default useTransactions;
