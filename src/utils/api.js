const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



export const updateCanvas = async (uuid, elements) => {
  const token = localStorage.getItem('whiteboard_user_token');
  if (!token) throw new Error('No token provided');
  if (!uuid) throw new Error('No canvas UUID provided');

  try {
    const response = await fetch(`${API_BASE_URL}/canvas/${uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ elements }),
    });

    if (!response.ok) {
      const errorRes = await response.json();
      throw new Error(errorRes.message || 'Failed to update canvas');
    }

    const data = await response.json();
  } catch (err) {
    console.error('Update failed:', err.message);
  }
};
