import { prisma } from '../lib/prisma.js';

export const myAppointments = async (req, res) => {
  const { status } = req.query; // optional filter
  const where = { doctor: { userId: req.user.id } };
  if (status) where.status = status;
  const list = await prisma.appointment.findMany({
    where, orderBy: { dateTime: 'desc' }, include: { patient: true }
  });
  res.json(list);
};

export const decideAppointment = async (req, res) => {
  const id = Number(req.params.id);
  const { action } = req.body; // "accept" | "reject"

  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: { doctor: true }
  });
  if (!appt || appt.doctor.userId !== req.user.id)
    return res.status(404).json({ message: 'Not found' });

  const status = action === 'accept' ? 'ACCEPTED' : 'REJECTED';
  const updated = await prisma.appointment.update({ where: { id }, data: { status } });
  res.json(updated);
};
