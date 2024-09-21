import { OPDSchedule } from "../models/opdSchedule.model.js";
import { Bed } from "../models/bed.model.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendNotification } from "../utils/Mailjet.js";

export const scheduleOPD = asyncHandler(async (req, res, next) => {
  const { patientId, doctorId, checkInDate, bedType, isUrgent } = req.body;

  const patient = await User.findById(patientId);
  const doctor = await Doctor.findById(doctorId);

  if (!patient || !doctor) {
    return next(new ApiError(400, "Invalid patient or doctor ID"));
  }

  const isAvailable = await checkDoctorAvailability(doctorId, checkInDate);
  if (!isAvailable) {
    return next(
      new ApiError(400, "Doctor is not available at the selected time"),
    );
  }

  let priority = isUrgent ? 1 : 3;

  const newOPDSchedule = new OPDSchedule({
    patient: patientId,
    doctor: doctorId,
    checkInDate,
    bedType,
    status: "Waiting",
    priority,
  });

  await newOPDSchedule.save();

  if (isUrgent) {
    await handleUrgentAdmission(newOPDSchedule);
  } else {
    await addToQueue(newOPDSchedule);
  }

  await sendNotification(
    patient,
    "OPD Appointment Scheduled",
    `Dear ${patient.name}, your OPD appointment has been scheduled for ${checkInDate}. You have been added to the queue for a ${bedType} bed.`,
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newOPDSchedule,
        "OPD appointment scheduled successfully",
      ),
    );
});

const handleUrgentAdmission = async (opdSchedule) => {
  const highPriorityBed = await Bed.findOne({
    availabilityStatus: "Available",
    bedType: "ICU",
  });

  if (highPriorityBed) {
    highPriorityBed.availabilityStatus = "Occupied";
    highPriorityBed.currentPatient = opdSchedule.patient;
    await highPriorityBed.save();

    opdSchedule.status = "Allocated";
    opdSchedule.bed = highPriorityBed._id;
    await opdSchedule.save();

    const patient = await User.findById(opdSchedule.patient);
    await sendNotification(
      patient,
      "Urgent Admission",
      `Dear ${patient.name}, you have been admitted to a high-priority bed. Please proceed to the hospital immediately.`,
    );
  } else {
    const lowerPriorityOPDSchedule = await OPDSchedule.findOne({
      status: "Allocated",
      bedType: "General",
      priority: { $gt: 1 },
    }).sort({ priority: -1, checkInDate: 1 });

    if (lowerPriorityOPDSchedule) {
      const temporaryBed = await Bed.findOne({
        availabilityStatus: "Available",
        bedType: "General",
      });

      if (temporaryBed) {
        const highPriorityBed = await Bed.findById(
          lowerPriorityOPDSchedule.bed,
        );

        // Move lower priority patient to temporary bed
        lowerPriorityOPDSchedule.temporaryBed = temporaryBed._id;
        lowerPriorityOPDSchedule.status = "TemporarilyAllocated";
        await lowerPriorityOPDSchedule.save();

        temporaryBed.availabilityStatus = "Occupied";
        temporaryBed.currentPatient = lowerPriorityOPDSchedule.patient;
        await temporaryBed.save();

        // Allocate high priority bed to urgent patient
        highPriorityBed.currentPatient = opdSchedule.patient;
        await highPriorityBed.save();

        opdSchedule.status = "Allocated";
        opdSchedule.bed = highPriorityBed._id;
        await opdSchedule.save();

        const lowerPriorityPatient = await User.findById(
          lowerPriorityOPDSchedule.patient,
        );
        await sendNotification(
          lowerPriorityPatient,
          "Temporary Bed Relocation",
          `Dear ${lowerPriorityPatient.name}, due to an urgent case, you have been temporarily relocated to a temporary bed. We apologize for the inconvenience.`,
        );

        const urgentPatient = await User.findById(opdSchedule.patient);
        await sendNotification(
          urgentPatient,
          "Urgent Admission",
          `Dear ${urgentPatient.name}, you have been admitted to a high-priority bed. Please proceed to the hospital immediately.`,
        );
      } else {
        throw new ApiError(
          400,
          "No temporary beds available for urgent admission",
        );
      }
    } else {
      throw new ApiError(
        400,
        "No patients available for relocation for urgent admission",
      );
    }
  }
};

const addToQueue = async (opdSchedule) => {
  opdSchedule.status = "Waiting";
  await opdSchedule.save();
};

export const getOPDSchedules = asyncHandler(async (req, res, next) => {
  const { date } = req.query;
  const startDate = new Date(date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const opdSchedules = await OPDSchedule.find({
    checkInDate: { $gte: startDate, $lt: endDate },
    status: { $in: ["Waiting", "Allocated", "TemporarilyAllocated"] },
  })
    .populate("patient")
    .populate("doctor");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        opdSchedules,
        "OPD schedules retrieved successfully",
      ),
    );
});

export const updateOPDScheduleStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.opdSchedule?._id;
  const { status } = req.body;

  const opdSchedule = await OPDSchedule.findById(id).populate("patient");
  if (!opdSchedule) {
    return next(new ApiError(404, "OPD schedule not found"));
  }

  opdSchedule.status = status;

  if (status === "Completed" || status === "Cancelled") {
    if (opdSchedule.bed) {
      await Bed.findByIdAndUpdate(opdSchedule.bed, {
        availabilityStatus: "Available",
        currentPatient: null,
      });
      opdSchedule.bed = null;
    }
    if (opdSchedule.temporaryBed) {
      await Bed.findByIdAndUpdate(opdSchedule.temporaryBed, {
        availabilityStatus: "Available",
        currentPatient: null,
      });
      opdSchedule.temporaryBed = null;
    }
    opdSchedule.checkOutDate = new Date();
  }

  await opdSchedule.save();

  await sendNotification(
    opdSchedule.patient,
    "OPD Schedule Status Update",
    `Dear ${opdSchedule.patient.name}, your OPD schedule status has been updated to ${status}.`,
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        opdSchedule,
        "OPD schedule status updated successfully",
      ),
    );
});

export const allocateBed = asyncHandler(async (req, res, next) => {
  const { opdScheduleId } = req.opdSchedule?._id;

  const opdSchedule =
    await OPDSchedule.findById(opdScheduleId).populate("patient");
  if (!opdSchedule) {
    return next(new ApiError(404, "OPD schedule not found"));
  }

  if (opdSchedule.status !== "Waiting") {
    return next(new ApiError(400, "OPD schedule is not in waiting status"));
  }

  const availableBed = await Bed.findOne({
    availabilityStatus: "Available",
    bedType: opdSchedule.bedType,
  });
  if (!availableBed) {
    return next(new ApiError(400, "No beds available"));
  }

  availableBed.availabilityStatus = "Occupied";
  availableBed.currentPatient = opdSchedule.patient._id;
  await availableBed.save();

  opdSchedule.bed = availableBed._id;
  opdSchedule.status = "Allocated";
  await opdSchedule.save();

  await sendNotification(
    opdSchedule.patient,
    "Bed Allocated",
    `Dear ${opdSchedule.patient.name}, a ${availableBed.bedType} bed has been allocated for your OPD appointment. Please proceed to bed number ${availableBed.bedNumber}.`,
  );

  res
    .status(200)
    .json(new ApiResponse(200, opdSchedule, "Bed allocated successfully"));
});

export const getQueueStatus = asyncHandler(async (req, res, next) => {
  const { patientId } = req.user?._id;

  const opdSchedule = await OPDSchedule.findOne({
    patient: patientId,
    status: "Waiting",
  });
  if (!opdSchedule) {
    return next(new ApiError(404, "Patient not in queue"));
  }

  const position = await OPDSchedule.countDocuments({
    status: "Waiting",
    bedType: opdSchedule.bedType,
    priority: { $lte: opdSchedule.priority },
    checkInDate: { $lt: opdSchedule.checkInDate },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { position: position + 1 },
        "Queue position retrieved successfully",
      ),
    );
});

export const processQueue = asyncHandler(async (req, res, next) => {
  const availableBed = await Bed.findOne({ availabilityStatus: "Available" });

  if (!availableBed) {
    return next(new ApiError(400, "No beds available"));
  }

  const nextInQueue = await OPDSchedule.findOne({
    status: "Waiting",
    bedType: availableBed.bedType,
  })
    .sort({ priority: 1, checkInDate: 1 })
    .populate("patient")
    .populate("doctor");

  if (!nextInQueue) {
    return next(
      new ApiError(404, "No patients in queue for available bed type"),
    );
  }

  availableBed.availabilityStatus = "Occupied";
  availableBed.currentPatient = nextInQueue.patient._id;
  await availableBed.save();

  nextInQueue.status = "Allocated";
  nextInQueue.bed = availableBed._id;
  await nextInQueue.save();

  await sendNotification(
    nextInQueue.patient,
    "Bed Allocated",
    `Dear ${nextInQueue.patient.name}, a ${availableBed.bedType} bed has been allocated to you. Please proceed to the hospital.`,
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        nextInQueue,
        "Patient allocated to bed successfully",
      ),
    );
});

export const checkAndRelocatePatients = asyncHandler(async (req, res, next) => {
  const temporarilyAllocatedOPDSchedules = await OPDSchedule.find({
    status: "TemporarilyAllocated",
  })
    .sort({ priority: 1, checkInDate: 1 })
    .populate("patient")
    .populate("temporaryBed");

  for (const opdSchedule of temporarilyAllocatedOPDSchedules) {
    const originalBedType = opdSchedule.bedType;
    const availableBed = await Bed.findOne({
      availabilityStatus: "Available",
      bedType: originalBedType,
    });

    if (availableBed) {
      const tempBed = opdSchedule.temporaryBed;
      tempBed.availabilityStatus = "Available";
      tempBed.currentPatient = null;
      await tempBed.save();

      availableBed.availabilityStatus = "Occupied";
      availableBed.currentPatient = opdSchedule.patient._id;
      await availableBed.save();

      opdSchedule.status = "Allocated";
      opdSchedule.bed = availableBed._id;
      opdSchedule.temporaryBed = null;
      await opdSchedule.save();

      await sendNotification(
        opdSchedule.patient,
        "Bed Reallocation",
        `Dear ${opdSchedule.patient.name}, a bed of your original type is now available. You have been moved to bed ${availableBed.bedNumber} in the ${availableBed.bedType} ward.`,
      );
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Patient relocation check completed"));
});

const checkDoctorAvailability = async (doctorId, checkInDate) => {
  // Implement logic to check doctor's availability
  // This could involve checking the doctor's schedule, existing OPD schedules, etc.
  // Return true if available, false otherwise
  return true; // Placeholder implementation
};
