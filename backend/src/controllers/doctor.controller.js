import { Doctor } from '../models/doctor.model.js';
import { asyncHandler } from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { ApiResponse } from "../utilis/ApiResponse.js";

// Create a new doctor
export const createDoctor = asyncHandler(async (req, res, next) => {
    const { doctorName, email, phone, password, address, gender, department, specializations, qualifications, experience, availabelSlots, appointmentCharges, docAvatar, languagesKnown } = req.body;

    // Check if the email is already registered
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
        return next(new ApiError(400, "Email is already registered"));
    }

    // Create a new doctor
    const newDoctor = new Doctor({
        doctorName,
        email,
        phone,
        password,
        address,
        gender,
        department,
        specializations,
        qualifications,
        experience,
        availabelSlots,
        appointmentCharges,
        docAvatar,
        languagesKnown
    });

    await newDoctor.save();

    res.status(201).json(new ApiResponse(201, newDoctor, "Doctor created successfully"));
});

// Get all doctors
export const getDoctors = asyncHandler(async (req, res, next) => {
    const doctors = await Doctor.find();

    res.status(200).json(new ApiResponse(200, doctors, "Doctors retrieved successfully"));
});

// Get a doctor by ID
export const getDoctorById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
        return next(new ApiError(404, "Doctor not found"));
    }

    res.status(200).json(new ApiResponse(200, doctor, "Doctor retrieved successfully"));
});

// Update doctor details
export const updateDoctor = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    const doctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!doctor) {
        return next(new ApiError(404, "Doctor not found"));
    }

    res.status(200).json(new ApiResponse(200, doctor, "Doctor updated successfully"));
});

// Delete a doctor
export const deleteDoctor = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
        return next(new ApiError(404, "Doctor not found"));
    }

    res.status(200).json(new ApiResponse(200, doctor, "Doctor deleted successfully"));
});

// Doctor login
export const doctorLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Find doctor by email
    const doctor = await Doctor.findOne({ email }).select('+password');
    if (!doctor) {
        return next(new ApiError(401, "Invalid email or password"));
    }

    // Compare password
    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
        return next(new ApiError(401, "Invalid email or password"));
    }

    // Generate JWT
    const token = doctor.generateJsonWebToken();

    res.status(200).json(new ApiResponse(200, { token, doctor }, "Login successful"));
});
