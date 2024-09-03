import { Appointment } from "../models/appointment.model.js";
import { Doctor } from "../models/doctor.model.js";
import { User } from "../models/user.model.js";
import  asyncHandler  from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Mailjet from "node-mailjet";

// Initialize Mailjet
const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
});

// Helper function to send email notifications
const sendNotification = async (recipient, subject, message) => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "hospital@example.com",
          Name: "Hospital Admin",
        },
        To: [
          {
            Email: recipient,
          },
        ],
        Subject: subject,
        TextPart: message,
      },
    ],
  });
  try {
    await request;
  } catch (error) {
    console.error("Error sending email", error);
    throw new ApiError(500, "Failed to send email notification");
  }
};
// Create a new appointment
export const createAppointment = asyncHandler(async (req, res, next) => {
  const {
    patient,
    doctor,
    appointmentDate,
    address,
    City,
    pincode,
    category,
    appointmentCharges,
  } = req.body;

  // Validate patient and doctor existence
  const existingPatient = await User.findById(patient);
  const existingDoctor = await Doctor.findById(doctor);

  if (!existingPatient || !existingDoctor) {
    return next(new ApiError(400, "Invalid patient or doctor ID"));
  }

  // Check if the doctor is available on the given date
  const isDoctorAvailable = await checkDoctorAvailability(
    doctor,
    appointmentDate,
  );
  if (!isDoctorAvailable) {
    return next(
      new ApiError(400, "Doctor is not available at the selected time"),
    );
  }

  // Create appointment
  const appointment = new Appointment({
    patient,
    patientFirstName: existingPatient.firstName,
    patientLastName: existingPatient.lastName,
    doctor,
    doctorName: existingDoctor.doctorName,
    appointmentCharges,
    address,
    City,
    pincode,
    appointmentDate,
    category,
  });

  await appointment.save();

  // Notify the patient
  await sendNotification(
    existingPatient.email,
    "Appointment Scheduled",
    `Dear ${existingPatient.firstName}, your appointment with Dr. ${existingDoctor.doctorName} has been scheduled for ${appointmentDate}.`,
  );

  res
    .status(201)
    .json(
      new ApiResponse(201, appointment, "Appointment created successfully"),
    );
});

// Get all appointments
export const getAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find()
    .populate("patient", "firstName lastName email")
    .populate("doctor", "doctorName");

  res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "Appointments retrieved successfully"),
    );
});

// Get a single appointment by ID
export const getAppointmentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id)
    .populate("patient", "firstName lastName email")
    .populate("doctor", "doctorName");

  if (!appointment) {
    return next(new ApiError(404, "Appointment not found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, appointment, "Appointment retrieved successfully"),
    );
});

// Update appointment status
export const updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const appointment = await Appointment.findById(id).populate(
    "patient",
    "email",
  );

  if (!appointment) {
    return next(new ApiError(404, "Appointment not found"));
  }

  appointment.status = status;
  await appointment.save();

  // Notify the patient about the status update
  await sendNotification(
    appointment.patient.email,
    "Appointment Status Update",
    `Dear ${appointment.patient.firstName}, your appointment status has been updated to ${status}.`,
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        appointment,
        "Appointment status updated successfully",
      ),
    );
});

// Delete an appointment
export const deleteAppointment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findByIdAndDelete(id);

  if (!appointment) {
    return next(new ApiError(404, "Appointment not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Appointment deleted successfully"));
});

// Check doctor availability and Implement logic to check doctor's availability
export const checkDoctorAvailability = async (doctorId, appointmentDate) => {
  // Find the doctor by ID
  const doctor = await Doctor.findById(doctorId);
  // Check if the doctor exists
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  // Check if the doctor has availability on the specified date
  const availability = doctor.availabelSlots.find((slot) => {
    return slot.days.includes(appointmentDate.getDay());
  });
  // If no availability found, return false
  if (!availability) {
    return false;
  }
  // Check if the doctor has any existing appointments on the specified date
  const existingAppointments = await Appointment.countDocuments({
    doctor: doctorId,
    checkInDate: appointmentDate,
    status: { $in: ["Pending", "Accepted"] },
  });
  // If the doctor has reached their appointment limit, return false
  if (existingAppointments >= 25) {
    // Assuming each doctor can handle 10 appointments per day
    return false;
  } else {
    // If the doctor is available, return true
    return true;
  }
};