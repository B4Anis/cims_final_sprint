

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, ActivityLog } from '../../types/user.types';
import './UserManagement.css';

interface ActivityModalProps {
  user: User;
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ user, onClose }) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all'); // Default to 'all'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching activities for user:', user.userID);
        const response = await axios.get(
          `http://localhost:5000/api/users/${user.userID}/activity`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        console.log('Received activities:', response.data);
        const fetchedActivities = Array.isArray(response.data) ? response.data : [];
        setActivities(fetchedActivities);
        setFilteredActivities(fetchedActivities); // Initialize filteredActivities
      } catch (err: any) {
        console.error('Error fetching activities:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch activities');
      } finally {
        setIsLoading(false);
      }
    };

    if (user.userID) {
      fetchActivities();
    }
  }, [user.userID]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    if (type === 'all') {
      setFilteredActivities(activities); // Show all activities
    } else {
      const filtered = activities.filter((activity) =>
        activity.action.toLowerCase().includes(type.toLowerCase())
      );
      setFilteredActivities(filtered); // Show filtered activities
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionType = (action: string): string => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('add') || lowerAction.includes('create')) return 'add';
    if (lowerAction.includes('consumed') || lowerAction.includes('take')) return 'take';
    if (lowerAction.includes('return')) return 'return';
    if (lowerAction.includes('updated') || lowerAction.includes('updat')) return 'modify';
    return 'other';
  };

  return (
    <div className="modal-overlay">
      <div className="modal activity-modal">
        <div className="modal-header">
          <h2>User Activity - {user.fullName}</h2>
          <button className="close-button" onClick={onClose}>x</button>
        </div>

        <div className="activity-controls">
          <label htmlFor="activity-type">Filter by Activity Type:</label>
          <select
            id="activity-type"
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="activity-type-dropdown"
          >
            <option value="all">All</option>
            <option value="add">Addition</option>
            <option value="consum">Consumption</option>
            <option value="modif">Modification</option>
          </select>
        </div>

        <div className="activity-content">
          {isLoading ? (
            <div className="loading">Loading activities...</div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Retry
              </button>
            </div>
          ) : filteredActivities.length === 0 ? (
            <p className="no-activities">No activities found for this type.</p>
          ) : (
            <div className="activity-list">
              {filteredActivities.map((activity, index) => (
  <div key={activity._id || index} className="activity-item">
    <div className="activity-header">
      <span className={`action-type ${getActionType(activity.action)}`}>
        {activity.action.toUpperCase()}
      </span>
      <span className="timestamp">{formatDate(activity.timestamp)}</span>
    </div>
    <div className="activity-details">
      <p><strong>Item:</strong> {activity.itemName}</p>
      <p><strong>Quantity:</strong> {activity.quantity}</p>
      {activity.details && (
        <p><strong>Details:</strong> {activity.details}</p>
      )}
    </div>
  </div>
))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
