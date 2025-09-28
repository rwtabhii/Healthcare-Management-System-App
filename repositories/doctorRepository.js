import User from "../models/User.js";
import DoctorToken from "../models/DoctorToken.js";
import Feedback from "../schemas/feedback.js";

export const DoctorRepository = {
    async addDoctor(doctorData) {
        const { username, email, password, description, mobile } = doctorData;

        // Create a new user
        const user = new User({
            username,
            email,
            password,
            type: "doctor",
            description,
            mobile
        });
        await user.save();

        // Create a new doctor token
        const tokens = [
            ...description.split(" "),
            ...username.split(" ")
        ];

        const doctorToken = new DoctorToken({
            doctorId: user._id,
            token: tokens
        });

        await doctorToken.save();
        return user; // Return user in case controller needs it
    },

      async addTokensForDoctorsWithoutTokens() {
        // Find all doctors
        const doctors = await User.find({ type: "doctor" });

        let addedCount = 0;

        for (const doctor of doctors) {
            const existingToken = await DoctorToken.findOne({
                doctorId: doctor._id
            });

            if (existingToken) continue;

            const tokens = [
                ...doctor.description.toLowerCase().split(" "),
                ...doctor.username.toLowerCase().split(" ")
            ];

            const doctorToken = new DoctorToken({
                doctorId: doctor._id,
                token: tokens
            });

            await doctorToken.save();
            addedCount++;
        }

        return addedCount;
    },
      async searchDoctors(query) {
        // Convert search query into tokens
        const searchTokens = query.toLowerCase().split(" ");

        // Get all doctor tokens
        const doctorTokens = await DoctorToken.find();

        // Calculate matching scores for each doctor
        const tokenMatchingScores = [];

        for (const doctorToken of doctorTokens) {
            let score = 0;
            for (const searchToken of searchTokens) {
                if (doctorToken.token.includes(searchToken)) {
                    score++;
                }
            }
            tokenMatchingScores.push({ doctorId: doctorToken.doctorId, score });
        }

        // Sort by highest score
        tokenMatchingScores.sort((a, b) => b.score - a.score);

        // Fetch top 3 doctors with score > 0
        const doctors = [];
        for (let i = 0; i < 3 && i < tokenMatchingScores.length; i++) {
            if (tokenMatchingScores[i].score !== 0) {
                const doctor = await User.findById(tokenMatchingScores[i].doctorId);
                if (doctor) doctors.push(doctor);
            }
        }

        return doctors;
    },
     async saveFeedback(doctorId, patientId, rating, comment) {
        // 1. Create and save feedback document
        const feedback = new Feedback({
            doctorId,
            patientId,
            rating,
            comment
        });

        await feedback.save();

        // 2. Find patient and doctor
        const patient = await User.findById(patientId);
        const doctor = await User.findById(doctorId);

        if (!patient || !doctor) {
            throw new Error("Doctor or patient not found");
        }

        // 3. Update patient feedback list
        if (patient.feedbackGiven) {
            patient.feedbackGiven.push(feedback._id);
        } else {
            patient.feedbackGiven = [feedback._id];
        }

        // 4. Update doctor feedback list
        if (doctor.feedbackReceived) {
            doctor.feedbackReceived.push(feedback._id);
        } else {
            doctor.feedbackReceived = [feedback._id];
        }

        await patient.save();
        await doctor.save();

        return feedback;
    },
      async updateAvailableSlots(doctorId, availableSlots) {
        const doctor = await User.findById(doctorId);
        if (!doctor) {
            throw new Error("Doctor not found");
        }

        doctor.availableSlots = availableSlots;
        await doctor.save();

        return doctor;
    }
};