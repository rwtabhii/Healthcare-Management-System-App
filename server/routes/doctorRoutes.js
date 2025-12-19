import { Router } from "express";
import { checkAuthenticaion } from "../middlewares/jwtAuth.js";
import { addTokensForAllDoctors,acceptFeedback, addDoctors, searchDoctors, setAvailableSlots } from "../controllers/doctorController.js";


 export const doctorRoute = Router();



doctorRoute.post("/add-doctors",addDoctors);
doctorRoute.get("/add-tokens", addTokensForAllDoctors);
doctorRoute.get("/search-doctor",searchDoctors)
doctorRoute.post("/doctors/add-feedback",acceptFeedback)
doctorRoute.post("/doctors/set-available-slots",setAvailableSlots)
doctorRoute.post("/book-appointment",checkAuthenticaion,bookAppointment);



