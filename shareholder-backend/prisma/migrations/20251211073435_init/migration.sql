-- CreateEnum
CREATE TYPE "ShareholderType" AS ENUM ('individual', 'institution');

-- CreateEnum
CREATE TYPE "ShareholderStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'shareholder');

-- CreateEnum
CREATE TYPE "ShareClassType" AS ENUM ('COMMON', 'PREFERRED', 'OPTIONS_POOL', 'TREASURY');

-- CreateEnum
CREATE TYPE "ProposalType" AS ENUM ('GENERAL', 'FINANCIAL', 'MANAGER_ELECTION', 'TRANSFER_APPROVAL', 'AMENDMENT', 'NEW_SHAREHOLDER');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('open', 'closed', 'approved', 'rejected', 'pending');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('YES', 'NO', 'ABSTAIN');

-- CreateEnum
CREATE TYPE "DividendStatus" AS ENUM ('pending', 'paid', 'unpaid');

-- CreateEnum
CREATE TYPE "AnnouncementPriority" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('pending', 'voting', 'approved', 'rejected', 'completed');

-- CreateTable
CREATE TABLE "Shareholder" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "type" "ShareholderType" NOT NULL,
    "status" "ShareholderStatus" NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "role" "UserRole" NOT NULL,
    "ownership" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalShares" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shareholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareClass" (
    "id" TEXT NOT NULL,
    "name" "ShareClassType" NOT NULL,
    "description" TEXT,

    CONSTRAINT "ShareClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareholderShare" (
    "id" TEXT NOT NULL,
    "shareholderId" TEXT NOT NULL,
    "shareClassId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShareholderShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ProposalType" NOT NULL,
    "status" "ProposalStatus" NOT NULL,
    "requiredThreshold" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,
    "targetShareholderId" TEXT,
    "targetTransferId" TEXT,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "shareholderId" TEXT NOT NULL,
    "vote" "VoteType" NOT NULL,
    "voteWeight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dividend" (
    "id" TEXT NOT NULL,
    "declaredDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "amountPerShare" DOUBLE PRECISION NOT NULL,
    "shareClassId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "DividendStatus" NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dividend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DividendHistory" (
    "id" TEXT NOT NULL,
    "shareholderId" TEXT NOT NULL,
    "dividendId" TEXT NOT NULL,
    "amountReceived" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DividendHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "role" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "priority" "AnnouncementPriority" NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT,
    "addedById" TEXT,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "shareholderId" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharePurchaseHistory" (
    "id" TEXT NOT NULL,
    "shareholderId" TEXT NOT NULL,
    "shareClassId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharePurchaseHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareTransferRequest" (
    "id" TEXT NOT NULL,
    "fromShareholderId" TEXT NOT NULL,
    "toShareholderId" TEXT NOT NULL,
    "shareClassId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "status" "TransferStatus" NOT NULL,
    "proposalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShareTransferRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "prevValue" TEXT,
    "newValue" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shareholder_email_key" ON "Shareholder"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shareholder_username_key" ON "Shareholder"("username");

-- AddForeignKey
ALTER TABLE "ShareholderShare" ADD CONSTRAINT "ShareholderShare_shareholderId_fkey" FOREIGN KEY ("shareholderId") REFERENCES "Shareholder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareholderShare" ADD CONSTRAINT "ShareholderShare_shareClassId_fkey" FOREIGN KEY ("shareClassId") REFERENCES "ShareClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Shareholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_shareholderId_fkey" FOREIGN KEY ("shareholderId") REFERENCES "Shareholder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dividend" ADD CONSTRAINT "Dividend_shareClassId_fkey" FOREIGN KEY ("shareClassId") REFERENCES "ShareClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DividendHistory" ADD CONSTRAINT "DividendHistory_shareholderId_fkey" FOREIGN KEY ("shareholderId") REFERENCES "Shareholder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DividendHistory" ADD CONSTRAINT "DividendHistory_dividendId_fkey" FOREIGN KEY ("dividendId") REFERENCES "Dividend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Shareholder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "Shareholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_shareholderId_fkey" FOREIGN KEY ("shareholderId") REFERENCES "Shareholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharePurchaseHistory" ADD CONSTRAINT "SharePurchaseHistory_shareholderId_fkey" FOREIGN KEY ("shareholderId") REFERENCES "Shareholder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharePurchaseHistory" ADD CONSTRAINT "SharePurchaseHistory_shareClassId_fkey" FOREIGN KEY ("shareClassId") REFERENCES "ShareClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareTransferRequest" ADD CONSTRAINT "ShareTransferRequest_fromShareholderId_fkey" FOREIGN KEY ("fromShareholderId") REFERENCES "Shareholder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareTransferRequest" ADD CONSTRAINT "ShareTransferRequest_toShareholderId_fkey" FOREIGN KEY ("toShareholderId") REFERENCES "Shareholder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareTransferRequest" ADD CONSTRAINT "ShareTransferRequest_shareClassId_fkey" FOREIGN KEY ("shareClassId") REFERENCES "ShareClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareTransferRequest" ADD CONSTRAINT "ShareTransferRequest_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Shareholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Shareholder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Shareholder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
