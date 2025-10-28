import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { allow } from '../middleware/roles.js';
import {
  getMe,
  updateMe,
  listDoctors,
  createAppointment,
  myAppointments,
  deleteMyAppointment
} from '../controllers/patient.controller.js';

const r = Router();

r.use(auth, allow('PATIENT'));

// Profile
r.get('/me', getMe);
r.put('/me', updateMe);

// Doctors
r.get('/doctors', listDoctors);

// Appointments
r.post('/appointments', createAppointment);
r.get('/appointments', myAppointments);
r.delete('/appointments/:id', deleteMyAppointment);

export default r;

