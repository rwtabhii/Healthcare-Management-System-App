import { Router } from "express";
import { checkAuthenticaion } from "../middlewares/jwtAuth.js";
import { signup ,signin,signout,allDoctorList} from "../controllers/userController.js";

export const userRoute = Router();

userRoute.post('/signup', signup);
userRoute.get('/signin', signin);
userRoute.get('/', checkAuthenticaion, (req, res) => {
    res.send('Hello World!');
});
userRoute.get('/signout', signout);
userRoute.get("/listdoctor",allDoctorList)
// userRoute.get('/user/send-otp-verify-email', sendOtpForVerifyingEmail);
// userRoute.post('/user/verify-email', verifyEmail);
// userRoute.get('/user/send-otp-verify-mobile', sendOtpForVerifyingMobile);
// userRoute.post('/user/verify-mobile', verifyMobile);