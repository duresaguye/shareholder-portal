"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Check, X, Loader, AlertCircle, Clock, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProposals, useCreateShareTransferProposal } from "@/lib/hooks/useProposals";
import { useShareholders, useCurrentUser } from "@/lib/hooks/useShareholders";
import { useShareClasses } from "@/lib/hooks/useShareClasses";
import { useState } from "react";

export function TransferRequests() {
    const { data: proposalsData, isLoading, error } = useProposals();
    const { data: shareholdersData } = useShareholders();
    const { data: shareClassesData } = useShareClasses();
    const { data: currentUserData } = useCurrentUser();
    const createTransfer = useCreateShareTransferProposal();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [form, setForm] = useState({
        toShareholderId: "",
        shareClassId: "",
        amount: "",
        price: "",
        title: "",
        description: ""
    });
    const currentId = currentUserData?.shareholder?.id;

    const proposals = proposalsData?.proposals || [];
    const transfers = proposals
        .filter(p => p.type === "TRANSFER_APPROVAL")
        .flatMap(p =>
            (p.transferRequests || []).map(tr => {
                const fromSh = shareholdersData?.shareholders?.find(s => s.id === tr.fromShareholderId);
                const toSh = shareholdersData?.shareholders?.find(s => s.id === tr.toShareholderId);
                const direction = currentId && tr.toShareholderId === currentId ? "incoming" : "outgoing";
                const shareClass = shareClassesData?.shareClasses?.find(sc => sc.id === tr.shareClassId);
                return {
                    id: tr.id,
                    fromId: tr.fromShareholderId,
                    toId: tr.toShareholderId,
                    proposalTitle: p.title,
                    direction,
                    from: fromSh ? `${fromSh.firstName} ${fromSh.lastName}` : tr.fromShareholderId,
                    to: toSh ? `${toSh.firstName} ${toSh.lastName}` : tr.toShareholderId,
                    shareClassName: shareClass?.name || tr.shareClassId,
                    shares: tr.amount,
                    status: tr.status,
                    price: tr.price,
                    progress: tr.status === "completed" || tr.status === "approved" ? 100 : tr.status === "voting" ? 60 : 20,
                    votes: p.votes?.length ? `${p.votes.length} votes` : "0 votes",
                    date: new Date(tr.issueDate).toLocaleDateString(),
                    priority: tr.status === "voting" ? "high" : tr.status === "approved" ? "low" : "medium"
                };
            })
        );

    const filteredTransfers = transfers.filter(tr =>
        !currentId || tr.fromId === currentId || tr.toId === currentId
    );
    const activeTransfers = filteredTransfers.filter(
        (t) => t.status !== "approved" && t.status !== "completed" && t.status !== "rejected"
    );
    const completedTransfers = filteredTransfers.filter(
        (t) => t.status === "approved" || t.status === "completed" || t.status === "rejected"
    );

    const handleSubmit = async () => {
        if (!form.toShareholderId || !form.shareClassId || !form.amount || !form.price || !form.title || !form.description) return;
        await createTransfer.mutateAsync({
            title: form.title,
            description: form.description,
            toShareholderId: form.toShareholderId,
            shareClassId: form.shareClassId,
            amount: parseInt(form.amount, 10),
            price: parseFloat(form.price)
        });
        setForm({ toShareholderId: "", shareClassId: "", amount: "", price: "", title: "", description: "" });
        setIsDialogOpen(false);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
            case 'pending_vote':
                return { label: 'Pending Vote', color: 'bg-amber-500/10 text-amber-700 border-amber-200' };
            case 'voting':
            case 'voting_open':
                return { label: 'Voting Open', color: 'bg-blue-500/10 text-blue-700 border-blue-200' };
            case 'approved':
            case 'completed':
                return { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' };
            case 'rejected':
                return { label: 'Rejected', color: 'bg-rose-500/10 text-rose-700 border-rose-200' };
            default:
                return { label: 'Processing', color: 'bg-gray-500/10 text-gray-700 border-gray-200' };
        }
    };

    return (
        <Card className="col-span-4 lg:col-span-3 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Share Transfer Requests</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Live transfer requests tied to transfer-approval proposals
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                Request Transfer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Request Share Transfer</DialogTitle>
                                <DialogDescription>
                                    Submit a transfer request. This will create a transfer-approval proposal for voting.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="Transfer shares to..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Reason and context"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Recipient Shareholder</Label>
                                    <select
                                        className="h-10 w-full rounded border border-gray-200 px-3 text-sm"
                                        value={form.toShareholderId}
                                        onChange={(e) => setForm({ ...form, toShareholderId: e.target.value })}
                                    >
                                        <option value="">Select shareholder</option>
                                        {(shareholdersData?.shareholders || []).map((sh) => (
                                            <option key={sh.id} value={sh.id}>
                                                {sh.firstName} {sh.lastName} ({sh.username})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Share Class</Label>
                                    <select
                                        className="h-10 w-full rounded border border-gray-200 px-3 text-sm"
                                        value={form.shareClassId}
                                        onChange={(e) => setForm({ ...form, shareClassId: e.target.value })}
                                    >
                                        <option value="">Select share class</option>
                                        {(shareClassesData?.shareClasses || []).map((sc) => (
                                            <option key={sc.id} value={sc.id}>
                                                {sc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>Amount (shares)</Label>
                                        <Input
                                            type="number"
                                            value={form.amount}
                                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Price per Share</Label>
                                        <Input
                                            type="number"
                                            value={form.price}
                                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="border-gray-300 hover:bg-gray-50"
                                    disabled={createTransfer.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                    disabled={createTransfer.isPending}
                                >
                                    {createTransfer.isPending ? "Submitting..." : "Submit Request"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                        <div className="p-4 border-b bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    Active Transfers ({activeTransfers.length})
                                </h3>
                                <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Live from proposals
                                </Badge>
                            </div>
                        </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader className="h-6 w-6 animate-spin text-blue-600" />
                        </div>
                    ) : error ? (
                        <div className="p-6 flex items-center gap-2 text-rose-600">
                            <AlertCircle className="h-5 w-5" />
                            <span>Failed to load transfer requests.</span>
                        </div>
                    ) : filteredTransfers.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No transfer-approval proposals yet. Live requests will appear here.
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold text-gray-700">Transfer Details</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Shares</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Price</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Share Class</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Progress</TableHead>
                                        <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activeTransfers.map((transfer) => {
                                        const statusConfig = getStatusConfig(transfer.status);

                                        return (
                                            <TableRow key={transfer.id} className="group hover:bg-gray-50/80 transition-colors">
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${transfer.priority === 'high' ? 'bg-rose-500' : transfer.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                                            <span className="text-sm font-medium text-gray-500">
                                                                {transfer.date}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`font-semibold ${transfer.direction === 'outgoing' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                                {transfer.from}
                                                            </span>
                                                            <ArrowRight className="h-4 w-4 text-gray-400" />
                                                            <span className={`font-semibold ${transfer.direction === 'incoming' ? 'text-emerald-600' : 'text-gray-900'}`}>
                                                                {transfer.to}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">Proposal: {transfer.proposalTitle}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-bold text-lg text-gray-900">
                                                        {transfer.shares.toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-gray-800">${transfer.price}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-800">{transfer.shareClassName}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`${statusConfig.color} font-medium`}
                                                    >
                                                        {transfer.status === 'voting' && <Loader className="h-3 w-3 mr-1 animate-spin" />}
                                                        {statusConfig.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="w-[180px]">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="font-medium text-gray-600">Votes</span>
                                                            <span className="font-bold text-gray-900">{transfer.votes}</span>
                                                        </div>
                                                        <Progress
                                                            value={transfer.progress}
                                                            className={`h-2 ${transfer.progress === 100 ? 'bg-emerald-100' : 'bg-blue-100'}`}
                                                            indicatorClassName={transfer.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                    >
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}

                                    {activeTransfers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-6 text-center text-gray-500">
                                                No active transfers right now. Completed items are listed below.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {completedTransfers.length > 0 && (
                                <div className="mt-6 rounded-xl border border-gray-200 bg-white">
                                    <div className="p-4 border-b bg-gray-50/60 flex items-center justify-between">
                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Check className="h-4 w-4 text-emerald-600" />
                                            Completed / Approved
                                        </h4>
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                            {completedTransfers.length}
                                        </Badge>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead className="font-semibold text-gray-700">Transfer</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Shares</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Price</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {completedTransfers.map((transfer) => {
                                                const statusConfig = getStatusConfig(transfer.status);
                                                return (
                                                    <TableRow key={transfer.id} className="group hover:bg-gray-50/70 transition-colors">
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-gray-900">
                                                                    {transfer.from} → {transfer.to}
                                                                </span>
                                                                <span className="text-xs text-gray-500">Proposal: {transfer.proposalTitle}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-semibold text-gray-900">
                                                            {transfer.shares.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-gray-800">
                                                            ${transfer.price}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={`${statusConfig.color} font-medium`}>
                                                                {statusConfig.label}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            <div className="p-4 border-t bg-gray-50/30">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                                            <span className="text-gray-600">High Priority</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                                            <span className="text-gray-600">Medium Priority</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-gray-600">Completed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}