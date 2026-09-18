import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

if (process.env.NODE_ENV !== "production") {
  if (globalForPrisma.prisma && !(globalForPrisma.prisma as any).analyticsEvent) {
    try {
      globalForPrisma.prisma.$disconnect();
    } catch {}
    globalForPrisma.prisma = undefined;

    if (typeof require !== "undefined" && require.cache) {
      Object.keys(require.cache).forEach((key) => {
        if (key.includes(".prisma") || key.includes("@prisma")) {
          delete require.cache[key];
        }
      });
    }
  }
}

// Dynamically re-require if needed to get latest generated client
let FreshPrismaClient = PrismaClient;
if (process.env.NODE_ENV !== "production" && typeof require !== "undefined") {
  try {
    FreshPrismaClient = require("@prisma/client").PrismaClient;
  } catch {}
}

export const prisma =
  globalForPrisma.prisma ??
  new FreshPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;


