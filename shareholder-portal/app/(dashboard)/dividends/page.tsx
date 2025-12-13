"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
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
    Download,
    Plus,
    TrendingUp,
    Calendar,
    DollarSign,
    FileText,
    CheckCircle,
    Clock,
    Filter,
    ArrowUpRight,
    TrendingDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const dividendHistory = [
    {
        id: "1",
        declaredDate: "2023-12-01",
        paymentDate: "2023-12-15",
        amountPerShare: 0.50,
        totalAmount: 500000,
        status: "paid",
        sharesOutstanding: 1000000,
        yield: "2.5%",
        recordDate: "2023-12-10"
    },
    {
        id: "2",
        declaredDate: "2023-09-01",
        paymentDate: "2023-09-15",
        amountPerShare: 0.45,
        totalAmount: 450000,
        status: "paid",
        sharesOutstanding: 1000000,
        yield: "2.3%",
        recordDate: "2023-09-10"
    },
    {
        id: "3",
        declaredDate: "2023-06-01",
        paymentDate: "2023-06-15",
        amountPerShare: 0.40,
        totalAmount: 400000,
        status: "paid",
        sharesOutstanding: 1000000,
        yield: "2.1%",
        recordDate: "2023-06-10"
    },
    {
        id: "4",
        declaredDate: "2023-03-01",
        paymentDate: "2023-03-15",
        amountPerShare: 0.35,
        totalAmount: 350000,
        status: "paid",
        sharesOutstanding: 1000000,
        yield: "1.9%",
        recordDate: "2023-03-10"
    },
    {
        id: "5",
        declaredDate: "2024-03-01",
        paymentDate: "2024-03-15",
        amountPerShare: 0.55,
        totalAmount: 550000,
        status: "scheduled",
        sharesOutstanding: 1000000,
        yield: "2.8%",
        recordDate: "2024-03-10"
    },
];

const ytdTotal = dividendHistory
    .filter(d => d.status === "paid" && d.declaredDate.startsWith("2024"))
    .reduce((acc, curr) => acc + curr.totalAmount, 0) || 1250000;

export default function DividendsPage() {
    const handleDeclareDividend = () => {
        console.log("Declare new dividend");
        // Implement dividend declaration logic here
    };

    const handleExportData = () => {
        console.log("Export dividend data");
        // Implement export logic here
    };

    return (
        <div className="space-y-8">
            <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Coming soon: this page will show live dividend data. Current content is placeholder.
            </div>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dividends</h1>
                    <p className="text-gray-600 mt-2">
                        Manage dividend declarations, distributions, and history
                    </p>
                </div>
                <div className="flex items-center gap-3">

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                <Plus className="h-4 w-4" />
                                Declare Dividend
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Declare New Dividend</DialogTitle>
                                <DialogDescription>
                                    Declare a new dividend distribution for shareholders
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="font-medium text-gray-700">
                                        Amount Per Share
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            $
                                        </span>
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="pl-8 h-11"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="recordDate" className="font-medium text-gray-700">
                                            Record Date
                                        </Label>
                                        <Input
                                            id="recordDate"
                                            type="date"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="paymentDate" className="font-medium text-gray-700">
                                            Payment Date
                                        </Label>
                                        <Input
                                            id="paymentDate"
                                            type="date"
                                            className="h-11"
                                        />
                                    </div>
                                </div>
                                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                                    <div className="flex items-start gap-2">
                                        <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">Estimated Distribution</p>
                                            <p className="text-sm text-blue-700">
                                                1,000,000 shares × $0.00 = $0.00 total
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDeclareDividend}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                >
                                    Declare Dividend
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    ${(ytdTotal / 1000).toFixed(0)}K
                                </div>
                                <div className="text-sm text-gray-600">YTD Distributed</div>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    Dec 15, 2023
                                </div>
                                <div className="text-sm text-gray-600">Last Distribution</div>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    Mar 15, 2024
                                </div>
                                <div className="text-sm text-gray-600">Next Scheduled</div>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    2.8%
                                </div>
                                <div className="text-sm text-gray-600">Current Yield</div>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dividend Performance */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Dividend History
                        </CardTitle>
                        <CardDescription>
                            Quarterly dividend payments over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dividendHistory.slice(0, 4).map((dividend) => (
                                <div key={dividend.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <div className="space-y-1">
                                        <div className="font-medium text-gray-900">
                                            Q{Math.ceil(parseInt(dividend.declaredDate.split('-')[1], 10) / 3)} {dividend.declaredDate.split('-')[0]}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Paid on {dividend.paymentDate}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-emerald-600">
                                            ${dividend.amountPerShare.toFixed(2)}/share
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {dividend.yield} yield
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="ghost" className="w-full gap-2">
                            View Full History
                            <ArrowUpRight className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                            Upcoming Distribution
                        </CardTitle>
                        <CardDescription>
                            Next scheduled dividend payment
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-600">Amount Per Share</div>
                                    <div className="text-3xl font-bold text-emerald-600">
                                        $0.55
                                    </div>
                                </div>
                                <Badge className="bg-amber-500/10 text-amber-700 border-amber-200">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Scheduled
                                </Badge>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-600">Record Date</div>
                                    <div className="font-medium text-gray-900">Mar 10, 2024</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-600">Payment Date</div>
                                    <div className="font-medium text-gray-900">Mar 15, 2024</div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-600">Total Distribution</div>
                                <div className="font-bold text-2xl text-gray-900">
                                    $550,000
                                </div>
                                <div className="text-sm text-gray-500">
                                    Based on 1,000,000 outstanding shares
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
                            <FileText className="h-4 w-4" />
                            Generate Payout Report
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Distribution History Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Distribution History</CardTitle>
                            <CardDescription>
                                Complete record of all dividend payments
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {dividendHistory.length} Distributions
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-gray-200">
                                    <TableHead className="font-semibold text-gray-700 py-4">Date Declared</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Payment Date</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Amount/Share</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Total Amount</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Yield</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Status</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dividendHistory.map((dividend) => (
                                    <TableRow
                                        key={dividend.id}
                                        className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0"
                                    >
                                        <TableCell className="py-4">
                                            <div className="font-medium text-gray-900">
                                                {dividend.declaredDate}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="font-medium text-gray-900">
                                                {dividend.paymentDate}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="font-bold text-emerald-600">
                                                ${dividend.amountPerShare.toFixed(2)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="font-bold text-gray-900">
                                                ${dividend.totalAmount.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                    {dividend.yield}
                                                </Badge>
                                                {parseFloat(dividend.yield) > parseFloat(dividendHistory[1]?.yield || "0") && (
                                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge className={`
                                                ${dividend.status === 'paid'
                                                    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
                                                    : 'bg-amber-500/10 text-amber-700 border-amber-200'
                                                } font-medium
                                            `}>
                                                {dividend.status === 'paid' ? (
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <Clock className="h-3 w-3 mr-1" />
                                                )}
                                                {dividend.status.charAt(0).toUpperCase() + dividend.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-600 hover:text-gray-900"
                                                    onClick={handleExportData}
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
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
                            Showing <span className="font-semibold">{dividendHistory.length}</span> distributions
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
                        <h3 className="font-semibold text-gray-900">Dividend Performance Summary</h3>
                        <p className="text-sm text-gray-600">
                            Average quarterly dividend growth of 5.7% over the last 4 quarters.
                            Total distributions to shareholders: ${dividendHistory.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}
                        </p>
                    </div>
                    <Badge variant="outline" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        +5.7% Growth
                    </Badge>
                </div>
            </Card>
        </div>
    );
}