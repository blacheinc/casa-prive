-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "interest" TEXT,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "reference1" TEXT,
ADD COLUMN     "reference2" TEXT;

-- CreateIndex
CREATE INDEX "Member_email_idx" ON "Member"("email");

-- CreateIndex
CREATE INDEX "Member_membershipCode_idx" ON "Member"("membershipCode");

-- CreateIndex
CREATE INDEX "Member_status_idx" ON "Member"("status");
