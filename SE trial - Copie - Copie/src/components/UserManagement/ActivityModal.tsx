import React from 'react';
import { User, UserActivity } from '../../types/user.types';
import './UserManagement.css';

interface ActivityModalProps {
    user: User;
    onClose: () => void;
}

// Mock activity data - replace with actual API call
const mockActivities: UserActivity[] = [
    {
        id: '1',
        userId: '1',
        action: 'Updated inventory',
        timestamp: '2024-01-20 14:30:00',
        details: 'Modified stock count for item #1234'
    },
    {
        id: '2',
        userId: '1',
        action: 'Added new item',
        timestamp: '2024-01-19 09:15:00',
        details: 'Added new medication to inventory'
    }
];

export const ActivityModal: React.FC<ActivityModalProps> = ({ user, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal activity-modal">
                <div className="modal-header">
                    <h2>Activity History - {user.name}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="activity-list">
                    {mockActivities.map(activity => (
                        <div key={activity.id} className="activity-item">
                            <div className="activity-time">
                                {activity.timestamp}
                            </div>
                            <div className="activity-content">
                                <div className="activity-action">{activity.action}</div>
                                <div className="activity-details">{activity.details}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
