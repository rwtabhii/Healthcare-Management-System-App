import User from '../schemas/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail, generateOTP, sendSMS } from '../config/helper_functions.js';
// import { OAuth2Client } from 'google-auth-library';
// import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, 
//     REDIRECT_URI
//  } from '../config/constants.js';
import Session from '../models/sessions.js';

// const client = new OAuth2Client({
//     clientId: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     redirectUri: REDIRECT_URI // Optional, depends on your app type
// });

export const signup = async (req, res) => {
    const { username, email, password, type, mobile } = req.body;

    try {
        const userPresent = await findUserByEmail(email);
        if (userPresent) {
            return res.status(409).json({ error: "User with this email already exists" });
        }

        const newUser = await createUser({ username, email, password, type, mobile });

        // Send welcome email
        await sendEmail(
            email,
            "Welcome to our platform",
            `You have signed up successfully. Please click <a href="http://localhost:3000/user/verify-email?email=${email}">here</a> to verify your email.`
        );

        return res.status(201).json({ message: "You have signed up successfully. Please signin now." });
    } catch (error) {
        return res.status(400).json({ error: "Error creating user" });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "No user found with this Email ID" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });

        // Save session in DB
        await createSession(user._id, token);

        return res.status(200).json({ message: "Signin successful", token });
    } catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({ error: "Server error during signin" });
    }
};

export const signout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ error: "No token found" });
        }

        await deleteSessionByToken(token);
        res.clearCookie("token");

        return res.status(200).json({ message: "Signout successful" });
    } catch (error) {
        console.error("Signout Error:", error);
        return res.status(500).json({ error: "Server error during signout" });
    }
};
export const sendOtpForVerifyingEmail = async (req, res) => {
    const otp = generateOTP();
    const email = req.query.email;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "No user found with this email" });
        }

        // Save OTP in DB
        await saveOtpToUser(user, otp);

        // Send OTP by email
        await sendEmail(email, "Verify your email", `Your OTP is ${otp}`);

        // Delete OTP after 30 seconds
        setTimeout(async () => {
            user.otp = null;
            await user.save();
        }, 30000);

        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ error: "Error sending OTP" });
    }
};

export const verifyEmail = async (req, res) => {
    const { email, password, otp } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "No user found with this email" });
        }

        // ✅ Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // ✅ Check OTP
        if (user.otp !== otp) {
            return res.status(401).json({ error: "Invalid OTP or OTP expired" });
        }

        // ✅ Update user
        user.emailVerified = true;
        user.otp = null; // clear OTP after success
        await saveUser(user);

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).json({ error: "Error verifying email" });
    }
};

export const sendOtpForVerifyingMobile = async (req, res) => {
    const otp = generateOTP();
    const mobile = req.query.mobile;

    try {
        const user = await findUserByMobile(mobile);
        if (!user) {
            return res.status(404).json({ error: "No user found with this mobile number" });
        }

        // Save OTP to DB
        await saveOtpToUser(user, otp);

        // Send OTP SMS
        const response = await sendSMS(mobile, otp);

        // Schedule OTP deletion after 30 sec
        setTimeout(async () => {
            user.otp = null;
            await user.save();
        }, 30000);

        if (response.return === false) {
            return res.status(500).json({ error: "Error sending OTP" });
        }

        return res.status(200).json({ message: "OTP sent to your mobile" });
    } catch (error) {
        console.error("Error sending mobile OTP:", error);
        return res.status(500).json({ error: "Error sending mobile OTP" });
    }
};

export const verifyMobile = async (req, res) => {
    const { mobile, password, otp } = req.body;

    try {
        const user = await findUserByMobile(mobile);
        if (!user) {
            return res.status(404).json({ error: "No user found with this mobile number" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Validate OTP
        if (user.otp !== otp) {
            return res.status(401).json({ error: "Invalid OTP or the OTP has expired" });
        }

        // Mark as verified
        await verifyUserMobile(user);

        return res.status(200).json({ message: "Mobile number verified successfully" });
    } catch (error) {
        console.error("Error verifying mobile:", error);
        return res.status(500).json({ error: "Error verifying mobile" });
    }
};