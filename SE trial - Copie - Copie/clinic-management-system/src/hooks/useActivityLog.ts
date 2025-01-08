import { useCallback } from 'react';

interface ActivityLogParams {
  action: string;
  itemId: string;
  itemName: string;
  quantity: number;
  details?: string;
}

export const useActivityLog = (userId: string) => {
  const logActivity = useCallback(async (activity: ActivityLogParams) => {
    try {
      if (!userId) {
        throw new Error('User ID is required for activity logging');
      }

      console.log('Logging activity for user:', userId, activity);
      
      const response = await fetch(`http://localhost:5000/api/users/${userId}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(activity)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to log activity' }));
        throw new Error(errorData.message || 'Failed to log activity');
      }

      return await response.json();
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }, [userId]);

  return { logActivity };
};
