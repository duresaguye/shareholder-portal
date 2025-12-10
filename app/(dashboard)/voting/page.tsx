"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Plus,
    MoreVertical,
    Calendar,
    Users,
    TrendingUp,
    Check,
    X,
    Clock,
    BarChart3,
    Vote,
    Eye,
    Trash2,
    Edit
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialProposals = [
    {
        id: "1",
        title: "2024 Board Election",
        description: "Elect 3 new directors to the board for the upcoming fiscal year.",
        status: "active",
        votesFor: 45,
        votesAgainst: 15,
        requiredVotes: 60,
        deadline: "Dec 31, 2024",
        participation: 65,
        voters: 245,
        totalVoters: 385,
        created: "Nov 1, 2024"
    },
    {
        id: "2",
        title: "Q4 Dividend Distribution",
        description: "Approve the proposed dividend of $1.50 per share for Q4 2024.",
        status: "active",
        votesFor: 38,
        votesAgainst: 8,
        requiredVotes: 50,
        deadline: "Jan 15, 2025",
        participation: 42,
        voters: 158,
        totalVoters: 385,
        created: "Nov 15, 2024"
    },
    {
        id: "3",
        title: "Executive Compensation Plan",
        description: "Approve new executive compensation packages for 2025.",
        status: "upcoming",
        votesFor: 0,
        votesAgainst: 0,
        requiredVotes: 55,
        deadline: "Feb 28, 2025",
        participation: 0,
        voters: 0,
        totalVoters: 385,
        created: "Nov 20, 2024"
    }
];

export default function AdminVotingPage() {
    const router = useRouter();
    const [proposals, setProposals] = useState(initialProposals);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newProposal, setNewProposal] = useState({
        title: "",
        description: "",
        deadline: "",
        requiredVotes: 50
    });

    const handleCreateProposal = () => {
        const newProposalObj = {
            id: (proposals.length + 1).toString(),
            ...newProposal,
            status: "upcoming",
            votesFor: 0,
            votesAgainst: 0,
            participation: 0,
            voters: 0,
            totalVoters: 385,
            created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        setProposals([newProposalObj, ...proposals]);
        setNewProposal({
            title: "",
            description: "",
            deadline: "",
            requiredVotes: 50
        });
        setIsCreateDialogOpen(false);
    };

    const handleDeleteProposal = (id: string) => {
        setProposals(proposals.filter(p => p.id !== id));
    };

    const handleViewDetails = (id: string) => {
        // Navigate to the admin vote details page
        router.push(`/voting/${id}`);
    };

    const activeProposals = proposals.filter(p => p.status === "active");
    const upcomingProposals = proposals.filter(p => p.status === "upcoming");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Voting Management</h1>
                    <p className="text-gray-600 mt-1">Track votes and create new proposals</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                            <Plus className="h-4 w-4" />
                            New Proposal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Create New Proposal</DialogTitle>
                            <DialogDescription>
                                Add a new proposal for shareholder voting
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="font-medium text-gray-700">
                                    Proposal Title
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., 2025 Board Election"
                                    value={newProposal.title}
                                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="font-medium text-gray-700">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Provide detailed information about the proposal..."
                                    value={newProposal.description}
                                    onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="deadline" className="font-medium text-gray-700">
                                        Deadline
                                    </Label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        value={newProposal.deadline}
                                        onChange={(e) => setNewProposal({ ...newProposal, deadline: e.target.value })}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="requiredVotes" className="font-medium text-gray-700">
                                        Required Votes %
                                    </Label>
                                    <Input
                                        id="requiredVotes"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={newProposal.requiredVotes}
                                        onChange={(e) => setNewProposal({ ...newProposal, requiredVotes: parseInt(e.target.value) || 0 })}
                                        className="h-11"
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                                className="border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateProposal}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                            >
                                Create Proposal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{activeProposals.length}</div>
                                <div className="text-sm text-gray-600">Active Votes</div>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                <Vote className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {Math.round(proposals.reduce((acc, p) => acc + p.participation, 0) / proposals.length)}%
                                </div>
                                <div className="text-sm text-gray-600">Avg Participation</div>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{upcomingProposals.length}</div>
                                <div className="text-sm text-gray-600">Upcoming</div>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active Proposals */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Active Votes</h2>
                    <Badge className="bg-blue-500 text-white">
                        {activeProposals.length} Active
                    </Badge>
                </div>

                {activeProposals.map((proposal) => (
                    <Card key={proposal.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => handleViewDetails(proposal.id)}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">
                                            Active
                                        </Badge>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock className="h-4 w-4" />
                                            Ends {proposal.deadline}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {proposal.title}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        {proposal.description}
                                    </CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            // Edit functionality
                                        }}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewDetails(proposal.id);
                                        }}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProposal(proposal.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Voting Progress */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <span className="text-sm font-medium text-gray-700">For</span>
                                            <span className="font-bold text-emerald-700">{proposal.votesFor}%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                            <span className="text-sm font-medium text-gray-700">Against</span>
                                            <span className="font-bold text-rose-700">{proposal.votesAgainst}%</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">Required: {proposal.requiredVotes}%</div>
                                        <div className={`text-sm font-bold ${proposal.votesFor >= proposal.requiredVotes ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            Current: {proposal.votesFor}%
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Progress
                                        value={proposal.votesFor}
                                        className="h-2.5 bg-gray-200"
                                        indicatorClassName="bg-emerald-500"
                                    />
                                    <Progress
                                        value={proposal.votesAgainst}
                                        className="h-2.5 bg-gray-200"
                                        indicatorClassName="bg-rose-500"
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-600">Participation</div>
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">{proposal.participation}%</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-600">Voters</div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">{proposal.voters}/{proposal.totalVoters}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-600">Created</div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">{proposal.created}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                <span>Click anywhere to view details →</span>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Upcoming Proposals */}
            {upcomingProposals.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Upcoming Proposals</h2>
                        <Badge className="bg-amber-500 text-white">
                            {upcomingProposals.length} Upcoming
                        </Badge>
                    </div>

                    {upcomingProposals.map((proposal) => (
                        <Card key={proposal.id} className="border-0 shadow-sm cursor-pointer group"
                            onClick={() => handleViewDetails(proposal.id)}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-amber-500/10 text-amber-700 border-amber-200">
                                                Upcoming
                                            </Badge>
                                            <span className="text-sm text-gray-500">
                                                Starts {proposal.deadline}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {proposal.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">{proposal.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const updatedProposals = proposals.map(p =>
                                                    p.id === proposal.id ? { ...p, status: 'active' } : p
                                                );
                                                setProposals(updatedProposals);
                                            }}
                                        >
                                            <Vote className="h-4 w-4" />
                                            Activate
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProposal(proposal.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}