-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('STANDARD', 'PREMIUM');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN "membershipType" "MembershipType" NOT NULL DEFAULT 'STANDARD';
