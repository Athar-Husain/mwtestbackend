import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createPaymentOrder,
  verifyPaymentWebhook,
  refundPaymentController,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/order", authMiddleware, createPaymentOrder);
router.post("/webhook", verifyPaymentWebhook); // Razorpay webhook endpoint
router.post("/refund", authMiddleware, refundPaymentController);

export default router;
