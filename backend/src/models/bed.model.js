import mongoose from "mongoose";
const wardSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    }
  });
const bedSchema = new mongoose.Schema({
    bedNumber: {
        type: String,
        required: [true, "Bed number is required"],
        unique: true,
    },
    ward:wardSchema,
    bedType: {
        type: String,
        enum: ["General", "ICU", "Private"],
        required: [true, "Bed type is required"],
    },
    availabilityStatus: {
        type: String,
        enum: ["Available", "Occupied", "Under Maintenance"],
        default: "Available",
    },
    currentPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null
      }
}, { timestamps: true });

export const Bed = mongoose.model("Bed", bedSchema);
