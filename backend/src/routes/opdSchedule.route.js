import express from "express";
import {
  scheduleOPD,
  getOPDSchedules,
  updateOPDScheduleStatus,
  allocateBed,
  getQueueStatus,
  processQueue,
  checkAndRelocatePatients,
} from "../controllers/opdSchedule.controller.js";

const router = express.Router();

router.post("/schedule", scheduleOPD);
router.get("/schedules", getOPDSchedules);
router.patch("/schedules/:id/status", updateOPDScheduleStatus);
router.post("/schedules/:opdScheduleId/allocate-bed", allocateBed);
router.get("/queue-status/:patientId", getQueueStatus);
router.post("/process-queue", processQueue);
router.post("/relocate-patients", checkAndRelocatePatients);

export default router;
