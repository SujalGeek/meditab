const express = require("express");
const router = express.Router();
const {
  getDispensationRecords,
  createDispensationRecord,
  updateDispensationRecord,
} = require("../controllers/medical.dispensation");

// Route to get all dispensation records for a patient
router.get("/dispensation/:patientId", getDispensationRecords);

// Route to create a new dispensation record
router.post("/dispensation", createDispensationRecord);

// Route to update an existing dispensation record
router.put("/dispensation/:id", updateDispensationRecord);

module.exports = router;
