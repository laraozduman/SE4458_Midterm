import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin oluştur
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.admin.create({
    data: {
      username: "admin",
      password: hashedPassword,
      role: "admin",
    },
  });

  // User oluştur
  await prisma.user.create({
    data: {
      subscriberNo: "11111",
      role: "user",
    },
  });

  console.log("Seed data inserted!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
