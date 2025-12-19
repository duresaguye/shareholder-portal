"use client";

import { useMemo, useState, useEffect } from "react";
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
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
} from "recharts";
import { TrendingUp, PieChart as PieChartIcon, DollarSign, BarChart3, Percent, Edit, Save, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useShareholders, useCurrentUser } from "@/lib/hooks/useShareholders";
import { useSystemSettings, useUpdateSystemSettings } from "@/lib/hooks/useSystemSettings";

const palette = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#6366F1", "#14B8A6", "#F97316"];

export default function SharesPage() {
    const { data, isLoading, error } = useShareholders();
    const shareholders = data?.shareholders ?? [];

    const { data: currentUserData } = useCurrentUser();
    const { data: settingsData, isLoading: settingsLoading } = useSystemSettings();
    const updateSettings = useUpdateSystemSettings();

    const [isEditAuthSharesOpen, setIsEditAuthSharesOpen] = useState(false);
    const [authorizedShares, setAuthorizedShares] = useState<string>("");

    const isAdmin = currentUserData?.shareholder?.role === "admin";
    const totalAuthorized = settingsData?.settings?.authorizedShares ?? 1_000_000;

    
    useEffect(() => {
        if (settingsData?.settings?.authorizedShares !== undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAuthorizedShares(settingsData.settings.authorizedShares.toString());
        }
    }, [settingsData?.settings?.authorizedShares]);

    const handleSaveAuthorizedShares = async () => {
        const value = parseInt(authorizedShares, 10);
        if (isNaN(value) || value < 0) {
            alert("Please enter a valid positive number");
            return;
        }

        try {
            await updateSettings.mutateAsync({ authorizedShares: value });
            setIsEditAuthSharesOpen(false);
        } catch (error) {
            console.error("Failed to update settings:", error);
        }
    };

    const { totalShares, issuedShares, availableShares, distribution } = useMemo(() => {
        const total = totalAuthorized || 0;
        const issued = shareholders.reduce((sum, s) => sum + (s.totalShares || 0), 0);
        const available = Math.max(total - issued, 0);

        const dist = shareholders
            .map((s, idx) => {
                const shares = s.totalShares || 0;
                const percentage = issued > 0 ? (shares / issued) * 100 : 0;
                const name = `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || s.username;
                return {
                    name,
                    value: shares,
                    percentage: Number(percentage.toFixed(2)),
                    color: palette[idx % palette.length],
                };
            })
            .sort((a, b) => b.value - a.value);

        return {
            totalShares: total || issued,
            issuedShares: issued,
            availableShares: total ? available : 0,
            distribution: dist,
        };
    }, [shareholders, totalAuthorized]);

    const issuanceRate = totalShares > 0 ? (issuedShares / totalShares) * 100 : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Share Distribution</h1>
                    <p className="text-gray-600 mt-2">
                        Live view of holdings, ownership breakdown, and cap table stats
                    </p>
                </div>
            </div>

            {/* Error state */}
            {error && (
                <Card className="border border-red-200 bg-red-50 text-red-700">
                    <CardContent className="py-4">
                        Failed to load shares data. Please retry.
                    </CardContent>
                </Card>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <div className="text-sm text-gray-600">Total Authorized</div>
                                    {isAdmin && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-5 w-5 p-0 hover:bg-blue-200 "
                                            onClick={() => setIsEditAuthSharesOpen(true)}
                                        >
                                            <Edit className="h-8 w-8 text-blue-600" />
                                        </Button>
                                    )}
                                </div>
                                <div className="text-xl font-bold text-gray-900 mt-1">
                                    {settingsLoading ? "…" : totalShares.toLocaleString()}
                                </div>
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
                                <div className="text-xl font-bold text-gray-900">
                                    {isLoading ? "…" : issuedShares.toLocaleString()}
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
                                <div className="text-xl font-bold text-gray-900">
                                    {isLoading ? "…" : availableShares.toLocaleString()}
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
                                <div className="text-xl font-bold text-gray-900">
                                    {isLoading ? "…" : `${issuanceRate.toFixed(1)}%`}
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
                            Ownership Distribution
                        </CardTitle>
                        <CardDescription>Breakdown by holder based on issued shares</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={(entry) => `${entry.percent}%`}
                                >
                                    {distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [value.toLocaleString(), "Shares"]}
                                    labelFormatter={(label) => `${label}`}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-2 gap-4">
                            {distribution.map((entry) => (
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
                            {!isLoading && distribution.length === 0 && (
                                <div className="col-span-2 text-sm text-gray-500">
                                    No ownership data available yet.
                                </div>
                            )}
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
                        <CardDescription>Authorized vs issued shares</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Authorized Shares */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-gray-900">Authorized Shares</div>
                                    <div className="text-sm text-gray-600">Maximum shares that can be issued</div>
                                </div>
                                <div className="text-xl font-bold text-gray-900">
                                    {isLoading ? "…" : totalShares.toLocaleString()}
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
                                <div className="text-xl font-bold text-emerald-600">
                                    {isLoading ? "…" : issuedShares.toLocaleString()}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Issuance Rate</span>
                                    <span className="font-bold text-emerald-700">
                                        {isLoading ? "…" : `${issuanceRate.toFixed(1)}%`}
                                    </span>
                                </div>
                                <Progress
                                    value={issuanceRate}
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
                                <div className="text-xl font-bold text-amber-600">
                                    {isLoading ? "…" : availableShares.toLocaleString()}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Available Rate</span>
                                    <span className="font-bold text-amber-700">
                                        {isLoading ? "…" : `${(100 - issuanceRate).toFixed(1)}%`}
                                    </span>
                                </div>
                                <Progress
                                    value={100 - issuanceRate}
                                    className="h-2 bg-gray-200"
                                    indicatorClassName="bg-amber-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Holdings Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Current Shareholders</CardTitle>
                            <CardDescription>
                                Live holdings and ownership percentages
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {shareholders.length} holders
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-gray-200">
                                    <TableHead className="font-semibold text-gray-700 py-4">Shareholder</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Email</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4 text-right">Shares</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4 text-right">% Ownership</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-6 text-center text-gray-500">
                                            Loading shareholder data...
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!isLoading && shareholders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-6 text-center text-gray-500">
                                            No shareholders found.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!isLoading && distribution.map((holder) => (
                                    <TableRow
                                        key={holder.name}
                                        className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0"
                                    >
                                        <TableCell className="py-4">
                                            <div className="font-semibold text-gray-900">
                                                {holder.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="text-sm text-gray-600">
                                                {shareholders.find(s => `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() === holder.name || s.username === holder.name)?.email ?? "—"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-right font-bold text-gray-900">
                                            {holder.value.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="py-4 text-right font-bold text-emerald-600">
                                            {holder.percentage.toFixed(2)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100/30 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">Share Distribution Insights</h3>
                        <p className="text-sm text-gray-600">
                            {isLoading
                                ? "Loading..."
                                : `${issuedShares.toLocaleString()} shares issued out of ${totalShares.toLocaleString()} authorized. ${availableShares.toLocaleString()} shares remain available for issuance.`}
                        </p>
                    </div>
                    <Badge variant="outline" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Live
                    </Badge>
                </div>
            </Card>

            {/* Edit Authorized Shares Modal */}
            <Dialog open={isEditAuthSharesOpen} onOpenChange={setIsEditAuthSharesOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Authorized Shares</DialogTitle>
                        <DialogDescription>
                            Set the maximum number of shares the company is authorized to issue.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {settingsData?.settings && (
                            <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-gray-500">Distributed</div>
                                    <div className="text-lg font-bold text-blue-600">
                                        {settingsData.settings.totalDistributedShares?.toLocaleString() || 0}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-gray-500">Available</div>
                                    <div className={`text-lg font-bold ${(settingsData.settings.availableShares || 0) > 0
                                            ? 'text-emerald-600'
                                            : 'text-red-600'
                                        }`}>
                                        {settingsData.settings.availableShares?.toLocaleString() || 0}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="authShares" className="font-medium">
                                Authorized Shares
                            </Label>
                            <Input
                                id="authShares"
                                type="number"
                                min="0"
                                value={authorizedShares}
                                onChange={(e) => setAuthorizedShares(e.target.value)}
                                disabled={settingsLoading || updateSettings.isPending}
                                placeholder="Enter authorized shares"
                                className="h-11"
                            />
                        </div>
                        {settingsData?.settings?.updatedBy && (
                            <p className="text-xs text-gray-500">
                                Last updated by {settingsData.settings.updatedBy.firstName} {settingsData.settings.updatedBy.lastName} on{" "}
                                {new Date(settingsData.settings.updatedAt).toLocaleDateString()}
                            </p>
                        )}
                        {updateSettings.isSuccess && (
                            <p className="text-sm text-emerald-600">
                                ✓ Settings saved successfully
                            </p>
                        )}
                        {updateSettings.isError && (
                            <p className="text-sm text-red-600">
                                ✗ Failed to save settings. Please try again.
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditAuthSharesOpen(false)}
                            disabled={updateSettings.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveAuthorizedShares}
                            disabled={settingsLoading || updateSettings.isPending}
                            className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                            {updateSettings.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}