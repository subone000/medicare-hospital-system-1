import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminPass = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@medicare.pro' },
    update: {},
    create: {
      email: 'admin@medicare.pro',
      password: adminPass,
      role: 'ADMIN'
    }
  });

  // Optional: one doctor for testing
  const docPass = await bcrypt.hash('Doc@12345', 10);
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor1@medicare.pro' },
    update: {},
    create: { email: 'doctor1@medicare.pro', password: docPass, role: 'DOCTOR' }
  });

  await prisma.doctorProfile.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      name: 'Dr. Aisha Khan',
      specialization: 'Cardiology'
    }
  });

  console.log('Seeded admin + sample doctor');
}

main().finally(() => prisma.$disconnect());
