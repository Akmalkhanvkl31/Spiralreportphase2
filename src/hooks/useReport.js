/* eslint-disable react-hooks/exhaustive-deps */
// useReport.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const useReport = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { authData } = useAuth();
  const access_token = authData?.access_token || authData?.accessToken;

  useEffect(() => {
    if (!access_token) {
      setError('No access token available.');
    }
  }, [access_token]);

  const fetchReport = useCallback(async (assessmentId) => {
    if (!access_token) {
      setError('No access token available.');
      return null;
    }

    if (isLoading) {
      return null; // Prevent concurrent requests
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://app.spiralreports.com/api/evaluations/${assessmentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const reportData = await response.json();
      setData(reportData);
      return reportData; // Return the data for immediate use
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [access_token]);

  return { data, error, isLoading, fetchReport };
};

export default useReport;