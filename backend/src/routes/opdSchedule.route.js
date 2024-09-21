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
router.patch("/schedules/status", updateOPDScheduleStatus);
router.post("/schedules/allocate-bed", allocateBed);
router.get("/queue-status/", getQueueStatus);
router.post("/process-queue", processQueue);
router.post("/relocate-patients", checkAndRelocatePatients);

export default router;
