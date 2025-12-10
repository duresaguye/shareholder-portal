"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
    Search,
    Filter,
    MoreVertical,
    User,
    Building2,
    TrendingUp,
    Eye,
    Mail,
    Phone,
    Calendar,
    BadgePercent,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const initialShareholders = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        shares: 6250,
        ownership: 0.5,
        status: "active",
        type: "individual",
        phone: "+1 (555) 123-4567",
        joinDate: "2022-03-15",
        votingPower: 0.5,
        shareValue: 125.50,
        totalValue: 6250 * 125.50,
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        shares: 15000,
        ownership: 1.2,
        status: "active",
        type: "individual",
        phone: "+1 (555) 987-6543",
        joinDate: "2021-08-22",
        votingPower: 1.2,
        shareValue: 125.50,
        totalValue: 15000 * 125.50,
    },
    {
        id: "3",
        name: "Acme Corporation",
        email: "contact@acme.com",
        shares: 250000,
        ownership: 20.0,
        status: "active",
        type: "institution",
        phone: "+1 (555) 456-7890",
        joinDate: "2020-01-10",
        votingPower: 20.0,
        shareValue: 125.50,
        totalValue: 250000 * 125.50,
    },
    {
        id: "4",
        name: "Robert Johnson",
        email: "robert@example.com",
        shares: 3500,
        ownership: 0.28,
        status: "inactive",
        type: "individual",
        phone: "+1 (555) 234-5678",
        joinDate: "2023-02-28",
        votingPower: 0.28,
        shareValue: 125.50,
        totalValue: 3500 * 125.50,
    },
    {
        id: "5",
        name: "Tech Ventures LLC",
        email: "info@techventures.com",
        shares: 75000,
        ownership: 6.0,
        status: "active",
        type: "institution",
        phone: "+1 (555) 876-5432",
        joinDate: "2021-11-05",
        votingPower: 6.0,
        shareValue: 125.50,
        totalValue: 75000 * 125.50,
    },
];

export default function ShareholdersPage() {
    const [shareholders, setShareholders] = useState(initialShareholders);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [requireApproval, setRequireApproval] = useState(false);
    const [newShareholder, setNewShareholder] = useState({
        firstName: "",
        lastName: "",
        email: "",
        shares: "",
        type: "individual",
        phone: ""
    });

    const totalShares = 1250000;
    const activeShareholders = shareholders.filter(s => s.status === "active").length;

    const handleSaveShareholder = () => {
        if (requireApproval) {
            // Simulate creating a proposal
            alert(`Proposal created: "Approve new shareholder ${newShareholder.firstName} ${newShareholder.lastName}"\n\nThis request will be sent to the board for voting.`);
        } else {
            // Add shareholder directly
            const newId = (shareholders.length + 1).toString();
            const shares = parseInt(newShareholder.shares) || 0;
            const ownership = (shares / totalShares) * 100;

            const newEntry = {
                id: newId,
                name: `${newShareholder.firstName} ${newShareholder.lastName}`,
                email: newShareholder.email,
                shares: shares,
                ownership: parseFloat(ownership.toFixed(2)),
                status: "active",
                type: newShareholder.type,
                phone: newShareholder.phone,
                joinDate: new Date().toISOString().split('T')[0],
                votingPower: parseFloat(ownership.toFixed(2)),
                shareValue: 125.50,
                totalValue: shares * 125.50,
            };

            setShareholders([...shareholders, newEntry]);
            alert("Shareholder added successfully!");
        }

        // Reset and close
        setNewShareholder({
            firstName: "",
            lastName: "",
            email: "",
            shares: "",
            type: "individual",
            phone: ""
        });
        setRequireApproval(false);
        setIsAddDialogOpen(false);
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Shareholders
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Manage and view all company shareholders and their holdings
                    </p>
                </div>
                <div className="flex items-center gap-3">


                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                <Plus className="h-4 w-4" />
                                Add Shareholder
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New Shareholder</DialogTitle>
                                <DialogDescription>
                                    Enter the details of the new shareholder.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            value={newShareholder.firstName}
                                            onChange={(e) => setNewShareholder({ ...newShareholder, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            value={newShareholder.lastName}
                                            onChange={(e) => setNewShareholder({ ...newShareholder, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={newShareholder.email}
                                        onChange={(e) => setNewShareholder({ ...newShareholder, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="shares">Number of Shares</Label>
                                        <Input
                                            id="shares"
                                            type="number"
                                            placeholder="0"
                                            value={newShareholder.shares}
                                            onChange={(e) => setNewShareholder({ ...newShareholder, shares: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Shareholder Type</Label>
                                        <Select
                                            value={newShareholder.type}
                                            onValueChange={(value) => setNewShareholder({ ...newShareholder, type: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="individual">Individual</SelectItem>
                                                <SelectItem value="institution">Institution</SelectItem>
                                                <SelectItem value="employee">Employee</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+1 (555) 000-0000"
                                        value={newShareholder.phone}
                                        onChange={(e) => setNewShareholder({ ...newShareholder, phone: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                        id="approval-mode"
                                        checked={requireApproval}
                                        onCheckedChange={setRequireApproval}
                                    />
                                    <Label htmlFor="approval-mode" className="font-medium cursor-pointer">Require Board Approval</Label>
                                </div>

                                {requireApproval && (
                                    <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 flex gap-2 items-start">
                                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                        <p>
                                            A voting proposal will be created for this action. The shareholder will only be added after the proposal passes.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button
                                    onClick={handleSaveShareholder}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                >
                                    {requireApproval ? "Create Proposal" : "Save Shareholder"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-700">Total Shareholders</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{shareholders.length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                            <User className="h-6 w-6" />
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-700">Active Shareholders</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{activeShareholders}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-700">Total Shares</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {totalShares.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                            <BadgePercent className="h-6 w-6" />
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-amber-700">Avg. Holdings</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {Math.round(shareholders.reduce((acc, s) => acc + s.shares, 0) / shareholders.length).toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                            <Building2 className="h-6 w-6" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by name, email, or shares..."
                        className="pl-10 h-11 rounded-lg border-gray-300 focus:border-blue-500"
                    />
                </div>

            </div>

            {/* Table Section */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-gray-200">
                            <TableHead className="font-semibold text-gray-700 py-4">Shareholder</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4">Contact</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4">Holdings</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4">Voting Power</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4">Status</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shareholders.map((shareholder) => (
                            <TableRow
                                key={shareholder.id}
                                className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0"
                            >
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                            <AvatarImage src={`/avatars/${shareholder.id}.png`} alt={shareholder.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                                {shareholder.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900">{shareholder.name}</p>
                                                <Badge variant="outline" className={`${shareholder.type === 'institution' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'} h-5`}>
                                                    {shareholder.type === 'institution' ? <Building2 className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                                                    {shareholder.type.charAt(0).toUpperCase() + shareholder.type.slice(1)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar className="h-3 w-3" />
                                                Joined {shareholder.joinDate}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                                            <span className="text-gray-700">{shareholder.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                                            <span className="text-gray-700">{shareholder.phone}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="space-y-2">
                                        <div className="font-bold text-gray-900 text-lg">
                                            {shareholder.shares.toLocaleString()} shares
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            ${(shareholder.totalValue / 1000).toFixed(1)}K value
                                        </div>
                                        <Progress
                                            value={shareholder.ownership}
                                            max={20}
                                            className="h-1.5 bg-gray-200"
                                            indicatorClassName="bg-gradient-to-r from-blue-500 to-blue-600"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2.5 py-0.5">
                                                {shareholder.votingPower}%
                                            </Badge>
                                            <span className="text-sm text-gray-600">of total votes</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Based on {shareholder.ownership}% ownership
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge className={`
                                        ${shareholder.status === 'active'
                                            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
                                            : 'bg-gray-500/10 text-gray-700 border-gray-200'
                                        } font-medium
                                    `}>
                                        {shareholder.status.charAt(0).toUpperCase() + shareholder.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/shareholders/${shareholder.id}`}>
                                            <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Button>
                                        </Link>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                                                <DropdownMenuItem>View Activity</DropdownMenuItem>
                                                <DropdownMenuItem>Send Message</DropdownMenuItem>
                                                <DropdownMenuItem className="text-rose-600">Deactivate</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Table Footer */}
                <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div>
                            Showing <span className="font-semibold">{shareholders.length}</span> shareholders
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
                </div>
            </div>

        </div>
    );
}