import express from 'express';
import { createBed, getAllBeds, updateBedStatus, deleteBed } from '../controllers/bed.controller.js';

const router = express.Router();

router.post('/addbed', createBed);
router.get('/getbeds', getAllBeds);
router.put('/statusUpdate', updateBedStatus);
router.delete('/deletebed', deleteBed);

export default router;
