import { Router } from "express";
import {
  createPaymentOrder,
  verifyPaymentSignature,
  getPaymentById,
  handlePaymentWebhook,
  refundPayment,
} from "../controllers/payment.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/create-order", authenticateUser, createPaymentOrder);

router.post("/verify", authenticateUser, verifyPaymentSignature);

router.get("/:paymentId", authenticateUser, getPaymentById);

router.post("/refund", authenticateUser, refundPayment);

router.post("/webhook", handlePaymentWebhook);

export default router;
