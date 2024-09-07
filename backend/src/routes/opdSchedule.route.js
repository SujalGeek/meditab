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
import { isPatientAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/schedule", isPatientAuthenticated, scheduleOPD);
router.get("/schedules", getOPDSchedules);
router.patch("/schedules/status/:id", updateOPDScheduleStatus);
router.patch("/schedules/allocate-bed/:id", allocateBed);
router.get("/queue-status/:patientId", getQueueStatus);
router.post("/process-queue", processQueue);
router.post("/relocate-patients", checkAndRelocatePatients);

export default router;
