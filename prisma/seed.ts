import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedSetting(key: string, value?: string) {
  if (!value) return;

  await prisma.settings.upsert({
    where: { key },
    update: {}, // do nothing if exists
    create: {
      key,
      value,
    },
  });
}

async function main() {
  await seedSetting("qb_url", process.env.QB_BASEURL);
  await seedSetting("qb_port", process.env.QB_PORT);
  await seedSetting("qb_username", process.env.QB_USERNAME);
  await seedSetting("qb_password", process.env.QB_PASSWORD);
  await seedSetting("ab_key", process.env.AB_PASSKEY);
  await seedSetting("ab_username", process.env.AB_USERNAME);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()
);
