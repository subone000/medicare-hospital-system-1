// prisma/list-users.js
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

function looksHashed(pw) {
  if (!pw || typeof pw !== 'string') return false;
  // bcrypt hashes usually start with $2a$ or $2b$ or $2y$
  return pw.startsWith('$2a$') || pw.startsWith('$2b$') || pw.startsWith('$2y$');
}

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' }
  });

  console.log('id, email, role, passwordType, createdAt');
  for (const u of users) {
    console.log(
      `${u.id}, ${u.email}, ${u.role}, ${looksHashed(u.password) ? 'HASHED' : 'PLAINTEXT'}, ${u.createdAt?.toISOString?.() || ''}`
    );
  }
  console.log('\nNote: If a password is PLAINTEXT, you should reset it to a hashed value right away.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
