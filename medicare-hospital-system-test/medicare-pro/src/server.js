import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import patientRoutes from './routes/patient.routes.js';
import doctorRoutes from './routes/doctor.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (_req, res) => res.send('MediCare Pro API running'));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);

// Error fallback
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
