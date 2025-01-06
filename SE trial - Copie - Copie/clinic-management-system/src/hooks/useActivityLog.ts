import { useCallback } from 'react';

export const useActivityLog = (userId: string) => {
  const logActivity = useCallback(async (activity: {
    action: string;
    itemId: string;
    itemName: string;
    quantity: number;
    details?: string;
  }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required for activity logging');
      }

      console.log('Logging activity for user:', userId, activity);
      
      const response = await fetch(`http://localhost:5000/api/users/${userId}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...activity,
          userId
        }), 
      });

      console.log('Response status:', response.status);
      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);

      if (!response.ok) {
        let errorMessage = 'Failed to log activity';
        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const textError = await response.text();
            console.error('Non-JSON error response:', textError);
            errorMessage = textError || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Activity logged successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in logActivity:', error);
      throw error;
    }
  }, [userId]);

  return { logActivity };
};
