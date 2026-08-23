import { execSync } from "node:child_process";

/** Prepares the throwaway test database: schema + idempotent admin seeds. */
export default function globalSetup(): void {
  const env = {
    ...process.env,
    DATABASE_URL: "postgresql://arthax:arthax@localhost:5432/arthax_test",
  };
  execSync("pnpm exec prisma migrate deploy", { stdio: "inherit", env });
  execSync("node prisma/seed.mjs", { stdio: "inherit", env });
}
