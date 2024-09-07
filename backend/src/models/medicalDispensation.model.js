import mongoose from "mongoose";

const medicalDispensationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  morning: {
    type: Boolean,
    default: false,
  },
  afternoon: {
    type: Boolean,
    default: false,
  },
  evening: {
    type: Boolean,
    default: false,
  },
  specialMedications: [
    {
      name: {
        type: String,
        required: true,
      },
      description: String,
      timeToGive: {
        type: String,
        required: true,
      }, // e.g., "Injection at 10 AM"
    },
  ],
  patientDescription: {
    type: String,
    default: "",
  },
  ward: {
    type: String,
    required: true,
  },
  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bed",
    required: true,
  },
  remark: {
    type: String,
    default: "",
  },
});

export const MedicalDispensation = mongoose.model(
  "MedicalDispensation",
  medicalDispensationSchema,
);

export default MedicalDispensation;
