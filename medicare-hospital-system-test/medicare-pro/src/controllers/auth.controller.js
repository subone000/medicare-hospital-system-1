import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const sign = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// PATIENT self-register
export async function registerPatient(req, res) {
  try {
    const { email, password, name, age, gender, medicalHistory } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash, role: 'PATIENT' }
    });

    await prisma.patientProfile.create({
      data: { userId: user.id, name, age, gender, medicalHistory }
    });

    return res.json({ token: sign(user), role: user.role });
  } catch (e) {
    return res.status(500).json({ message: 'Register failed' });
  }
}

// Login (any role, with role check)
export async function login(req, res) {
  try {
    const { email, password, role } = req.body; // include role
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    // Extra check: enforce role matches
    if (role && role !== user.role) {
      return res.status(400).json({ message: `This account is not a ${role.toLowerCase()}` });
    }

    return res.json({ token: sign(user), role: user.role });
  } catch {
    return res.status(500).json({ message: 'Login failed' });
  }
}
