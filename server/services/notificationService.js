
import admin from '../config/firebase.js';
import { sendBookingNotification } from './emailService.js';

const db = admin.firestore();

export const createNotification = async (notificationData) => {
  try {
    const notification = {
      ...notificationData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      type: notificationData.type || 'booking',
    };

    const docRef = await db.collection('notifications').add(notification);
    
    return {
      success: true,
      id: docRef.id,
      notification,
    };
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getAdminSettings = async () => {
  try {
    const settingsDoc = await db.collection('settings').doc('admin').get();
    
    if (!settingsDoc.exists) {
      return {
        emailNotifications: true,
        bookingAlerts: true,
        email: process.env.ADMIN_EMAIL,
      };
    }
    
    return settingsDoc.data();
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return {
      emailNotifications: true,
      bookingAlerts: true,
    };
  }
};

export const handleNewBookingNotification = async (bookingData, userData) => {
  try {
    const adminSettings = await getAdminSettings();
    
    const bookingDetails = {
      bookingId: bookingData.id || bookingData.bookingId,
      customerName: userData.displayName || userData.name || 'Guest User',
      customerEmail: userData.email || 'no-email@example.com',
      customerPhone: userData.phone || userData.phoneNumber || 'Not provided', 
      carName: bookingData.carName || 'Unknown Vehicle',
      carModel: bookingData.carModel || 'N/A',
      route: bookingData.route || 'N/A',
      from: bookingData.from || 'N/A',
      to: bookingData.to || 'N/A',
      amount: bookingData.amount || '₹0',
      tripType: bookingData.tripType || 'oneWay',
      bookingDate: bookingData.bookingDate || new Date().toISOString(),
    };

    const results = {
      email: { success: false },
      inApp: { success: false },
    };

    if (adminSettings.emailNotifications) {
      results.email = await sendBookingNotification(bookingDetails, adminSettings);
    }
    if (adminSettings.bookingAlerts) {
      const inAppNotification = await createNotification({
        title: 'New Booking Received',
        message: `${bookingDetails.customerName} booked ${bookingDetails.carName} for ${bookingDetails.route}`,
        booking: bookingDetails, 
        priority: 'high',
      });
      results.inApp = inAppNotification;
    }

    return results;
  } catch (error) {
    console.error('Error handling booking notification:', error);
    throw error;
  }
};
export const updateAdminSettings = async (settings) => {
  try {
    await db.collection('settings').doc('admin').set(settings, { merge: true });
    return { success: true, settings };
  } catch (error) {
    console.error('Error updating admin settings:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await db.collection('notifications').doc(notificationId).update({
      read: true,
      readAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const getUnreadNotificationsCount = async () => {
  try {
    const snapshot = await db
      .collection('notifications')
      .where('read', '==', false)
      .get();
    
    return snapshot.size;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

export default {
  createNotification,
  getAdminSettings,
  handleNewBookingNotification,
  updateAdminSettings,
  markNotificationAsRead,
  getUnreadNotificationsCount,
};