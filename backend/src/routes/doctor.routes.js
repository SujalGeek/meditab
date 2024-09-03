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
router.get('/', isAdminAuthenticated, getDoctors);
router.get('/:id', isAdminAuthenticated, getDoctorById);
router.put('/:id', isAdminAuthenticated, updateDoctor);
router.delete('/:id', isAdminAuthenticated, deleteDoctor);

export default router;