import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} else {
  // Auto-seed admin in production if not exists
  (async () => {
    try {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash("7588262158", 10);
        await prisma.user.create({
          data: {
            email: "kagawadeabhinav1@gmail.com",
            name: "Main Admin",
            password: hashedPassword,
            role: "ADMIN",
          },
        });
        console.log("Admin auto-seeded");
      }
    } catch (e) {
      console.error("Auto-seed error:", e);
    }
  })();
}
