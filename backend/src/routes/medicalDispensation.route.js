import express from "express";

import {
  getDispensationRecords,
  createDispensationRecord,
  updateDispensationRecord,
} from "../controllers/medicalDispensation.controller.js";

const router = express.Router();
// Route to get all dispensation records for a patient
router.get("/dispensation/:patientId", getDispensationRecords);

// Route to create a new dispensation record
router.post("/dispensation", createDispensationRecord);

// Route to update an existing dispensation record
router.put("/dispensation/:id", updateDispensationRecord);

export default router;
