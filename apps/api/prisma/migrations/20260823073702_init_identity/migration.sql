-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'BANK_ADMIN', 'CENTRAL_BANK_ADMIN');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('REGISTRATION', 'LOGIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovId" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GovId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "userId" TEXT NOT NULL,
    "govPasswordHash" TEXT NOT NULL,
    "financialPasswordHash" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "EmailOtp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "GovId_userId_key" ON "GovId"("userId");

-- CreateIndex
CREATE INDEX "EmailOtp_email_purpose_idx" ON "EmailOtp"("email", "purpose");

-- CreateIndex
CREATE INDEX "EmailOtp_expiresAt_idx" ON "EmailOtp"("expiresAt");

-- AddForeignKey
ALTER TABLE "GovId" ADD CONSTRAINT "GovId_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
