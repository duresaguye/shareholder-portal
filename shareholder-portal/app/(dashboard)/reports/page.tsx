"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    FileText,
    Download,
    Filter,
    Plus,
    BarChart3,
    TrendingUp,
    PieChart,
    DollarSign,
    Calendar,
    FileBarChart,
    FileSpreadsheet,
    Shield,
    Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Report } from "@/lib/types/api";

const iconMap: Record<string, any> = {
    FileBarChart,
    TrendingUp,
    Users,
    Shield,
    PieChart,
    DollarSign,
    FileSpreadsheet,
};

// Temporary in-memory reports dataset. Replace with DB-backed data when available.
const reports: Report[] = [
    {
        id: "1",
        title: "Annual Financial Report 2023",
        date: "2024-01-10",
        type: "Financial",
        size: "2.4 MB",
        icon: "FileBarChart",
        color: "bg-blue-500",
        downloads: 245,
        category: "Annual",
    },
    {
        id: "2",
        title: "Q4 2023 Performance Summary",
        date: "2024-01-05",
        type: "Performance",
        size: "1.1 MB",
        icon: "TrendingUp",
        color: "bg-emerald-500",
        downloads: 189,
        category: "Quarterly",
    },
    {
        id: "3",
        title: "Shareholder Equity Statement",
        date: "2023-12-31",
        type: "Equity",
        size: "850 KB",
        icon: "Users",
        color: "bg-purple-500",
        downloads: 156,
        category: "Monthly",
    },
    {
        id: "4",
        title: "Audit Report 2023",
        date: "2023-12-15",
        type: "Audit",
        size: "3.2 MB",
        icon: "Shield",
        color: "bg-amber-500",
        downloads: 98,
        category: "Annual",
    },
    {
        id: "5",
        title: "Cap Table Update Q1 2024",
        date: "2024-03-31",
        type: "Equity",
        size: "1.8 MB",
        icon: "PieChart",
        color: "bg-purple-500",
        downloads: 203,
        category: "Quarterly",
    },
    {
        id: "6",
        title: "Dividend Distribution Report",
        date: "2023-12-20",
        type: "Financial",
        size: "950 KB",
        icon: "DollarSign",
        color: "bg-emerald-500",
        downloads: 167,
        category: "Monthly",
    },
];

export default function ReportsPage() {
    const totalDownloads = reports.reduce((acc, report) => acc + report.downloads, 0);
    const mostDownloaded = [...reports].sort((a, b) => b.downloads - a.downloads)[0];

    return (
        <div className="space-y-8">
            <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm">
                Coming soon: reports will be loaded from the backend. Current items are placeholder.
            </div>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports & Documents</h1>
                    <p className="text-gray-600 mt-2">
                        Access and download all company reports and official documents
                    </p>
                </div>
                <div className="flex items-center gap-3">

                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        <Plus className="h-4 w-4" />
                        Generate Report
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
                                <div className="text-sm text-gray-600">Total Reports</div>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                <FileText className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{totalDownloads}</div>
                                <div className="text-sm text-gray-600">Total Downloads</div>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                                <Download className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {mostDownloaded?.downloads || 0}
                                </div>
                                <div className="text-sm text-gray-600">Most Downloaded</div>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">4</div>
                                <div className="text-sm text-gray-600">Categories</div>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                                <FileSpreadsheet className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Report Categories */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Report Categories</h2>
                    <Badge className="bg-blue-500 text-white">
                        {reports.length} Reports
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report: Report) => {
                        const Icon = iconMap[report.icon] || FileText;

                        return (
                            <Card key={report.id} className="group border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-lg ${report.color} text-white`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                                    {report.category}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {report.title}
                                            </CardTitle>
                                            <div className="flex items-center gap-3">
                                                <CardDescription className="text-gray-600">
                                                    {report.type} Report
                                                </CardDescription>
                                                <span className="text-xs text-gray-500">
                                                    {report.size}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <Separator />

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>Published {report.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Download className="h-4 w-4 text-blue-600" />
                                            <span className="font-medium text-gray-900">{report.downloads} downloads</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0">
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2 border-gray-300 hover:bg-gray-50 group-hover:border-blue-300 transition-colors"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download Report
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Report Generation Options */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        Quick Report Generation
                    </CardTitle>
                    <CardDescription>
                        Generate custom reports based on your requirements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-auto py-6 flex-col gap-3 border-gray-200 hover:bg-gray-50">
                            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                <FileBarChart className="h-6 w-6" />
                            </div>
                            <span className="font-medium">Financial Report</span>
                            <span className="text-sm text-gray-500">Quarterly performance</span>
                        </Button>

                        <Button variant="outline" className="h-auto py-6 flex-col gap-3 border-gray-200 hover:bg-gray-50">
                            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                                <Users className="h-6 w-6" />
                            </div>
                            <span className="font-medium">Shareholder Report</span>
                            <span className="text-sm text-gray-500">Ownership summary</span>
                        </Button>

                        <Button variant="outline" className="h-auto py-6 flex-col gap-3 border-gray-200 hover:bg-gray-50">
                            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                                <PieChart className="h-6 w-6" />
                            </div>
                            <span className="font-medium">Cap Table</span>
                            <span className="text-sm text-gray-500">Current ownership</span>
                        </Button>

                        <Button variant="outline" className="h-auto py-6 flex-col gap-3 border-gray-200 hover:bg-gray-50">
                            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <span className="font-medium">Dividend Report</span>
                            <span className="text-sm text-gray-500">Distribution history</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100/30 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">Report Library Summary</h3>
                        <p className="text-sm text-gray-600">
                            {reports.length} reports available • {totalDownloads} total downloads •
                            Most popular: {mostDownloaded?.title || "N/A"}
                        </p>
                    </div>
                    <Badge variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Updated Daily
                    </Badge>
                </div>
            </Card>
        </div>
    );
}