import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient instance across hot reloads in dev,
// and across serverless invocations where possible, to avoid
// exhausting the database connection limit.
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
