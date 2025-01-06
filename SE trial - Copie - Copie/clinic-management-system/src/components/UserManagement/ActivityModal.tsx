import React, { useState, useEffect } from 'react';
import { User, ActivityLog } from '../../types/user.types';
import './UserManagement.css';

interface ActivityModalProps {
  user: User;
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ user, onClose }) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch activities when the modal is opened
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching activities for user:', user.userID);
        const response = await fetch(`http://localhost:5000/api/users/${user.userID}/activity`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received activities:', data);
        setActivities(Array.isArray(data) ? data : []);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching activities:', err);
        setError(err.message || 'Failed to fetch activities');
        setIsLoading(false);
      }
    };

    if (user.userID) {
      fetchActivities();
    }
  }, [user.userID]);

  const formatActivityMessage = (activity: ActivityLog): string => {
    return `${activity.action} ${activity.quantity} units of ${activity.itemName}${activity.details ? ` - ${activity.details}` : ''}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>User Activity - {user.fullName}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="activity-list">
          {isLoading ? (
            <p>Loading activities...</p>
          ) : error ? (
            <div className="error">
              <p>Error: {error}</p>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Retry
              </button>
            </div>
          ) : activities.length === 0 ? (
            <p>No activities found for this user.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity._id || `${activity.timestamp}-${activity.itemId}`} className="activity-item">
                <div className="activity-header">
                  <span className="activity-timestamp">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="activity-content">
                  <p className="activity-message">
                    {formatActivityMessage(activity)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
