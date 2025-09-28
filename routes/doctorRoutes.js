import { Router } from "express";
import { checkAuthenticaion } from "../middlewares/jwtAuth";
import { addTokensForAllDoctors,acceptFeeback, addDoctors, searchDoctors, setAvailableSlots } from "../controllers/doctorController";


 export const doctorRoute = Router();



doctorRoute.post("/add-doctors",addDoctors);
doctorRoute.get("/add-tokens", addTokensForAllDoctors);
doctorRoute.get("/search-doctor",searchDoctors)
doctorRoute.post("/doctors/add-feedback",acceptFeeback)
doctorRoute.post("/doctors/set-available-slots",setAvailableSlots)
doctorRoute.post("/book-appointment",checkAuthenticaion,bookAppointment);



