import { prisma } from '../lib/prisma.js';

// ================== PROFILE ==================
export const getMe = async (req, res) => {
  const me = await prisma.patientProfile.findUnique({
    where: { userId: req.user.id }
  });
  res.json(me);
};

export const updateMe = async (req, res) => {
  const { name, age, gender, medicalHistory } = req.body;
  const updated = await prisma.patientProfile.update({
    where: { userId: req.user.id },
    data: { name, age, gender, medicalHistory }
  });
  res.json(updated);
};

// ================== DOCTORS ==================
export const listDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctorProfile.findMany({
      select: {
        id: true,
        name: true,
        specialization: true,
        userId: true
      }
    });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching doctors',
      error: err.message
    });
  }
};

// ================== APPOINTMENTS ==================
export const createAppointment = async (req, res) => {
  const { doctorUserId, dateTime } = req.body; // dateTime ISO string

  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId: Number(doctorUserId) }
  });
  if (!doctor) return res.status(400).json({ message: 'Doctor not found' });

  const appt = await prisma.appointment.create({
    data: {
      patient: { connect: { userId: req.user.id } },
      doctor: { connect: { id: doctor.id } },
      dateTime: new Date(dateTime),
      status: 'PENDING'
    }
  });
  res.json(appt);
};

export const myAppointments = async (req, res) => {
  const list = await prisma.appointment.findMany({
    where: { patient: { userId: req.user.id } },
    orderBy: { dateTime: 'desc' },
    include: { doctor: true }
  });
  res.json(list);
};

export const deleteMyAppointment = async (req, res) => {
  const id = Number(req.params.id);

  // ensure ownership
  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: true }
  });
  if (!appt || appt.patient.userId !== req.user.id) {
    return res.status(404).json({ message: 'Not found' });
  }

  await prisma.appointment.delete({ where: { id } });
  res.json({ ok: true });
};

export const deleteMe = async (req, res) => {
  try {
    // Delete related patient profile first
    await prisma.patientProfile.delete({
      where: { userId: req.user.id }
    });

    // Then delete the user record
    await prisma.user.delete({
      where: { id: req.user.id }
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting account', error: err.message });
  }
};