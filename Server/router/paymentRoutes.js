import express from "express";
import { createPaymentIntent, updatePaymentStatus } from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-payment-intent", isAuthenticated, createPaymentIntent);
router.put("/update-status/:orderId", isAuthenticated, updatePaymentStatus);

export default router;
