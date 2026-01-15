import { Router } from "express";
import {
  handleNewBookingNotification,
  getAdminSettings,
  updateAdminSettings,
  markNotificationAsRead,
  getUnreadNotificationsCount,
} from "../services/notificationService.js";
import admin from "../config/firebase.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();
const db = admin.firestore();

router.post('/booking-created', authenticateUser, async (req, res) => {
  try {
    const { bookingId, bookingData } = req.body;
    const userId = req.user.uid;

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : { email: req.user.email };

    const results = await handleNewBookingNotification(
      { ...bookingData, id: bookingId, bookingId },
      { ...userData, email: req.user.email }
    );

    res.json({
      success: true,
      message: 'Notifications sent',
      results,
    });
  } catch (error) {
    console.error('Error sending booking notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notifications',
      error: error.message,
    });
  }
});

router.get("/admin", async (req, res) => {
  try {
    const { limit = 50, offset = 0, unreadOnly = false } = req.query;

    let query = db.collection("notifications").orderBy("createdAt", "desc");

    if (unreadOnly === "true") {
      query = query.where("read", "==", false);
    }

    const snapshot = await query
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();

    const notifications = [];
    snapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
      });
    });

    res.json({
      success: true,
      notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
});

router.get("/unread-count", async (req, res) => {
  try {
    const count = await getUnreadNotificationsCount();
    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
      error: error.message,
    });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    await markNotificationAsRead(id);

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
});

router.patch("/mark-all-read", async (req, res) => {
  try {
    const snapshot = await db
      .collection("notifications")
      .where("read", "==", false)
      .get();

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, {
        read: true,
        readAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    res.json({
      success: true,
      message: "All notifications marked as read",
      count: snapshot.size,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
});

router.get("/settings", async (req, res) => {
  try {
    const settings = await getAdminSettings();
    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const settings = req.body;
    const result = await updateAdminSettings(settings);

    res.json({
      success: true,
      message: "Settings updated successfully",
      settings: result.settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
});


export default router;
