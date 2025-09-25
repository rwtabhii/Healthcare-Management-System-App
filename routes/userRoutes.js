import { Router } from "express";

export const userRoute = Router();

userRoute.post('/user/signup', signup);
userRoute.get('/user/signin', signin);
userRoute.get('/', checkAuthenticaion, (req, res) => {
    res.send('Hello World!');
});
userRoute.get('/user/signout', signout);
userRoute.get('/user/send-otp-verify-email', sendOtpForVerifyingEmail);
userRoute.post('/user/verify-email', verifyEmail);
userRoute.get('/user/send-otp-verify-mobile', sendOtpForVerifyingMobile);
userRoute.post('/user/verify-mobile', verifyMobile);