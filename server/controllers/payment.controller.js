import Razorpay from "razorpay";
import crypto from "crypto";
import admin from "../config/firebase.js";
const db = admin.firestore();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingData, amount } = req.body;
    const userId = req.user.uid;

    const numericAmount =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[₹,]/g, ""))
        : amount;

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const amountInPaisa = Math.round(numericAmount * 100);

    const bookingDoc = {
      userId,
      userName: req.user.name || req.user.email,
      userEmail: req.user.email,
      carName: bookingData.carName,
      carModel: bookingData.carModel,
      capacity: bookingData.capacity,
      luggage: bookingData.luggage,
      mobileNumber: bookingData.mobileNumber,
      from: bookingData.from,
      to: bookingData.to,
      route: bookingData.route,
      tripType: bookingData.tripType,
      selectedPickupDate: bookingData.selectedPickupDate,
      selectedPickupTime: bookingData.selectedPickupTime,
      selectedReturnDate: bookingData.selectedReturnDate || null,
      pickupSubLocation: bookingData.pickupSubLocation || null,
      dropSubLocation: bookingData.dropSubLocation || null,
      pickupCoordinates: bookingData.pickupCoordinates || null,
      dropCoordinates: bookingData.dropCoordinates || null,
      pricePerKm: bookingData.pricePerKm || null,
      minKm: bookingData.minKm || null,
      pricingId: bookingData.pricingId || null,
      amount: numericAmount,
      status: "pending",
      paymentStatus: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const bookingRef = await db.collection("bookings").add(bookingDoc);
    const bookingId = bookingRef.id;
    const shortReceipt = `bk_${bookingId.slice(0, 20)}_${Date.now()
      .toString()
      .slice(-10)}`;

    const orderOptions = {
      amount: amountInPaisa,
      currency: "INR",
      receipt: shortReceipt,
      notes: {
        bookingId,
        userId,
        carName: bookingData.carName,
        route: bookingData.route,
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    const paymentDoc = {
      userId,
      userName: req.user.name || req.user.email,
      userEmail: req.user.email,
      bookingId,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaisa,
      currency: "INR",
      status: "created",
      tripType: bookingData.tripType,
      bookingDetails: {
        carName: bookingData.carName,
        carModel: bookingData.carModel,
        from: bookingData.from,
        to: bookingData.to,
        route: bookingData.route,
        capacity: bookingData.capacity,
        luggage: bookingData.luggage,
        tripType: bookingData.tripType,
        mobileNumber: bookingData.mobileNumber,
        selectedPickupDate: bookingData.selectedPickupDate,
        selectedPickupTime: bookingData.selectedPickupTime,
        selectedReturnDate: bookingData.selectedReturnDate || null,
        pickupSubLocation: bookingData.pickupSubLocation || null,
        dropSubLocation: bookingData.dropSubLocation || null,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const paymentRef = await db.collection("payments").add(paymentDoc);

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: amountInPaisa,
      currency: "INR",
      bookingId,
      paymentId: paymentRef.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

export const verifyPaymentSignature = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      bookingId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await db.collection("payments").doc(paymentId).update({
        status: "failed",
        error: "Signature verification failed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    await db.collection("payments").doc(paymentId).update({
      status: "success",
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("bookings").doc(bookingId).update({
      status: "confirmed",
      paymentStatus: "completed",
      paymentId,
      razorpayPaymentId: razorpay_payment_id,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      bookingId,
      paymentId,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.uid;

    const paymentDoc = await db.collection("payments").doc(paymentId).get();

    if (!paymentDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const paymentData = paymentDoc.data();

    if (paymentData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      payment: {
        id: paymentDoc.id,
        ...paymentData,
      },
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message,
    });
  }
};

export const updatePaymentStatus = async (paymentId, status, details = {}) => {
  try {
    await db
      .collection("payments")
      .doc(paymentId)
      .update({
        status,
        ...details,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

export const handlePaymentWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (webhookSignature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;

    const paymentsRef = db.collection("payments");
    const querySnapshot = await paymentsRef
      .where("razorpayOrderId", "==", paymentEntity.order_id)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      console.error("Payment not found for order:", paymentEntity.order_id);
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const paymentDoc = querySnapshot.docs[0];
    const paymentData = paymentDoc.data();

    switch (event) {
      case "payment.captured":
        await db.collection("payments").doc(paymentDoc.id).update({
          status: "success",
          razorpayPaymentId: paymentEntity.id,
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        if (paymentData.bookingId) {
          await db.collection("bookings").doc(paymentData.bookingId).update({
            status: "confirmed",
            paymentStatus: "completed",
            razorpayPaymentId: paymentEntity.id,
            completedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
        break;

      case "payment.failed":
        await db
          .collection("payments")
          .doc(paymentDoc.id)
          .update({
            status: "failed",
            razorpayPaymentId: paymentEntity.id,
            error: paymentEntity.error_description || "Payment failed",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

        if (paymentData.bookingId) {
          await db.collection("bookings").doc(paymentData.bookingId).update({
            status: "cancelled",
            paymentStatus: "failed",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
        break;

      default:
        console.log("Unhandled event:", event);
    }

    res.status(200).json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error.message,
    });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.uid;

    const bookingDoc = await db.collection("bookings").doc(bookingId).get();

    if (!bookingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const bookingData = bookingDoc.data();

    if (bookingData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (
      bookingData.status !== "confirmed" &&
      bookingData.status !== "pending"
    ) {
      return res.status(400).json({
        success: false,
        message: "Booking is not eligible for refund",
      });
    }

    if (bookingData.paymentStatus !== "completed") {
      return res.status(400).json({
        success: false,
        message: "No payment found to refund",
      });
    }

    const paymentsRef = db.collection("payments");
    const paymentQuery = await paymentsRef
      .where("bookingId", "==", bookingId)
      .where("status", "==", "success")
      .limit(1)
      .get();

    if (paymentQuery.empty) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    const paymentDoc = paymentQuery.docs[0];
    const paymentData = paymentDoc.data();

    if (paymentData.refundStatus === "processed") {
      return res.status(400).json({
        success: false,
        message: "Refund already processed",
      });
    }

    const refund = await razorpay.payments.refund(
      paymentData.razorpayPaymentId,
      {
        amount: paymentData.amount,
        speed: "normal", 
        notes: {
          bookingId,
          reason: "Booking cancelled by user",
        },
      }
    );

    await db.collection("payments").doc(paymentDoc.id).update({
      refundStatus: "processed",
      refundId: refund.id,
      refundAmount: refund.amount,
      refundedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("bookings").doc(bookingId).update({
      status: "cancelled",
      paymentStatus: "refunded",
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: "Refund initiated successfully",
      refundId: refund.id,
      refundAmount: refund.amount / 100, 
      estimatedDays: "5-7 business days",
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process refund",
      error: error.message,
    });
  }
};
