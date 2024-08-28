// backend/src/routes/doctorRoutes.js
import express from "express";
import { getDoctorDashboard } from "../controllers/doctorController.js";
const router = express.Router();

router.get("/api/doctor-dashboard", getDoctorDashboard);

export default router;
