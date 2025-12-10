"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
    Legend,
} from "recharts";
import { Download, Filter, TrendingUp, PieChart as PieChartIcon, DollarSign, BarChart3, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const distributionData = [
    { name: "Common Stock", value: 600000, percentage: 60, color: "#3B82F6" },
    { name: "Preferred Stock", value: 200000, percentage: 20, color: "#10B981" },
    { name: "Options Pool", value: 100000, percentage: 10, color: "#F59E0B" },
    { name: "Treasury Shares", value: 100000, percentage: 10, color: "#64748B" },
];

const issuanceData = [
    { date: "2023-11-01", shareholder: "New Investor LLC", class: "Preferred A", amount: "50,000", price: "$15.00", approved: "Board Resolution #45" },
    { date: "2023-10-15", shareholder: "Jane Smith", class: "Common", amount: "5,000", price: "$12.50", approved: "Board Resolution #44" },
    { date: "2023-09-30", shareholder: "Employee Options", class: "Options", amount: "10,000", price: "$10.00", approved: "Compensation Comm." },
    { date: "2023-08-20", shareholder: "Strategic Partners", class: "Preferred B", amount: "25,000", price: "$18.00", approved: "Board Resolution #43" },
    { date: "2023-07-05", shareholder: "John Doe", class: "Common", amount: "2,500", price: "$14.00", approved: "Board Resolution #42" },
];

const totalShares = 1000000;
const issuedShares = 900000;
const availableShares = totalShares - issuedShares;

export default function SharesPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Share Distribution</h1>
                    <p className="text-gray-600 mt-2">
                        Overview of authorized shares, distribution, and recent issuances
                    </p>
                </div>

            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {totalShares.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">Total Authorized</div>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                <PieChartIcon className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {issuedShares.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">Issued Shares</div>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {availableShares.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">Available</div>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {(issuedShares / totalShares * 100).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">Issuance Rate</div>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                                <Percent className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Pie Chart Card */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-blue-600" />
                            Share Class Distribution
                        </CardTitle>
                        <CardDescription>Breakdown by share type and ownership</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={(entry) => `${entry.percent}%`}
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [value.toLocaleString(), 'Shares']}
                                    labelFormatter={(label) => `${label}`}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-2 gap-4">
                            {distributionData.map((entry, index) => (
                                <div key={entry.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: entry.color }}
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                {entry.name}
                                            </span>
                                        </div>
                                        <span className="font-bold text-gray-900">{entry.percentage}%</span>
                                    </div>
                                    <Progress
                                        value={entry.percentage}
                                        className="h-1.5 bg-gray-200"
                                        indicatorClassName="bg-gray-400"
                                    />
                                    <div className="text-xs text-gray-500">
                                        {entry.value.toLocaleString()} shares
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Cap Table Summary Card */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            Cap Table Summary
                        </CardTitle>
                        <CardDescription>Overview of authorized vs issued shares</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Authorized Shares */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-gray-900">Authorized Shares</div>
                                    <div className="text-sm text-gray-600">Maximum shares that can be issued</div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {totalShares.toLocaleString()}
                                </div>
                            </div>
                            <Progress
                                value={100}
                                className="h-2 bg-gray-200"
                                indicatorClassName="bg-gray-400"
                            />
                        </div>

                        {/* Issued Shares */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-gray-900">Issued Shares</div>
                                    <div className="text-sm text-gray-600">Currently outstanding shares</div>
                                </div>
                                <div className="text-2xl font-bold text-emerald-600">
                                    {issuedShares.toLocaleString()}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Issuance Rate</span>
                                    <span className="font-bold text-emerald-700">
                                        {(issuedShares / totalShares * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <Progress
                                    value={issuedShares / totalShares * 100}
                                    className="h-2 bg-gray-200"
                                    indicatorClassName="bg-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Available Shares */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-gray-900">Available for Issuance</div>
                                    <div className="text-sm text-gray-600">Remaining authorized shares</div>
                                </div>
                                <div className="text-2xl font-bold text-amber-600">
                                    {availableShares.toLocaleString()}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Available Rate</span>
                                    <span className="font-bold text-amber-700">
                                        {(availableShares / totalShares * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <Progress
                                    value={availableShares / totalShares * 100}
                                    className="h-2 bg-gray-200"
                                    indicatorClassName="bg-amber-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Issuances Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Share Issuances</CardTitle>
                            <CardDescription>
                                Latest share allocations and distributions
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {issuanceData.length} Transactions
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-gray-200">
                                    <TableHead className="font-semibold text-gray-700 py-4">Date</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Shareholder</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Class</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Amount</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Price/Share</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Approved By</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {issuanceData.map((issuance, index) => (
                                    <TableRow
                                        key={index}
                                        className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0"
                                    >
                                        <TableCell className="py-4">
                                            <div className="font-medium text-gray-900">
                                                {issuance.date}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="font-semibold text-gray-900">
                                                {issuance.shareholder}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant="outline" className={`
                                                ${issuance.class.includes('Preferred') ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                    issuance.class.includes('Options') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        'bg-blue-50 text-blue-700 border-blue-200'}
                                            `}>
                                                {issuance.class}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="font-bold text-gray-900">
                                                {issuance.amount}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="font-bold text-emerald-600">
                                                {issuance.price}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="text-sm text-gray-600">
                                                {issuance.approved}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Table Footer */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <div>
                            Showing <span className="font-semibold">{issuanceData.length}</span> issuances
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                ← Previous
                            </Button>
                            <span className="font-medium">Page 1 of 1</span>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                Next →
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100/30 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">Share Distribution Insights</h3>
                        <p className="text-sm text-gray-600">
                            {issuedShares.toLocaleString()} shares issued out of {totalShares.toLocaleString()} authorized.
                            {availableShares > 0 ? ` ${availableShares.toLocaleString()} shares remain available for future issuances.` : ' No shares remaining for issuance.'}
                        </p>
                    </div>
                    <Badge variant="outline" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Updated Today
                    </Badge>
                </div>
            </Card>
        </div>
    );
}