import { Router } from 'express';
import { login, registerPatient } from '../controllers/auth.controller.js';
const r = Router();

r.post('/register-patient', registerPatient);
r.post('/login', login);

export default r;
