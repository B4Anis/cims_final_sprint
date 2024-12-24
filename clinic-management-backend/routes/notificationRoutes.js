const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require('../controllers/notificationController');

// Get all notifications
router.get('/', getNotifications);

// Get unread notifications count
router.get('/unread/count', getUnreadCount);

// Mark a notification as read
router.put('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.put('/markAll', markAllAsRead);

module.exports = router;
