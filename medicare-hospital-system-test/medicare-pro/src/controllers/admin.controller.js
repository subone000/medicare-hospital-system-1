import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

// CRUD Doctors (admin adds doctors only)
export async function createDoctor(req, res) {
  try {
    const { email, password, name, specialization } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash, role: 'DOCTOR' }
    });

    await prisma.doctorProfile.create({
      data: { userId: user.id, name, specialization }
    });

    return res.json({ id: user.id, email, role: user.role });
  } catch {
    return res.status(500).json({ message: 'Create doctor failed' });
  }
}

export const listDoctors = async (_req, res) => {
  const docs = await prisma.doctorProfile.findMany({
    include: { user: { select: { email: true, role: true } } }
  });
  res.json(docs);
};

export const deleteDoctor = async (req, res) => {
  const id = Number(req.params.id);
  // id is doctor userId OR doctorProfile id? We'll accept userId for simplicity
  await prisma.appointment.deleteMany({ where: { doctor: { userId: id } } });
  await prisma.doctorProfile.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
  res.json({ ok: true });
};

// Patients mgmt
export const listPatients = async (_req, res) => {
  const pts = await prisma.patientProfile.findMany({
    include: { user: { select: { email: true, role: true } } }
  });
  res.json(pts);
};

export const deletePatient = async (req, res) => {
  const id = Number(req.params.id); // userId
  await prisma.appointment.deleteMany({ where: { patient: { userId: id } } });
  await prisma.patientProfile.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
  res.json({ ok: true });
};

// Appointments overview
export const listAllAppointments = async (_req, res) => {
  const items = await prisma.appointment.findMany({
    orderBy: { dateTime: 'desc' },
    include: { patient: true, doctor: true }
  });
  res.json(items);
};

export const deleteAppointment = async (req, res) => {
  await prisma.appointment.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
};
