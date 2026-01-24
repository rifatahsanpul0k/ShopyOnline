import { generatePaymentIntent } from "../utils/generatePaymentIntent.js";
import database from "../database/db.js";

export const createPaymentIntent = async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        console.log("Create Payment Intent Request:", { orderId, amount, type: typeof amount });

        if (!orderId || !amount) {
            return res.status(400).json({
                success: false,
                message: "Order ID and amount are required",
            });
        }

        const result = await generatePaymentIntent(orderId, amount);

        if (result.success) {
            return res.status(200).json({
                success: true,
                clientSecret: result.clientSecret,
            });
        } else {
            console.error("Generate Payment Intent Failed:", result);
            return res.status(500).json({
                success: false,
                message: result.message,
            });
        }
    } catch (error) {
        console.error("Create Payment Intent Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create payment intent",
        });
    }
};

export const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentStatus } = req.body;

        // Map status values to match database schema (capitalized)
        const statusMap = {
            'succeeded': 'Paid',
            'paid': 'Paid',
            'pending': 'Pending',
            'failed': 'Failed'
        };

        const dbPaymentStatus = statusMap[paymentStatus.toLowerCase()] || 'Pending';

        const { rows } = await database.query(
            "UPDATE payments SET payment_status = $1 WHERE order_id = $2 RETURNING *",
            [dbPaymentStatus, orderId]
        );

        console.log("Update Payment Status Result:", { orderId, paymentStatus, dbPaymentStatus, rowCount: rows.length });

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        // Also update order payment status and set paid_at timestamp if payment is successful
        if (dbPaymentStatus === "Paid") {
            await database.query(
                "UPDATE orders SET payment_status = $1, paid_at = NOW() WHERE id = $2",
                [dbPaymentStatus, orderId]
            );
        } else {
            await database.query(
                "UPDATE orders SET payment_status = $1 WHERE id = $2",
                [dbPaymentStatus, orderId]
            );
        }

        return res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            payment: rows[0],
        });
    } catch (error) {
        console.error("Update Payment Status Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update payment status",
        });
    }
};
