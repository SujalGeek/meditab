import express from 'express';
import { createBed, getAllBeds, updateBedStatus, deleteBed } from '../controllers/bed.controller.js';

const router = express.Router();

router.post('/createBed', createBed);
router.get('/beds', getAllBeds);
router.put('/beds/', updateBedStatus);
router.delete('/beds/', deleteBed);

export default router;
