"use client";

import { useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Users as UsersIcon, PieChart as PieChartIcon, Vote, Calendar, TrendingUp, FileText, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useShareholders } from "@/lib/hooks/useShareholders";
import { useProposals } from "@/lib/hooks/useProposals";

const palette = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#6366F1", "#14B8A6", "#F97316"];

export default function DashboardPage() {
    const { data: shareholdersData, isLoading: loadingShareholders, error: shareholdersError } = useShareholders();
    const { data: proposalsData, isLoading: loadingProposals, error: proposalsError } = useProposals();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const shareholders = shareholdersData?.shareholders ?? [];
    const proposals = proposalsData?.proposals ?? [];

    const {
        totalShareholders,
        totalShares,
        ownershipData,
        barData,
    } = useMemo(() => {
        const total = shareholders.length;
        const sharesSum = shareholders.reduce((sum, s) => sum + (s.totalShares || 0), 0);

        const sorted = [...shareholders].sort((a, b) => (b.totalShares || 0) - (a.totalShares || 0));
        const top = sorted.slice(0, 6).map((s, idx) => {
            const name = `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || s.username;
            const value = s.totalShares || 0;
            const percentage = sharesSum > 0 ? ((value / sharesSum) * 100) : 0;
            return {
                name,
                value,
                percentage: Number(percentage.toFixed(1)),
                color: palette[idx % palette.length],
            };
        });

        const ownership = top;
        const bar = top.map((t) => ({ name: t.name, shares: t.value }));

        return {
            totalShareholders: total,
            totalShares: sharesSum,
            ownershipData: ownership,
            barData: bar,
        };
    }, [shareholders]);

    const activeProposals = proposals.filter((p) => p.status === "open" || p.status === "pending").length;
    const upcomingMeetings = activeProposals;

    const isLoading = loadingShareholders || loadingProposals;
    const hasError = shareholdersError || proposalsError;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Overview of your equity management and shareholder information
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="gap-2 bg-white">
                        <Calendar className="h-4 w-4" />
                        Last updated: Live
                    </Badge>
                </div>
            </div>

            {hasError && (
                <Card className="border border-red-200 bg-red-50 text-red-700">
                    <CardContent className="py-4">
                        Unable to load dashboard data. Please retry.
                    </CardContent>
                </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-bold text-gray-900">
                                    {isLoading ? "…" : totalShareholders.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">Total Shareholders</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">Live count</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                <UsersIcon className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-bold text-gray-900">
                                    {isLoading ? "…" : totalShares.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">Total Shares Issued</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-gray-600">Sum of all holders</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                                <FileText className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-bold text-gray-900">
                                    {isLoading ? "…" : activeProposals}
                                </div>
                                <div className="text-sm text-gray-600">Active Proposals</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-yellow-600">Open or pending</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                                <Vote className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-bold text-gray-900">
                                    {isLoading ? "…" : upcomingMeetings}
                                </div>
                                <div className="text-sm text-gray-600">Upcoming Meetings</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-blue-600">Based on active proposals</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                {/* Holdings Chart */}
                <Card className="col-span-4 border-0 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900">Top Holders (Shares)</CardTitle>
                                    <CardDescription>Share count by largest holders</CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                Live
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                    formatter={(value: number) => [value.toLocaleString(), "Shares"]}
                                />
                                <Bar
                                    dataKey="shares"
                                    fill="#3B82F6"
                                    radius={[4, 4, 0, 0]}
                                    className="hover:fill-blue-600 transition-colors"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Share Distribution Chart */}
                <Card className="col-span-3 border-0 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                    <PieChartIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900">Ownership Distribution</CardTitle>
                                    <CardDescription>Breakdown by top holders</CardDescription>
                                </div>
                            </div>
                            <Badge className="bg-purple-500 text-white">
                                {ownershipData.reduce((acc, item) => acc + item.percentage, 0).toFixed(1)}% Total
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={ownershipData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={2}
                                    dataKey="percentage"
                                    label={({ name, value }) => `${name}: ${value}%`}
                                    labelLine={false}
                                >
                                    {ownershipData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            className="hover:opacity-80 transition-opacity"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [`${value}%`, "Ownership"]}
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legend */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            {ownershipData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm text-gray-700">{item.name}</span>
                                    <span className="ml-auto text-sm font-medium text-gray-900">{item.percentage}%</span>
                                </div>
                            ))}
                            {!isLoading && ownershipData.length === 0 && (
                                <div className="col-span-2 text-sm text-gray-500">
                                    No ownership data available yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Summary */}
            <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100/30 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">Dashboard Summary</h3>
                        <p className="text-sm text-gray-600">
                            {isLoading
                                ? "Loading..."
                                : `${totalShareholders.toLocaleString()} shareholders • ${totalShares.toLocaleString()} shares issued • ${activeProposals} active proposals`}
                        </p>
                    </div>
                    <Badge variant="outline" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Live Data
                    </Badge>
                </div>
            </Card>
        </div>
    );
}