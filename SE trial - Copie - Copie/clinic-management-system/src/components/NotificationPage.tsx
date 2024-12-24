import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationPage.css';
import SidebarMenu from './SidebarMenu';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('All');
  const notificationTypes = ['All', 'PurchaseRequest', 'LowStock', 'ExpiredItem'];

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notifications');
      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch notifications');
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ));
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  };

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === 'high') {
      return '⚠️';
    }
    switch (type.toLowerCase()) {
      case 'lowstock':
        return priority === 'medium' ? '⚠️' : '📦';
      case 'expireditem':
        return priority === 'medium' ? '⚠️' : '⏰';
      case 'purchaserequest':
        return '🛍️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'notification-high-priority';
    switch (type.toLowerCase()) {
      case 'lowstock':
        return priority === 'medium' ? 'notification-warning' : 'notification-normal';
      case 'expireditem':
        return priority === 'medium' ? 'notification-warning' : 'notification-normal';
      case 'purchaserequest':
        return 'notification-normal';
      default:
        return 'notification-normal';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    return selectedType === 'All' || notification.type.toLowerCase() === selectedType.toLowerCase();
  });

  if (loading) return (
    <div className="app-container">
      <SidebarMenu onCategoryChange={() => {}} />
      <div className="notification-content">
        <div className="loading-spinner">Loading notifications...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="app-container">
      <SidebarMenu onCategoryChange={() => {}} />
      <div className="notification-content">
        <div className="error-message">Error: {error}</div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <SidebarMenu onCategoryChange={() => {}} />
      <div className="notification-content">
        <div className="page-header">
          <div>
            <div className="breadcrumb">
              Home {'>'} Notifications
            </div>
            <h1>Notifications</h1>
          </div>
        </div>

        <div className="controls">
          <div className="notification-tabs">
            {notificationTypes.map(type => (
              <button 
                key={type} 
                className={`tab-button ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
                {type !== 'All' && (
                  <span className="notification-badge">
                    {notifications.filter(n => n.type.toLowerCase() === type.toLowerCase() && !n.isRead).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="notification-count">
            {notifications.filter(n => !n.isRead).length} Unread
          </div>
        </div>

        <div className="notification-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div 
                key={notification._id} 
                className={`notification-item ${notification.isRead ? 'read' : 'unread'} ${getNotificationColor(notification.type, notification.priority)}`}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
              >
                <div className={`notification-icon ${notification.priority === 'high' ? 'high-priority' : ''}`}>
                  {getNotificationIcon(notification.type, notification.priority)}
                </div>
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-meta">
                    <span className="notification-time">{getTimeAgo(notification.createdAt)}</span>
                    <span className={`notification-type ${notification.type.toLowerCase()}`}>
                      {notification.type}
                    </span>
                  </div>
                </div>
                {!notification.isRead && (
                  <span className="unread-indicator" />
                )}
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <span className="empty-icon">📭</span>
              <p>No notifications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;