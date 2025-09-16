import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { allow } from '../middleware/roles.js';
import { myAppointments, decideAppointment } from '../controllers/doctor.controller.js';

const r = Router();
r.use(auth, allow('DOCTOR'));
r.get('/appointments', myAppointments);
r.patch('/appointments/:id', decideAppointment);

export default r;
