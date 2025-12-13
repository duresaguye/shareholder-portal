"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Target, Percent, PieChart, TrendingUp } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/useShareholders";

export function ProfileHeader() {
    const { data } = useCurrentUser();
    const shareholder = data?.shareholder;

    const totalShares = shareholder?.totalShares ?? 0;
    const ownershipPercent = shareholder?.ownership ?? 0; // percentage
    const votingPowerPercent = ownershipPercent;
    const totalCompanyShares = 1_000_000; // fallback; replace with real total if available
    const shareValue = 0; // not provided by API
    const initials = shareholder ? `${shareholder.firstName?.[0] ?? ""}${shareholder.lastName?.[0] ?? ""}` || "SH" : "SH";

    return (
        <Card className="mb-6 overflow-hidden border-0 shadow-lg">
            {/* Profile Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400" />

            <CardContent className="relative px-6 pb-6">
                {/* Profile Info Section */}
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                    <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
                        <div className="-mt-12 rounded-full border-4 border-white bg-white p-1 shadow-lg">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src="/avatars/01.png" alt="User" />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="text-center md:mb-2 md:text-left">
                            <div className="flex flex-col items-center gap-2 md:flex-row md:items-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {shareholder ? `${shareholder.firstName} ${shareholder.lastName}` : "Shareholder"}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 gap-1">
                                        ACTIVE
                                    </Badge>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {shareholder?.type === "institution" ? "Institutional" : "Individual"} Shareholder
                                    </Badge>
                                </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                @{shareholder?.username ?? "username"} • Status: {shareholder?.status ?? "pending"}
                            </p>

                            {/* Voting Power Display */}
                            <div className="mt-4 flex items-center gap-4">
                                <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2">
                                    <div className="p-2 rounded-full bg-blue-600/10">
                                        <Percent className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-blue-700">VOTING POWER</div>
                                        <div className="text-lg font-bold text-blue-800">
                                            {votingPowerPercent}% of total votes
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-2">
                                    <div className="p-2 rounded-full bg-emerald-600/10">
                                        <PieChart className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-emerald-700">SHARES HELD</div>
                                        <div className="text-lg font-bold text-emerald-800">
                                            {totalShares.toLocaleString()} shares
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-gray-600 md:justify-start">
                                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5">
                                    <Mail className="h-4 w-4" />
                                    {shareholder?.email ?? "—"}
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5">
                                    <Phone className="h-4 w-4" />
                                    {shareholder?.phone ?? "Not provided"}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-white border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100">
                                    <Target className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Share Value</div>
                                    <div className="font-bold text-lg text-gray-900">
                                        {shareValue ? `$${shareValue.toFixed(2)}` : "—"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Total Value</div>
                                    <div className="font-bold text-lg text-gray-900">
                                        {shareValue
                                            ? `$${(shareValue * totalShares).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                                            : "—"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-100">
                                    <Percent className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Rank Among Holders</div>
                                    <div className="font-bold text-lg text-gray-900">
                                        {shareholder ? "Shareholder" : "—"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Voting Power Explanation */}
                <div className="mt-6 rounded-lg bg-blue-50/50 border border-blue-200 p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <Target className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-medium text-blue-900">How Voting Power Works</h4>
                            <p className="text-sm text-blue-800 mt-1">
                                Your vote counts for {votingPowerPercent}% of the total vote. This is calculated based on your {totalShares.toLocaleString()} shares out of {totalCompanyShares.toLocaleString()} total company shares (or ownership provided by the system).
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}