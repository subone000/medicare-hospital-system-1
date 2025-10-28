// prisma/reset-password.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];    // pass email as first arg
  const newPass = process.argv[3];  // pass new password as second arg

  if (!email || !newPass) {
    console.log('Usage: node prisma/reset-password.js <email> <newPassword>');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log(`No user found with email: ${email}`);
    process.exit(1);
  }

  const hashed = await bcrypt.hash(newPass, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed }
  });

  console.log(`✅ Password for ${email} has been reset to: ${newPass}`);
  console.log('Note: The script stores only the hashed password; this plaintext is shown only in the console for your use — do not share it.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
