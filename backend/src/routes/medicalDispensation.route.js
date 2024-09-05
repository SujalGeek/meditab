import express from "express";
const router = express.Router();

import {
  getDispensationRecords,
  createDispensationRecord,
  updateDispensationRecord,
} from ("../controllers/medicalDispensation.controller");

// Route to get all dispensation records for a patient
router.get("/dispensation/:patientId", getDispensationRecords);

// Route to create a new dispensation record
router.post("/dispensation", createDispensationRecord);

// Route to update an existing dispensation record
router.put("/dispensation/:id", updateDispensationRecord);

module.exports = router;
