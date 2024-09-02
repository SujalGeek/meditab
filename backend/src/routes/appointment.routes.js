import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  checkDoctorAvailability,
} from "../controllers/appointment.controller.js";

const router = Router();

// Create a new appointment
router.post("/appointments", createAppointment);

// Get all appointments
router.get("/appointments", getAppointments);

// Get a single appointment by ID
router.get("/appointments/:id", getAppointmentById);

// Update appointment status
router.patch("/appointments/:id/status", updateAppointmentStatus);

// Delete an appointment
router.delete("/appointments/:id", deleteAppointment);

// Check doctor availability
router.get("/doctors/:doctorId/availability", async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    const isAvailable = await checkDoctorAvailability(doctorId, new Date(date));
    res.json({ isAvailable });
  } catch (error) {
    next(error);
  }
});

export default router;
