"use client";

import { useState } from "react";
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
    FolderOpen,
    Upload,
    Search,
    MoreVertical,
    FileText,
    FileSpreadsheet,
    FileBarChart,
    Shield,
    Users,
    Calendar,
    Clock,
    Download,
    Eye,
    Trash2,
    Edit,
    Filter,
    TrendingUp,
    HardDrive,
    FileArchive
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const documents = [
    {
        id: 1,
        name: "Articles of Incorporation",
        category: "Legal",
        size: "1.2 MB",
        lastModified: "2023-01-10",
        type: "pdf",
        downloads: 89,
        icon: Shield,
        color: "bg-blue-500",
        status: "final"
    },
    {
        id: 2,
        name: "Board Meeting Minutes - Q3",
        category: "Minutes",
        size: "450 KB",
        lastModified: "2023-10-20",
        type: "docx",
        downloads: 45,
        icon: Users,
        color: "bg-emerald-500",
        status: "final"
    },
    {
        id: 3,
        name: "Shareholder Agreement Template",
        category: "Templates",
        size: "150 KB",
        lastModified: "2022-11-05",
        type: "docx",
        downloads: 156,
        icon: FileText,
        color: "bg-purple-500",
        status: "template"
    },
    {
        id: 4,
        name: "Annual Report 2023",
        category: "Financial",
        size: "3.4 MB",
        lastModified: "2024-01-15",
        type: "pdf",
        downloads: 203,
        icon: FileBarChart,
        color: "bg-amber-500",
        status: "final"
    },
    {
        id: 5,
        name: "Cap Table Spreadsheet",
        category: "Equity",
        size: "2.1 MB",
        lastModified: "2024-03-01",
        type: "xlsx",
        downloads: 98,
        icon: FileSpreadsheet,
        color: "bg-purple-500",
        status: "working"
    },
    {
        id: 6,
        name: "Voting History Archive",
        category: "Voting",
        size: "5.7 MB",
        lastModified: "2024-02-28",
        type: "zip",
        downloads: 67,
        icon: FileArchive,
        color: "bg-blue-500",
        status: "archive"
    },
];

export default function DocumentsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    const totalDocuments = documents.length;
    const totalSize = documents.reduce((acc, doc) => {
        const size = parseFloat(doc.size);
        return acc + (doc.size.includes('MB') ? size : size / 1024);
    }, 0);
    const mostDownloaded = documents.sort((a, b) => b.downloads - a.downloads)[0];

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Document Repository</h1>
                    <p className="text-gray-600 mt-2">
                        Manage company, shareholder, and legal documents
                    </p>
                </div>
                <div className="flex items-center gap-3">

                    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                <Upload className="h-4 w-4" />
                                Upload Document
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Upload Document</DialogTitle>
                                <DialogDescription>
                                    Add a new document to the repository
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-sm text-gray-600 mb-2">
                                        Drag and drop files here or click to browse
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Max file size: 50MB • Supported: PDF, DOC, XLS, ZIP
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Document Category</label>
                                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                                        <option>Legal</option>
                                        <option>Financial</option>
                                        <option>Minutes</option>
                                        <option>Templates</option>
                                        <option>Equity</option>
                                        <option>Voting</option>
                                    </select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsUploadDialogOpen(false)}
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => setIsUploadDialogOpen(false)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                >
                                    Upload Document
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{totalDocuments}</div>
                                <div className="text-sm text-gray-600">Total Documents</div>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                <FolderOpen className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{totalSize.toFixed(1)} MB</div>
                                <div className="text-sm text-gray-600">Total Storage</div>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                                <HardDrive className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {mostDownloaded.downloads}
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
                                <div className="text-2xl font-bold text-gray-900">6</div>
                                <div className="text-sm text-gray-600">Categories</div>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                                <FileText className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by document name, category, or type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 rounded-lg border-gray-300 focus:border-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {filteredDocuments.length} documents
                    </Badge>
                </div>
            </div>

            {/* Documents Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Documents</CardTitle>
                            <CardDescription>Manage company and shareholder documents</CardDescription>
                        </div>
                        <Badge className="bg-blue-500 text-white">
                            {filteredDocuments.length} Documents
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-gray-200">
                                    <TableHead className="font-semibold text-gray-700 py-4">Document</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Category</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Size</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Downloads</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4">Last Modified</TableHead>
                                    <TableHead className="font-semibold text-gray-700 py-4 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDocuments.map((doc) => {
                                    const Icon = doc.icon;

                                    return (
                                        <TableRow
                                            key={doc.id}
                                            className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0"
                                        >
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2.5 rounded-lg ${doc.color} text-white`}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-semibold text-gray-900">
                                                            {doc.name}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className={`${doc.status === 'final' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                                doc.status === 'template' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                    doc.status === 'working' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                        'bg-gray-50 text-gray-700 border-gray-200'
                                                                } text-xs`}>
                                                                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                                            </Badge>
                                                            <span className="text-xs text-gray-500">.{doc.type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                                    {doc.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="font-medium text-gray-900">{doc.size}</div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <Download className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-gray-900">{doc.downloads}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    {doc.lastModified}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuItem>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Preview
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Download
                                                            </DropdownMenuItem>
                                                            <Separator />
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Table Footer */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <div>
                            Showing <span className="font-semibold">{filteredDocuments.length}</span> of {totalDocuments} documents
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

            {/* Quick Upload */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-blue-600" />
                        Quick Document Upload
                    </CardTitle>
                    <CardDescription>
                        Drag and drop or click to upload new documents
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer hover:bg-blue-50/50">
                        <div className="max-w-md mx-auto">
                            <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-900 mb-2">Drop files here or click to upload</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Upload documents, reports, and files to share with shareholders
                            </p>
                            <Button
                                variant="outline"
                                className="gap-2 border-gray-300 hover:bg-gray-50"
                                onClick={() => setIsUploadDialogOpen(true)}
                            >
                                <Upload className="h-4 w-4" />
                                Browse Files
                            </Button>
                            <p className="text-xs text-gray-500 mt-4">
                                Supports: PDF, DOC, XLS, PPT, ZIP up to 50MB each
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100/30 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">Document Repository Summary</h3>
                        <p className="text-sm text-gray-600">
                            {totalDocuments} documents • {totalSize.toFixed(1)}MB total storage •
                            Most downloaded: {mostDownloaded.name}
                        </p>
                    </div>
                    <Badge variant="outline" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Updated Today
                    </Badge>
                </div>
            </Card>
        </div>
    );
}