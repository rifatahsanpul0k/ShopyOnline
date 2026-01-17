import database from "../database/db.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export async function generatePaymentIntent(orderId, totalPrice) {
    try {
        console.log("Generating Stripe Payment Intent for:", { orderId, totalPrice });

        // Check if payment already exists for this order
        const existingPayment = await database.query(
            "SELECT payment_intent_id, payment_status FROM payments WHERE order_id = $1",
            [orderId]
        );

        if (existingPayment.rows.length > 0) {
            const existingIntentId = existingPayment.rows[0].payment_intent_id;
            const currentDbStatus = existingPayment.rows[0].payment_status;
            console.log("Found existing payment intent:", existingIntentId, "DB Status:", currentDbStatus);

            // Fetch latest status from Stripe
            try {
                const intent = await stripe.paymentIntents.retrieve(existingIntentId);
                console.log("Stripe Intent Status:", intent.status);

                if (intent.status === "succeeded") {
                    // Self-heal: Update DB if it was missed
                    if (currentDbStatus !== "Paid") {
                        await database.query(
                            "UPDATE payments SET payment_status = 'Paid', updated_at = NOW() WHERE order_id = $1",
                            [orderId]
                        );
                        await database.query(
                            "UPDATE orders SET payment_status = 'Paid', paid_at = NOW() WHERE id = $1",
                            [orderId]
                        );
                        console.log("Self-healed payment status to Paid");
                    }

                    return {
                        success: true,
                        clientSecret: intent.client_secret,
                        status: "succeeded"
                    };
                }

                // If canceled, create a new one
                if (intent.status === "canceled") {
                    console.log("Existing intent canceled, creating new one...");
                    await database.query("DELETE FROM payments WHERE order_id = $1", [orderId]);
                    // Fall through to create new
                } else {
                    // Still pending/requires_payment_method, return it
                    return {
                        success: true,
                        clientSecret: intent.client_secret,
                        status: intent.status
                    };
                }
            } catch (stripeError) {
                console.error("Error retrieving existing intent:", stripeError.message);
                // If not found on Stripe, clean up and create new
                await database.query("DELETE FROM payments WHERE order_id = $1", [orderId]);
            }
        }

        // Create new payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(totalPrice)), // Ensure integer (cents)
            currency: "usd",
        });

        console.log("Stripe Payment Intent Created:", paymentIntent.id);

        await database.query(
            "INSERT INTO payments (order_id, payment_type, payment_status, payment_intent_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [orderId, "Online", "Pending", paymentIntent.client_secret]
        );

        return { success: true, clientSecret: paymentIntent.client_secret };
    } catch (error) {
        console.error("Stripe/Database Error:", error);
        return { success: false, message: error.message || "Payment Failed." };
    }
}
