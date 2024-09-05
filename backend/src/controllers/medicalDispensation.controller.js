import MedicalDispensation from ("../models/medicalDispensation.model");
import { asyncHandler } from ("../utils/asyncHandler");
import { ApiError } from ("../utils/ApiError");

// Get all dispensation records for a patient along with ward and bed information
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

// Add a new dispensation record with embedded ward and bed information
const createDispensationRecord = asyncHandler(async (req, res, next) => {
  const {
    patientId,
    morning,
    afternoon,
    evening,
    specialMedications,
    patientDescription,
    ward,
    bed,
    remark, // Feedback after treatment
  } = req.body;

  const newRecord = new MedicalDispensation({
    patientId,
    morning,
    afternoon,
    evening,
    specialMedications,
    patientDescription,
    ward, // Embedded Ward details
    bed, // Embedded Bed details
    remark, // Nurse's feedback from the patient
  });

  const savedRecord = await newRecord.save();
  res.status(201).json(savedRecord);
});

// Update a dispensation record with embedded ward, bed, and remark information
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
