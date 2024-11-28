export const handleRefreshToken = async (refreshToken) => {
  try {
    const response = await fetch('https://app.spiralreports.com/api/auth/user/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to refresh token');
    }

    return data;
  } catch (error) {
    console.error('Refresh token error:', error);
    throw error;
  }
};