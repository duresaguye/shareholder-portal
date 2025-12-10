"use client";

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
import { Users, PieChart as PieChartIcon, Vote, Calendar, TrendingUp, FileText, DollarSign, Users as UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const dividendData = [
    { name: "Jan", dividends: 4000 },
    { name: "Feb", dividends: 3000 },
    { name: "Mar", dividends: 2000 },
    { name: "Apr", dividends: 2780 },
    { name: "May", dividends: 1890 },
    { name: "Jun", dividends: 2390 },
];

const ownershipData = [
    { name: "Founder", value: 40, color: "#3B82F6" }, // blue-500
    { name: "Investors", value: 30, color: "#10B981" }, // emerald-500
    { name: "Employees", value: 20, color: "#8B5CF6" }, // purple-500
    { name: "Public", value: 10, color: "#F59E0B" }, // amber-500
];

export default function DashboardPage() {
    const totalShareholders = 1234;
    const totalShares = 1000000;
    const activeProposals = 3;
    const upcomingMeetings = 2;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Overview of your equity management and shareholder information
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="gap-2 bg-white">
                        <Calendar className="h-4 w-4" />
                        Last updated: Today
                    </Badge>
                </div>
            </div>

            {/* Stats Cards - Matching Report Page Style */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{totalShareholders.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">Total Shareholders</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">+20.1% from last month</span>
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
                                <div className="text-2xl font-bold text-gray-900">{totalShares.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">Total Shares Issued</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-gray-600">100% of authorized shares</span>
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
                                <div className="text-2xl font-bold text-gray-900">{activeProposals}</div>
                                <div className="text-sm text-gray-600">Active Proposals</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-yellow-600">2 voting deadlines soon</span>
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
                                <div className="text-2xl font-bold text-gray-900">{upcomingMeetings}</div>
                                <div className="text-sm text-gray-600">Upcoming Meetings</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-blue-600">Next: Annual GM (14 days)</span>
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
                {/* Dividend History Chart */}
                <Card className="col-span-4 border-0 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900">Dividend History</CardTitle>
                                    <CardDescription>Monthly dividend distribution over time</CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                Last 6 months
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={dividendData}>
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
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    formatter={(value) => [`$${value}`, 'Dividends']}
                                />
                                <Bar
                                    dataKey="dividends"
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
                                    <CardTitle className="text-xl font-bold text-gray-900">Share Distribution</CardTitle>
                                    <CardDescription>Ownership breakdown by category</CardDescription>
                                </div>
                            </div>
                            <Badge className="bg-purple-500 text-white">
                                {ownershipData.reduce((acc, item) => acc + item.value, 0)}% Total
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
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`}
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
                                    formatter={(value) => [`${value}%`, 'Ownership']}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legend */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            {ownershipData.map((item, index) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm text-gray-700">{item.name}</span>
                                    <span className="ml-auto text-sm font-medium text-gray-900">{item.value}%</span>
                                </div>
                            ))}
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
                            {totalShareholders.toLocaleString()} shareholders • {totalShares.toLocaleString()} shares issued •
                            {activeProposals} active proposals • Next meeting in 14 days
                        </p>
                    </div>
                    <Badge variant="outline" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Real-time Data
                    </Badge>
                </div>
            </Card>
        </div>
    );
}