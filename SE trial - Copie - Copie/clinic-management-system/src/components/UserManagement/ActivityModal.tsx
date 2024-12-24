import React, { useState, useEffect } from 'react';
import { User } from '../../types/user.types';
import './UserManagement.css';

interface ActivityModalProps {
  user: User;
  onClose: () => void;
}

interface Activity {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ user, onClose }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch activities when the modal is opened
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/users/${user.userID}/activity`);
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [user.userID]);

  // Handle adding a new activity
  const handleAddActivity = async () => {
    if (!newActivity.trim()) {
      alert('Activity description cannot be empty.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/users/${user.userID}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: newActivity,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add activity');
      }

      const newActivityData = await response.json();
      setActivities([...activities, newActivityData]);
      setNewActivity('');
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>User Activity - {user.fullName}</h2>

        {/* Display activities */}
        <div className="activity-list">
          {isLoading ? (
            <p>Loading activities...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : activities.length === 0 ? (
            <p>No activities found.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <p className="activity-action">{activity.action}</p>
                <p className="activity-timestamp">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
                {activity.details && (
                  <p className="activity-details">{activity.details}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add new activity */}
        <div className="add-activity">
          <textarea
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            placeholder="Enter new activity..."
            disabled={isLoading}
          />
          <button
            onClick={handleAddActivity}
            disabled={isLoading || !newActivity.trim()}
            className="add-activity-btn"
          >
            Add Activity
          </button>
        </div>

        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};
