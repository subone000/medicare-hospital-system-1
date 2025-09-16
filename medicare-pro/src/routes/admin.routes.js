import { Router } from 'express';
import { allow } from '../middleware/roles.js';
import { auth } from '../middleware/auth.js';
import {
  createDoctor, listDoctors, deleteDoctor,
  listPatients, deletePatient,
  listAllAppointments, deleteAppointment
} from '../controllers/admin.controller.js';

const r = Router();
r.use(auth, allow('ADMIN'));
r.post('/doctors', createDoctor);
r.get('/doctors', listDoctors);
r.delete('/doctors/:id', deleteDoctor);   // :id = userId

r.get('/patients', listPatients);
r.delete('/patients/:id', deletePatient); // :id = userId

r.get('/appointments', listAllAppointments);
r.delete('/appointments/:id', deleteAppointment);

export default r;
