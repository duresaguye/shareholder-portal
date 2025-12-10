"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Check, X, UserPlus, Loader, AlertCircle, Clock, Users } from "lucide-react";
import { useState } from "react";

export function TransferRequests() {
    const [isOpen, setIsOpen] = useState(false);

    const transfers = [
        {
            id: 1,
            direction: "outgoing",
            from: "You",
            to: "Jane Smith",
            shares: 100,
            status: "pending_vote",
            progress: 40,
            votes: "2/5",
            date: "2024-12-10",
            priority: "medium"
        },
        {
            id: 2,
            direction: "incoming",
            from: "Robert Johnson",
            to: "You",
            shares: 500,
            status: "voting_open",
            progress: 20,
            votes: "1/5",
            date: "2024-12-09",
            priority: "high"
        },
        {
            id: 3,
            direction: "outgoing",
            from: "You",
            to: "Alex Chen",
            shares: 50,
            status: "approved",
            progress: 100,
            votes: "5/5",
            date: "2024-12-05",
            priority: "low"
        }
    ];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending_vote':
                return { label: 'Pending Vote', color: 'bg-amber-500/10 text-amber-700 border-amber-200' };
            case 'voting_open':
                return { label: 'Voting Open', color: 'bg-blue-500/10 text-blue-700 border-blue-200' };
            case 'approved':
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
                            Manage incoming and outgoing share transfers with voting progress
                        </CardDescription>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                <UserPlus className="h-4 w-4" />
                                Request Transfer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Request Share Transfer</DialogTitle>
                                <DialogDescription>
                                    Initiate a transfer of shares to another shareholder. This request will require board approval.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-5 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="receiver" className="font-medium text-gray-700">
                                        Receiver Email
                                    </Label>
                                    <Input
                                        id="receiver"
                                        placeholder="shareholder@example.com"
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="font-medium text-gray-700">
                                        Number of Shares
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="0"
                                            className="h-11"
                                        />
                                        <div className="text-sm text-gray-500 px-3 py-2 bg-gray-50 rounded-lg border">
                                            Your balance: 6,250
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 space-y-2">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-blue-900">Approval Required</p>
                                            <p className="text-sm text-blue-700">
                                                This transfer requires approval from 5 board members. Average processing time: 3-5 days.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => setIsOpen(false)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                >
                                    Submit Request
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
                                Active Transfers ({transfers.filter(t => t.status !== 'approved').length})
                            </h3>
                            <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                <Clock className="h-3 w-3 mr-1" />
                                Real-time Updates
                            </Badge>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-gray-700">Transfer Details</TableHead>
                                <TableHead className="font-semibold text-gray-700">Shares</TableHead>
                                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                <TableHead className="font-semibold text-gray-700">Progress</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transfers.map((transfer) => {
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
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold text-lg text-gray-900">
                                                {transfer.shares.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`${statusConfig.color} font-medium`}
                                            >
                                                {transfer.status === 'voting_open' && <Loader className="h-3 w-3 mr-1 animate-spin" />}
                                                {statusConfig.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="w-[180px]">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium text-gray-600">Board Votes</span>
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
                                            {transfer.status === 'voting_open' && transfer.direction === 'incoming' ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="h-9 w-9 p-0 bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                                                        title="Approve Transfer"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-9 w-9 p-0 border-gray-300 hover:bg-gray-50 rounded-lg"
                                                        title="Reject Transfer"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                >
                                                    View Details
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

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
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                View All Transfers →
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}