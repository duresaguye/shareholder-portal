"use client";

import { HistorySection } from "@/components/dashboard/HistorySection";
import { ProfileHeader } from "@/components/dashboard/ProfileHeader";
import { ShareSummary } from "@/components/dashboard/ShareSummary";
import { TransferRequests } from "@/components/dashboard/TransferRequests";
import { ActiveProposals } from "@/components/dashboard/ActiveProposals";

export default function ShareholderDashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Shareholder Dashboard
                </h2>
            </div>

            <ProfileHeader />

            <ShareSummary />

            <div id="active-proposals" className="scroll-mt-20">
                <ActiveProposals />
            </div>

            <HistorySection />
            <div id="transfer-requests" className="scroll-mt-20">
                <TransferRequests />
            </div>
        </div>
    );
}
