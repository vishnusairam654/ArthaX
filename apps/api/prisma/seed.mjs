// ARTHAX admin provisioning.
// Seeds 1 Central Bank admin + 5 commercial bank admins.
// DEV-ONLY fixed passwords — rotate before any real deployment.
import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

const DEV_PASSWORD = "Admin@123";

const ADMINS = [
  { email: "central.admin@arthax.dev", role: "CENTRAL_BANK_ADMIN", govId: "AXSYS-CENTRAL" },
  { email: "nava.admin@arthax.dev", role: "BANK_ADMIN", govId: "AXSYS-BKNAVA" },
  { email: "samaya.admin@arthax.dev", role: "BANK_ADMIN", govId: "AXSYS-BKSAMY" },
  { email: "setu.admin@arthax.dev", role: "BANK_ADMIN", govId: "AXSYS-BKSETU" },
  { email: "sthira.admin@arthax.dev", role: "BANK_ADMIN", govId: "AXSYS-BKSTHI" },
  { email: "vayu.admin@arthax.dev", role: "BANK_ADMIN", govId: "AXSYS-BKVAYU" },
];

async function main() {
  const govHash = await hash(DEV_PASSWORD);
  for (const admin of ADMINS) {
    const user = await prisma.user.upsert({
      where: { email: admin.email },
      update: { role: admin.role },
      create: { email: admin.email, role: admin.role },
    });
    await prisma.govId.upsert({
      where: { userId: user.id },
      update: {},
      create: { id: admin.govId, userId: user.id },
    });
    await prisma.credential.upsert({
      where: { userId: user.id },
      update: { govPasswordHash: govHash },
      create: { userId: user.id, govPasswordHash: govHash },
    });
    console.log(`seeded ${admin.role}: ${admin.email} / ${DEV_PASSWORD}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
