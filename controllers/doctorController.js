
import { DoctorRepository } from "../repositories/doctorRepository.js";

export const addDoctors = async (req, res) => {
    try {
        const listOfDoctors = req.body.listOfDoctors;

        for (const doctor of listOfDoctors) {
            await DoctorRepository.addDoctor(doctor);
        }

        res.status(200).json({ message: "Doctors added successfully" });
    } catch (error) {
        console.error("Error adding doctors:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const addTokensForAllDoctors = async (req, res) => {
    try {
        const addedCount = await DoctorRepository.addTokensForDoctorsWithoutTokens();

        res.status(200).json({
            message: "Tokens added successfully",
            tokensAdded: addedCount
        });
    } catch (error) {
        console.error("Error adding tokens for doctors:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const searchDoctors = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Please provide a search term" });
        }

        const doctors = await DoctorRepository.searchDoctors(query);

        res.status(200).json(doctors);
    } catch (error) {
        console.error("Error searching doctors:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const acceptFeedback = async (req, res) => {
    const { doctorId, patientId, rating, comment } = req.body;

    // Validate input
    if (!doctorId || !patientId || !rating || !comment) {
        return res.status(400).json({
            error: "Some required information is missing."
        });
    }

    try {
        const feedback = await FeedbackRepository.saveFeedback(
            doctorId,
            patientId,
            rating,
            comment
        );

        console.log(`Feedback saved for doctor ${doctorId}:`, feedback);
        return res.status(200).json({
            message: "Feedback accepted successfully",
            feedback
        });
    } catch (error) {
        console.error("Error saving feedback:", error);
        return res.status(500).json({
            error: "An error occurred while saving feedback",
            details: error.message
        });
    }
};

export const setAvailableSlots = async (req, res) => {
    const { doctorId, availableSlots } = req.body;

    // Validate input
    if (!doctorId || !availableSlots) {
        return res.status(400).json({
            error: "Doctor ID and available slots are required."
        });
    }

    try {
        const updatedDoctor = await DoctorRepository.updateAvailableSlots(
            doctorId,
            availableSlots
        );

        return res.status(200).json({
            message: "Available slots updated successfully",
            doctor: updatedDoctor
        });
    } catch (error) {
        console.error("Error updating available slots:", error);
        return res.status(500).json({
            error: "An error occurred while updating available slots",
            details: error.message
        });
    }
};