import express from 'express';
import {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    doctorLogin
} from '../controllers/doctor.controller.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', doctorLogin);

// Protected routes
router.post('/register', isAuthenticatedUser, authorizeRoles('admin'), createDoctor);
router.get('/', isAuthenticatedUser, getDoctors);
router.get('/:id', isAuthenticatedUser, getDoctorById);
router.put('/:id', isAuthenticatedUser, authorizeRoles('admin', 'doctor'), updateDoctor);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteDoctor);

export default router;