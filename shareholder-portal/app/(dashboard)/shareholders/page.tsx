"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Plus,
    Search,
    MoreVertical,
    User,
    Building2,
    TrendingUp,
    Eye,
    Mail,
    Phone,
    Calendar,
    BadgePercent,
    AlertCircle,
    Loader2,
    RefreshCw,
    Edit,
    Save,
    FileCheck
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

// TanStack Query hooks
import { useShareholders, useCurrentUser } from "@/lib/hooks/useShareholders";
import { useCreateNewShareholderProposal } from "@/lib/hooks/useProposals";
import { useShareClasses } from "@/lib/hooks/useShareClasses";
import { useCreateTestShareholders } from "@/lib/hooks/useTest";
import { useSystemSettings, useUpdateSystemSettings } from "@/lib/hooks/useSystemSettings";
import { Shareholder } from "@/lib/types/api";

export default function ShareholdersPage() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [requireApproval, setRequireApproval] = useState(true); // Default to voting process
    const [isEditAuthSharesOpen, setIsEditAuthSharesOpen] = useState(false);
    const [authorizedShares, setAuthorizedShares] = useState<string>("");

    const [searchTerm, setSearchTerm] = useState("");

    const [newShareholder, setNewShareholder] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        shares: "",
        type: "individual" as "individual" | "institution",
        role: "shareholder" as const,
        phone: "",
        address: "",
        ownership: "",
        acquisitionMode: "purchaseByDilution" as "purchaseByDilution" | "purchaseFromSingle",
        fromShareholderId: ""
    });

    // TanStack Query hooks
    const {
        data: shareholdersData,
        isLoading: shareholdersLoading,
        error: shareholdersError,
        refetch: refetchShareholders
    } = useShareholders();

    const { data: currentUserData } = useCurrentUser();
    const { data: settingsData, isLoading: settingsLoading } = useSystemSettings();
    const updateSettings = useUpdateSystemSettings();

    const { data: shareClassesData } = useShareClasses();

    const createProposalMutation = useCreateNewShareholderProposal();
    const createTestShareholdersMutation = useCreateTestShareholders();
    const queryClient = useQueryClient();

 
    const currentData = shareholdersData;
    const currentLoading = shareholdersLoading;
    const currentError = shareholdersError;
    const currentRefetch = refetchShareholders;

    // Update local state when settings data loads
    useEffect(() => {
        if (settingsData?.settings?.authorizedShares !== undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAuthorizedShares(settingsData.settings.authorizedShares.toString());
        }
    }, [settingsData?.settings?.authorizedShares]);


    useEffect(() => {
     
        const handleFocus = () => {
            queryClient.invalidateQueries({ queryKey: ['shareholders'] });
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [queryClient]);

    // Transform API data to display format
    const shareholders = React.useMemo(() => {
        if (!currentData) return [];

        const dataKey = 'shareholders';
        const apiData = currentData[dataKey] || [];

        return apiData
            .map((item: Shareholder) => ({
                id: item.id,
                name: `${item.firstName} ${item.lastName}`,
                email: item.email,
                shares: item.totalShares,
                ownership: item.ownership,
                status: item.status === 'approved' ? 'active' : 'inactive',
                type: item.type,
                phone: item.phone || 'N/A',
                joinDate: new Date(item.createdAt).toISOString().split('T')[0],
                votingPower: item.ownership,
                shareValue: 125.50,
                totalValue: item.totalShares * 125.50,
                role: item.role,
                username: item.username,
                lastLogin: item.lastLogin
            }))
            .filter((shareholder) => {
                if (!searchTerm) return true;
                const searchLower = searchTerm.toLowerCase();
                return (
                    shareholder.name.toLowerCase().includes(searchLower) ||
                    shareholder.email.toLowerCase().includes(searchLower) ||
                    shareholder.username.toLowerCase().includes(searchLower)
                );
            });
    }, [currentData, searchTerm]);

    const totalShares = React.useMemo(() => {
        return shareholders.reduce((sum, s) => sum + s.shares, 0);
    }, [shareholders]);

    const activeShareholders = React.useMemo(() => {
        return shareholders.filter(s => s.status === "active").length;
    }, [shareholders]);

    const handleCreateTestShareholders = async () => {
        try {
            await createTestShareholdersMutation.mutateAsync();
            alert('Test shareholders created successfully!');
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };

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

    const handleSaveShareholder = async () => {
        if (!requireApproval) {
            alert('Direct shareholder creation is disabled. Please use the voting process.');
            return;
        }

        try {
            // Validate required fields
            if (!newShareholder.firstName || !newShareholder.lastName || !newShareholder.email ||
                !newShareholder.username || !newShareholder.password) {
                alert('Please fill in all required fields.');
                return;
            }

            const proposalData = {
                title: `Add New Shareholder - ${newShareholder.firstName} ${newShareholder.lastName}`,
                description: `Proposal to add ${newShareholder.firstName} ${newShareholder.lastName} as a new shareholder with ${parseFloat(newShareholder.ownership || '0').toFixed(2)}% ownership through ${newShareholder.acquisitionMode === 'purchaseByDilution' ? 'dilution' : 'single shareholder purchase'}.`,
                acquisitionMode: newShareholder.acquisitionMode,
                fromShareholderId: newShareholder.acquisitionMode === 'purchaseFromSingle' ? newShareholder.fromShareholderId : undefined,
                newShareholder: {
                    username: newShareholder.username,
                    password: newShareholder.password,
                    firstName: newShareholder.firstName,
                    lastName: newShareholder.lastName,
                    email: newShareholder.email,
                    phone: newShareholder.phone || undefined,
                    address: newShareholder.address || undefined,
                    type: newShareholder.type,
                    role: newShareholder.role,
                    targetOwnership: parseFloat(newShareholder.ownership) || 0,
                    targetShares: parseInt(newShareholder.shares) || 0
                }
            };

            await createProposalMutation.mutateAsync(proposalData);

            alert('Proposal created successfully! Shareholders can now vote on this proposal.');

            // Reset form and close dialog
            setNewShareholder({
                firstName: "",
                lastName: "",
                email: "",
                username: "",
                password: "",
                shares: "",
                type: "individual",
                role: "shareholder",
                phone: "",
                address: "",
                ownership: "",
                acquisitionMode: "purchaseByDilution",
                fromShareholderId: ""
            });
            setIsAddDialogOpen(false);

        } catch (error: any) {
            alert(`Error creating proposal: ${error?.message || 'Unknown error'}`);
        }
    };

    if (currentError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading shareholders: {currentError.message}</p>
                    <Button onClick={() => currentRefetch()} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">
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
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Shareholder</DialogTitle>
                                <DialogDescription>
                                    Create a proposal to add a new shareholder. This will require voting approval.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name *</Label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            value={newShareholder.firstName}
                                            onChange={(e) => setNewShareholder({ ...newShareholder, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name *</Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            value={newShareholder.lastName}
                                            onChange={(e) => setNewShareholder({ ...newShareholder, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
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
                                        <Label htmlFor="username">Username *</Label>
                                        <Input
                                            id="username"
                                            placeholder="johndoe"
                                            value={newShareholder.username}
                                            onChange={(e) => setNewShareholder({ ...newShareholder, username: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={newShareholder.password}
                                            onChange={(e) => setNewShareholder({ ...newShareholder, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="shares">Number of Shares</Label>
                                        <Input
                                            id="shares"
                                            type="number"
                                            placeholder="10000"
                                            value={newShareholder.shares}
                                            onChange={(e) => setNewShareholder({ ...newShareholder, shares: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ownership">Ownership Percentage</Label>
                                        <Input
                                            id="ownership"
                                            type="number"
                                            step="0.01"
                                            placeholder="10.00"
                                            value={newShareholder.ownership}
                                            onChange={(e) => setNewShareholder({ ...newShareholder, ownership: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Shareholder Type</Label>
                                    <Select
                                        value={newShareholder.type}
                                        onValueChange={(value: "individual" | "institution") =>
                                            setNewShareholder({ ...newShareholder, type: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="individual">Individual</SelectItem>
                                            <SelectItem value="institution">Institution</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="acquisitionMode">Acquisition Mode</Label>
                                    <Select
                                        value={newShareholder.acquisitionMode}
                                        onValueChange={(value: "purchaseByDilution" | "purchaseFromSingle") =>
                                            setNewShareholder({ ...newShareholder, acquisitionMode: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select acquisition mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="purchaseByDilution">Purchase by Dilution</SelectItem>
                                            <SelectItem value="purchaseFromSingle">Purchase from Single Shareholder</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {newShareholder.acquisitionMode === 'purchaseFromSingle' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="fromShareholder">Source Shareholder</Label>
                                        <Select
                                            value={newShareholder.fromShareholderId}
                                            onValueChange={(value) =>
                                                setNewShareholder({ ...newShareholder, fromShareholderId: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select shareholder to purchase from" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {shareholders.map((shareholder) => (
                                                    <SelectItem key={shareholder.id} value={shareholder.id}>
                                                        {shareholder.name} ({shareholder.shares.toLocaleString()} shares)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            placeholder="+125199445678"
                                            value={newShareholder.phone}
                                            onChange={(e) => setNewShareholder({ ...newShareholder, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            placeholder="123 Main St, City, State"
                                            value={newShareholder.address}
                                            onChange={(e) => setNewShareholder({ ...newShareholder, address: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 flex gap-2 items-start">
                                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                    <p>
                                        A voting proposal will be created for this action. The shareholder will only be added after the proposal passes with 75% approval.
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveShareholder}
                                    disabled={createProposalMutation.isPending}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                >
                                    {createProposalMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating Proposal...
                                        </>
                                    ) : (
                                        "Create Proposal"
                                    )}
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
                            <p className="text-xl font-bold text-gray-900 mt-1">
                                {currentLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    shareholders.length
                                )}
                            </p>
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
                            <p className="text-xl font-bold text-gray-900 mt-1">
                                {currentLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    activeShareholders
                                )}
                            </p>
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
                            <p className="text-xl font-bold text-gray-900 mt-1">
                                {currentLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    totalShares.toLocaleString()
                                )}
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
                            <p className="text-xl font-bold text-gray-900 mt-1">
                                {currentLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    shareholders.length > 0
                                        ? Math.round(totalShares / shareholders.length).toLocaleString()
                                        : '0'
                                )}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                            <Building2 className="h-6 w-6" />
                        </div>
                    </div>
                </Card>

                <Card className="p-5 border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100/30">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-indigo-700">Total Authorized</p>
                            </div>
                            <p className="text-xl font-bold text-gray-900 mt-1">
                                {settingsLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    settingsData?.settings?.authorizedShares?.toLocaleString() || '0'
                                )}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                            <FileCheck className="h-6 w-6" />
                        </div>
                    </div>
                </Card>
            </div>

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

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by name, email, or username..."
                        className="pl-10 h-11 rounded-lg border-gray-300 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Button
                    variant="outline"
                    onClick={() => currentRefetch()}
                    disabled={currentLoading}
                    className="gap-2"
                >
                    {currentLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}
                    Refresh
                </Button>
            </div>

            {/* Table Section */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                {currentLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                            <p className="text-gray-600">Loading shareholders...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-gray-200">
                                    <TableHead className="font-semibold text-gray-700 py-4">
                                        Shareholder
                                    </TableHead>
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
                                                        <Badge variant="outline" className={`${shareholder.type === 'institution'
                                                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                                : 'bg-blue-50 text-blue-700 border-blue-200'
                                                            } h-5`}>
                                                            {shareholder.type === 'institution' ? (
                                                                <Building2 className="h-3 w-3 mr-1" />
                                                            ) : (
                                                                <User className="h-3 w-3 mr-1" />
                                                            )}
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
                                                <div className="font-bold text-gray-900 text-xl">
                                                    {shareholder.shares.toLocaleString()} shares
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    ${(shareholder.totalValue / 1000).toFixed(1)}K value
                                                </div>
                                                <Progress
                                                    value={Math.min(shareholder.ownership, 100)}
                                                    className="h-1.5 bg-gray-200"
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2.5 py-0.5">
                                                        {shareholder.votingPower.toFixed(2)}%
                                                    </Badge>
                                                    <span className="text-sm text-gray-600">of total votes</span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Based on {shareholder.ownership.toFixed(2)}% ownership
                                                </div>
                                            </div>
                                        </TableCell>



                                        <TableCell className="py-4">
                                            <Badge className={`${shareholder.status === 'active'
                                                    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
                                                    : 'bg-gray-500/10 text-gray-700 border-gray-200'
                                                } font-medium`}>
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
                                    {searchTerm && (
                                        <span className="ml-2 text-blue-600">
                                            (filtered by &quot;{searchTerm}&quot;)
                                        </span>
                                    )}
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
                    </>
                )}
            </div>
        </div>
    );
}