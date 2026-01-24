import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { sendEmail } from "../utils/sendEmail.js";

// Handle contact form submission
export const sendContactMessage = catchAsyncErrors(async (req, res, next) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return next(new ErrorHandler("Please provide all required fields.", 400));
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new ErrorHandler("Please provide a valid email address.", 400));
    }

    // Create email template for admin
    const adminMessage = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
                    padding: 30px;
                    text-align: center;
                }
                .header h1 {
                    color: #ffffff;
                    margin: 0;
                    font-size: 28px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .content {
                    padding: 40px 30px;
                }
                .info-row {
                    margin-bottom: 20px;
                    border-bottom: 1px solid #e0e0e0;
                    padding-bottom: 15px;
                }
                .info-label {
                    font-weight: 700;
                    color: #333333;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 5px;
                }
                .info-value {
                    color: #555555;
                    font-size: 16px;
                    line-height: 1.6;
                }
                .message-box {
                    background-color: #f9f9f9;
                    border-left: 4px solid #000000;
                    padding: 20px;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .footer {
                    background-color: #f4f4f4;
                    padding: 20px;
                    text-align: center;
                    color: #666666;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Contact Message</h1>
                </div>
                <div class="content">
                    <div class="info-row">
                        <div class="info-label">From</div>
                        <div class="info-value">${name}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Email</div>
                        <div class="info-value">${email}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Subject</div>
                        <div class="info-value">${subject}</div>
                    </div>
                    <div class="info-label">Message</div>
                    <div class="message-box">
                        <div class="info-value">${message.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
                <div class="footer">
                    <p>This message was sent from the ShopyOnline contact form.</p>
                    <p>&copy; ${new Date().getFullYear()} ShopyOnline. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    // Create confirmation email for user
    const userMessage = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
                    padding: 30px;
                    text-align: center;
                }
                .header h1 {
                    color: #ffffff;
                    margin: 0;
                    font-size: 28px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .content {
                    padding: 40px 30px;
                    line-height: 1.8;
                }
                .content p {
                    color: #555555;
                    font-size: 16px;
                    margin: 15px 0;
                }
                .highlight {
                    font-weight: 700;
                    color: #000000;
                }
                .footer {
                    background-color: #f4f4f4;
                    padding: 20px;
                    text-align: center;
                    color: #666666;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Message Received</h1>
                </div>
                <div class="content">
                    <p>Hi <span class="highlight">${name}</span>,</p>
                    <p>Thank you for contacting <span class="highlight">ShopyOnline</span>. We have received your message and will get back to you within 24 hours.</p>
                    <p>Our support team is reviewing your inquiry regarding: <span class="highlight">${subject}</span></p>
                    <p>If you have any urgent concerns, please don't hesitate to reach out to us directly.</p>
                    <p>Best regards,<br><span class="highlight">ShopyOnline Support Team</span></p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} ShopyOnline. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        // Send email to admin
        await sendEmail({
            email: "redowantanvirshifat@gmail.com",
            subject: `ShopyOnline Contact: ${subject}`,
            message: adminMessage,
        });

        // Send confirmation email to user
        await sendEmail({
            email: email,
            subject: "ShopyOnline - We Received Your Message",
            message: userMessage,
        });

        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully. We'll get back to you soon!",
        });
    } catch (error) {
        console.error("Email sending error:", error);
        return next(new ErrorHandler("Failed to send message. Please try again later.", 500));
    }
});
