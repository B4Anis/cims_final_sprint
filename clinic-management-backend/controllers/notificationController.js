const MedicationFamily1 = require('../models/family1');
const MedicationFamily2 = require('../models/family2');
const MedicationFamily3 = require('../models/family3');
const MedicationFamily4 = require('../models/family4');
const MedicationFamily5 = require('../models/family5');
const Notification = require('../models/notification');
const User = require('../models/user');
const cron = require('node-cron');

// Constants for thresholds
const LOW_STOCK_THRESHOLD = 10;
const NEAR_EXPIRY_THRESHOLD = 30;
const CRITICAL_STOCK_THRESHOLD = 5;
const CRITICAL_EXPIRY_THRESHOLD = 7;

// Function to check low stock and near expiry
const checkStockAndExpiry = async () => {
  try {
    console.log("Running checkStockAndExpiry...");

    const families = [
      MedicationFamily1,
      MedicationFamily2,
      MedicationFamily3,
      MedicationFamily4,
      MedicationFamily5,
    ];

    for (const family of families) {
      const medications = await family.find();

      for (const medication of medications) {
        console.log(`Evaluating medication: ${medication.marketName}`);

        // Check for stock levels
        if (medication.quantityInStock <= CRITICAL_STOCK_THRESHOLD) {
          await createNotification(
            medication._id,
            `CRITICAL: ${medication.marketName} stock is critically low! Only ${medication.quantityInStock} units remaining. Immediate restock required.`,
            'critical stock'
          );
        } else if (medication.quantityInStock <= medication.minStockLevel) {
          await createNotification(
            medication._id,
            `Low stock alert: ${medication.marketName} has ${medication.quantityInStock} units remaining (Min: ${medication.minStockLevel}). Please reorder soon.`,
            'low stock'
          );
        }

        // Check for expiry dates
        const today = new Date();
        const expiryDate = new Date(medication.expiryDate);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= CRITICAL_EXPIRY_THRESHOLD) {
          await createNotification(
            medication._id,
            `URGENT: ${medication.marketName} expires in ${diffDays} days! Take immediate action.`,
            'critical expiry'
          );
        } else if (diffDays <= NEAR_EXPIRY_THRESHOLD) {
          await createNotification(
            medication._id,
            `${medication.marketName} will expire in ${diffDays} days. Plan for replacement.`,
            'near expiry'
          );
        }

        // Check if already expired
        if (diffDays <= 0) {
          await createNotification(
            medication._id,
            `EXPIRED: ${medication.marketName} has expired! Remove from inventory immediately.`,
            'expired'
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in checkStockAndExpiry:", error);
  }
};

// Function to create a notification
const createNotification = async (medicationId, message, type) => {
  try {
    console.log(`Creating notification: ${message}`);
    
    // Get all users who should receive notifications (admins and pharmacists)
    const users = await User.find({ 
      role: { $in: ['department admin', 'pharmacist'] }
    });

    if (users.length === 0) {
      console.log("No users found to notify.");
      return;
    }

    // Check if a similar notification already exists and is unread
    for (const user of users) {
      const existingNotification = await Notification.findOne({
        userId: user._id,
        medicationId,
        type,
        read: false,
        createdAt: { 
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Within last 24 hours
        }
      });

      if (!existingNotification) {
        const notification = new Notification({
          message,
          type,
          userId: user._id,
          medicationId,
          priority: type.includes('critical') ? 'high' : 'normal'
        });
        await notification.save();
        console.log(`Notification saved for User ${user.fullName}: ${message}`);
      }
    }
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Get unread notifications count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
  }
};

// Create a new notification
const createNotificationWithoutUserId = async (title, message, type, priority = 'medium') => {
  try {
    const notification = new Notification({
      title,
      message,
      type,
      priority,
      read: false,
      createdAt: new Date()
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Check for low stock items
const checkLowStock = async () => {
  try {
    const medications = await MedicationFamily1.find();
    for (const medication of medications) {
      if (medication.quantity <= 5) {
        await createNotificationWithoutUserId(
          'Critical Stock Alert',
          `${medication.name} is critically low (${medication.quantity} units remaining)`,
          'stock',
          'high'
        );
      } else if (medication.quantity <= medication.minStock) {
        await createNotificationWithoutUserId(
          'Low Stock Alert',
          `${medication.name} is running low (${medication.quantity} units remaining)`,
          'stock',
          'medium'
        );
      }
    }
  } catch (error) {
    console.error('Error checking low stock:', error);
  }
};

// Check for expiring items
const checkExpiryDates = async () => {
  try {
    const medications = await MedicationFamily1.find();
    const now = new Date();
    
    for (const medication of medications) {
      const expiryDate = new Date(medication.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry <= 0) {
        await createNotificationWithoutUserId(
          'Expired Item Alert',
          `${medication.name} has expired`,
          'expiry',
          'high'
        );
      } else if (daysUntilExpiry <= 7) {
        await createNotificationWithoutUserId(
          'Critical Expiry Alert',
          `${medication.name} will expire in ${daysUntilExpiry} days`,
          'expiry',
          'high'
        );
      } else if (daysUntilExpiry <= 30) {
        await createNotificationWithoutUserId(
          'Near Expiry Alert',
          `${medication.name} will expire in ${daysUntilExpiry} days`,
          'expiry',
          'medium'
        );
      }
    }
  } catch (error) {
    console.error('Error checking expiry dates:', error);
  }
};

// Schedule periodic checks
cron.schedule('0 */6 * * *', async () => {
  console.log('Running scheduled checks...');
  await checkLowStock();
  await checkExpiryDates();
});

// Fetch notifications for a specific user
const getNotificationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, read, priority } = req.query;

    let query = { userId };

    // Add filters if provided
    if (type) query.type = type;
    if (read !== undefined) query.read = read === 'true';
    if (priority) query.priority = priority;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .limit(100); // Limit to prevent overwhelming response

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a notification as read
const markAsReadForUser = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read for a user
const markAllAsReadForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete old read notifications
const cleanupOldNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Notification.deleteMany({
      read: true,
      createdAt: { $lt: thirtyDaysAgo }
    });
    console.log('Cleaned up old notifications');
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
  }
};

// Schedule automatic checks
// Run stock and expiry check every 6 hours
cron.schedule('0 */6 * * *', checkStockAndExpiry);

// Clean up old notifications once a day
cron.schedule('0 0 * * *', cleanupOldNotifications);

// Initial check on server start
checkStockAndExpiry();

module.exports = {
  checkStockAndExpiry,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotificationWithoutUserId,
  checkLowStock,
  checkExpiryDates,
  getNotificationsForUser,
  markAsReadForUser,
  markAllAsReadForUser,
};
