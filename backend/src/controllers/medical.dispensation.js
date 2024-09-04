const MedicalDispensation = require("../models/medicaldisperian");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");

// Get all dispensation records for a patient
const getDispensationRecords = asyncHandler(async (req, res, next) => {
  const records = await MedicalDispensation.find({
    patientId: req.params.patientId,
  });
  if (!records) {
    return next(
      new ApiError("No dispensation records found for this patient", 404),
    );
  }
  res.json(records);
});

// Add a new dispensation record
const createDispensationRecord = asyncHandler(async (req, res, next) => {
  const {
    patientId,
    morning,
    afternoon,
    evening,
    specialMedications,
    patientDescription,
  } = req.body;

  const newRecord = new MedicalDispensation({
    patientId,
    morning,
    afternoon,
    evening,
    specialMedications,
    patientDescription,
  });

  const savedRecord = await newRecord.save();
  res.status(201).json(savedRecord);
});

// Update a dispensation record
const updateDispensationRecord = asyncHandler(async (req, res, next) => {
  const updatedRecord = await MedicalDispensation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );

  if (!updatedRecord) {
    return next(new ApiError("Dispensation record not found", 404));
  }

  res.json(updatedRecord);
});

module.exports = {
  getDispensationRecords,
  createDispensationRecord,
  updateDispensationRecord,
};
