import express from 'express';
import {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    doctorLogin
} from '../controllers/doctor.controller.js';
import { isAdminAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', doctorLogin);

// Protected routes
router.post('/register', isAdminAuthenticated, createDoctor);
router.get('/getdoctors', isAdminAuthenticated, getDoctors);
router.get('/getdoctorbyid', isAdminAuthenticated, getDoctorById);
router.put('/updatedoctor', isAdminAuthenticated, updateDoctor);
router.delete('/deletedoctor', isAdminAuthenticated, deleteDoctor);

export default router;