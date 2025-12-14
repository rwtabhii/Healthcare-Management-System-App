import nodemailer from "nodemailer";
import { COMPANY_EMAIL, COMPANY_EMAIL_PASSWORD } from "./constants.js";

/**
 * Send an email using Gmail SMTP
 * @param {String} to - Recipient email
 * @param {String} subject - Email subject
 * @param {String} text - Email content (HTML formatted)
 */
export const sendEmail = async (to, subject, text) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: COMPANY_EMAIL,
                pass: COMPANY_EMAIL_PASSWORD, // app-specific password
            },
        });

        // Send email
        await transporter.sendMail({
            from: COMPANY_EMAIL,
            to,
            subject,
            html: `<h2>${text}</h2>`, // formatted email content
        });

        console.log(`Email sent to ${to} successfully.`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
