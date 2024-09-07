import mongoose from "mongoose";

const opdScheduleSchema = new mongoose.Schema({
    bed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bed",
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Patient ID is required"],
    },
    doctorName: {
        type: mongoose.Schema.Types.String,
        ref: "Doctor",
        required: [true, "Doctor ID is required"],
    },
    checkInDate: {
        type: Date,
        required: [true, "Check-in date is required"],
    },
    checkOutDate: {
        type: Date,
    },
    Description: {
        type: String,
        required: true,
        maxLength: 150,
        minLength: 1,
    },
    status: {
        type: String,
        enum: ["Waiting", "Allocated", "TemporarilyAllocated", "Completed", "Cancelled"],
        default: "Waiting",
    },
    priority: {
        type: Number,
        default: 3, // 1: High, 2: Medium, 3: Low
    },
    entryTime: {
        type: Date,
        default: Date.now,
    },
    bedType: {
        type: String,
        enum: ["General", "ICU", "Private"],
        required: [true, "Bed type is required"],
    },
    temporaryBed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bed",
    }
}, { timestamps: true });

export const OPDSchedule = mongoose.model("OPDSchedule", opdScheduleSchema);