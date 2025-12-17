-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_targetShareholderId_fkey" FOREIGN KEY ("targetShareholderId") REFERENCES "Shareholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
