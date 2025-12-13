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
    Edit,
    Loader2,
    AlertCircle,
    Search
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
import { useProposals, useVotingResults, useCreateGeneralProposal } from "@/lib/hooks/useProposals";
import { useShareholders } from "@/lib/hooks/useShareholders";
import { useShareClasses } from "@/lib/hooks/useShareClasses";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Proposal } from "@/lib/types/api";

// Component for individual proposal card to properly use hooks
function ProposalCard({ proposal, totalShareholders, onViewDetails }: { proposal: Proposal; totalShareholders: number; onViewDetails: (id: string) => void }) {
    const { data: votingResultsData } = useVotingResults(proposal.id);
    const results = votingResultsData?.votingResults;
    
    const votesFor = results?.yesPercentage || 0;
    const votesAgainst = results?.noPercentage || 0;
    const participation = results ? Math.round(results.totalVotingWeight) : 0;
    const voters = proposal.votes?.length || 0;
    const createdDate = new Date(proposal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const isClosed = proposal.status === 'closed' || proposal.status === 'approved' || proposal.status === 'rejected';
    const isApproved = proposal.status === 'approved';

    return (
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onViewDetails(proposal.id)}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Badge className={
                                isApproved 
                                    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
                                    : proposal.status === 'rejected'
                                    ? 'bg-rose-500/10 text-rose-700 border-rose-200'
                                    : isClosed
                                    ? 'bg-gray-500/10 text-gray-700 border-gray-200'
                                    : 'bg-blue-500/10 text-blue-700 border-blue-200'
                            }>
                                {isApproved ? '✓ APPROVED' : proposal.status === 'rejected' ? '✗ REJECTED' : proposal.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                {proposal.type.replace('_', ' ')}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                {isClosed ? 'Closed' : 'Created'} {createdDate}
                            </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {proposal.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            {proposal.description.split('\n\nMETADATA:')[0]}
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
                                onViewDetails(proposal.id);
                            }}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Voting Progress */}
                {results && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-sm font-medium text-gray-700">For</span>
                                    <span className="font-bold text-emerald-700">{votesFor.toFixed(1)}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                    <span className="text-sm font-medium text-gray-700">Against</span>
                                    <span className="font-bold text-rose-700">{votesAgainst.toFixed(1)}%</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Required: {proposal.requiredThreshold}%</div>
                                <div className={`text-sm font-bold ${
                                    isClosed 
                                        ? (isApproved ? 'text-emerald-600' : 'text-rose-600')
                                        : (votesFor >= proposal.requiredThreshold ? 'text-emerald-600' : 'text-amber-600')
                                }`}>
                                    {isClosed ? (isApproved ? '✓ Approved' : '✗ Rejected') : `Current: ${votesFor.toFixed(1)}%`}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Progress
                                value={votesFor}
                                className="h-2.5 bg-gray-200"
                                indicatorClassName="bg-emerald-500"
                            />
                            <Progress
                                value={votesAgainst}
                                className="h-2.5 bg-gray-200"
                                indicatorClassName="bg-rose-500"
                            />
                        </div>
                    </div>
                )}

                {/* Transfer/Shareholder Info Summary */}
                {proposal.type === 'TRANSFER_APPROVAL' && proposal.transferRequests && proposal.transferRequests.length > 0 && (
                    <div className="p-3 rounded-lg border bg-amber-50/50 border-amber-200">
                        <div className="text-xs font-semibold text-amber-700 mb-1">Share Transfer</div>
                        <div className="text-sm text-gray-700">
                            {proposal.transferRequests[0].from ? (
                                <span>{proposal.transferRequests[0].from.firstName} {proposal.transferRequests[0].from.lastName}</span>
                            ) : (
                                <span>Shareholder {proposal.transferRequests[0].fromShareholderId.slice(0, 8)}...</span>
                            )}
                            <span className="mx-2">→</span>
                            {proposal.transferRequests[0].to ? (
                                <span>{proposal.transferRequests[0].to.firstName} {proposal.transferRequests[0].to.lastName}</span>
                            ) : (
                                <span>Shareholder {proposal.transferRequests[0].toShareholderId.slice(0, 8)}...</span>
                            )}
                            <span className="ml-2 text-gray-600">({proposal.transferRequests[0].amount} shares)</span>
                        </div>
                    </div>
                )}
                {proposal.type === 'NEW_SHAREHOLDER' && proposal.description.includes('METADATA:') && (() => {
                    try {
                        const [, metaRaw] = proposal.description.split('METADATA:');
                        const meta = JSON.parse(metaRaw.trim());
                        const newShareholder = meta.newShareholderData;
                        return (
                            <div className="p-3 rounded-lg border bg-blue-50/50 border-blue-200">
                                <div className="text-xs font-semibold text-blue-700 mb-1">New Shareholder</div>
                                <div className="text-sm text-gray-700">
                                    <span>{newShareholder?.firstName} {newShareholder?.lastName}</span>
                                    {newShareholder?.targetShares && (
                                        <span className="ml-2 text-gray-600">({newShareholder.targetShares} shares, {newShareholder.targetOwnership}% ownership)</span>
                                    )}
                                </div>
                                {meta.acquisitionMode === 'purchaseFromSingle' && proposal.targetShareholder && (
                                    <div className="text-xs text-gray-600 mt-1">
                                        From: {proposal.targetShareholder.firstName} {proposal.targetShareholder.lastName}
                                    </div>
                                )}
                                {meta.acquisitionMode === 'purchaseByDilution' && (
                                    <div className="text-xs text-gray-600 mt-1">
                                        Method: Dilution (new shares issued)
                                    </div>
                                )}
                            </div>
                        );
                    } catch {
                        return null;
                    }
                })()}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <div className="text-sm text-gray-600">Participation</div>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{participation}%</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm text-gray-600">Voters</div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{voters}/{totalShareholders}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm text-gray-600">Created</div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{createdDate}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <div className="text-sm text-gray-500 flex items-center gap-2">
                    {isClosed ? (
                        <>
                            <Clock className="h-4 w-4" />
                            <span>Voting closed - Click to view final results →</span>
                        </>
                    ) : (
                        <span>Click anywhere to view details →</span>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}

export default function AdminVotingPage() {
    const router = useRouter();
    const { data: proposalsData, isLoading: proposalsLoading, error: proposalsError } = useProposals();
    const { data: shareholdersData } = useShareholders();
    const { data: shareClassesData } = useShareClasses();
    const createGeneralProposal = useCreateGeneralProposal();
    
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [proposalType, setProposalType] = useState<'general' | 'amendment'>('general');
    const [searchTerm, setSearchTerm] = useState("");
    const [newProposal, setNewProposal] = useState({
        title: "",
        description: "",
        requiredThreshold: 75,
        generalType: "GENERAL" as "GENERAL" | "AMENDMENT",
        position: "",
        numberOfPositions: "",
        candidates: [{ name: "", position: "", bio: "" }],
        otherDetails: ""
    });

    const proposals = proposalsData?.proposals || [];

    const getVotersCount = (proposal: Proposal) => {
        return proposal.votes?.length || 0;
    };

    const getTotalShareholders = () => {
        return shareholdersData?.shareholders?.length || 0;
    };

    const handleCreateProposal = async () => {
        try {
            // Create General or Amendment proposal
            await createGeneralProposal.mutateAsync({
                title: newProposal.title,
                description: newProposal.description,
                type: newProposal.generalType,
                requiredThreshold: newProposal.requiredThreshold,
                candidates: newProposal.candidates.filter(c => c.name.trim() !== ""),
                position: newProposal.position || undefined,
                numberOfPositions: newProposal.numberOfPositions ? parseInt(newProposal.numberOfPositions) : undefined,
                otherDetails: newProposal.otherDetails || undefined
            });
            
            // Reset form
            setNewProposal({
                title: "",
                description: "",
                requiredThreshold: 75,
                generalType: "GENERAL",
                position: "",
                numberOfPositions: "",
                candidates: [{ name: "", position: "", bio: "" }],
                otherDetails: ""
            });
            setIsCreateDialogOpen(false);
        } catch (error) {
            console.error("Error creating proposal:", error);
        }
    };

    const handleViewDetails = (id: string) => {
        router.push(`/voting/${id}`);
    };

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const activeProposals = proposals.filter((p: Proposal) => p.status === "open");
    const closedProposals = proposals.filter((p: Proposal) => p.status === "closed" || p.status === "approved" || p.status === "rejected");
    const filteredActiveProposals = normalizedSearch
        ? activeProposals.filter(p =>
            p.title.toLowerCase().includes(normalizedSearch) ||
            p.description.toLowerCase().includes(normalizedSearch)
        )
        : activeProposals;
    
    // Calculate average participation percentage
    const calculateAvgParticipation = () => {
        const totalShareholders = getTotalShareholders();
        if (proposals.length === 0 || totalShareholders === 0) return 0;
        
        const totalParticipation = proposals.reduce((sum, proposal) => {
            const votersCount = getVotersCount(proposal);
            const participationRate = (votersCount / totalShareholders) * 100;
            return sum + participationRate;
        }, 0);
        
        return Math.round(totalParticipation / proposals.length);
    };
    
    const avgParticipation = calculateAvgParticipation();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Voting Management</h1>
                    <p className="text-gray-600 mt-1">Track votes and create new proposals</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative sm:w-64 w-full">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search proposals..."
                            className="pl-10"
                        />
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="h-4 w-4 mr-2" />
                                New Proposal
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Proposal</DialogTitle>
                                <DialogDescription>
                                    Add a new proposal for shareholder voting
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Proposal Type</Label>
                                    <Select value={proposalType} onValueChange={(value: 'general' | 'amendment') => setProposalType(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General Proposal</SelectItem>
                                            <SelectItem value="amendment">Amendment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Proposal Title</Label>
                                    <Input
                                        placeholder="e.g., Annual Board Election"
                                        value={newProposal.title}
                                        onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Provide detailed information about the proposal..."
                                        value={newProposal.description}
                                        onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                                        className="min-h-[100px]"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Required Threshold %</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={newProposal.requiredThreshold}
                                        onChange={(e) => setNewProposal({ ...newProposal, requiredThreshold: parseFloat(e.target.value) || 75 })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Proposal Type
                                    </Label>
                                    <Select 
                                        value={newProposal.generalType} 
                                        onValueChange={(value: "GENERAL" | "AMENDMENT") => setNewProposal({ ...newProposal, generalType: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GENERAL">General</SelectItem>
                                            <SelectItem value="AMENDMENT">Amendment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Position/Role (e.g., Board Member, Manager)
                                    </Label>
                                    <Input
                                        placeholder="e.g., Board Member, CEO, Manager"
                                        value={newProposal.position}
                                        onChange={(e) => setNewProposal({ ...newProposal, position: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Number of Positions to Fill
                                    </Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        placeholder="e.g., 3"
                                        value={newProposal.numberOfPositions}
                                        onChange={(e) => setNewProposal({ ...newProposal, numberOfPositions: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Candidates
                                    </Label>
                                    <div className="space-y-3">
                                        {newProposal.candidates.map((candidate, index) => (
                                            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm">
                                                        Candidate {index + 1}
                                                    </Label>
                                                    {newProposal.candidates.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newCandidates = newProposal.candidates.filter((_, i) => i !== index);
                                                                setNewProposal({ ...newProposal, candidates: newCandidates });
                                                            }}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>
                                                <Input
                                                    placeholder="Candidate Name *"
                                                    value={candidate.name}
                                                    onChange={(e) => {
                                                        const newCandidates = [...newProposal.candidates];
                                                        newCandidates[index].name = e.target.value;
                                                        setNewProposal({ ...newProposal, candidates: newCandidates });
                                                    }}
                                                />
                                                <Input
                                                    placeholder="Position/Role (optional)"
                                                    value={candidate.position || ""}
                                                    onChange={(e) => {
                                                        const newCandidates = [...newProposal.candidates];
                                                        newCandidates[index].position = e.target.value;
                                                        setNewProposal({ ...newProposal, candidates: newCandidates });
                                                    }}
                                                />
                                                <Textarea
                                                    placeholder="Bio/Background (optional)"
                                                    value={candidate.bio || ""}
                                                    onChange={(e) => {
                                                        const newCandidates = [...newProposal.candidates];
                                                        newCandidates[index].bio = e.target.value;
                                                        setNewProposal({ ...newProposal, candidates: newCandidates });
                                                    }}
                                                    className="min-h-[80px]"
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setNewProposal({
                                                    ...newProposal,
                                                    candidates: [...newProposal.candidates, { name: "", position: "", bio: "" }]
                                                });
                                            }}
                                            className="w-full"
                                        >
                                            + Add Candidate
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Additional Details (optional)
                                    </Label>
                                    <Textarea
                                        placeholder="Any other relevant information..."
                                        value={newProposal.otherDetails}
                                        onChange={(e) => setNewProposal({ ...newProposal, otherDetails: e.target.value })}
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                    disabled={createGeneralProposal.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateProposal}
                                    disabled={createGeneralProposal.isPending}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {createGeneralProposal.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Proposal'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            {proposalsLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : proposalsError ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            <span>Error loading proposals. Please try again.</span>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl font-bold text-gray-900">{activeProposals.length}</div>
                                    <div className="text-sm text-gray-600">Active Votes</div>
                                </div>
                                <div className="p-2 rounded-lg bg-blue-100">
                                    <Vote className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl font-bold text-gray-900">
                                        {avgParticipation}%
                                    </div>
                                    <div className="text-sm text-gray-600">Avg Participation</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Across {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <div className="p-2 rounded-lg bg-green-100">
                                    <Users className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl font-bold text-gray-900">{closedProposals.length}</div>
                                    <div className="text-sm text-gray-600">Closed</div>
                                </div>
                                <div className="p-2 rounded-lg bg-amber-100">
                                    <Calendar className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Proposals with Tabs */}
            {!proposalsLoading && !proposalsError && (
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="active" className="flex items-center gap-2">
                            <Vote className="h-4 w-4" />
                            Active Votes
                            <Badge variant="secondary" className="ml-2">
                                {filteredActiveProposals.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Voting History
                            <Badge variant="secondary" className="ml-2">
                                {closedProposals.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="space-y-4 mt-6">
                        {activeProposals.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center text-gray-500 py-8">
                                        No active proposals at this time.
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredActiveProposals.map((proposal: Proposal) => (
                                <ProposalCard 
                                    key={proposal.id} 
                                    proposal={proposal} 
                                    totalShareholders={getTotalShareholders()}
                                    onViewDetails={handleViewDetails}
                                />
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4 mt-6">
                        {closedProposals.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center text-gray-500 py-8">
                                        No closed proposals yet.
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            closedProposals.map((proposal: Proposal) => (
                                <ProposalCard 
                                    key={proposal.id} 
                                    proposal={proposal} 
                                    totalShareholders={getTotalShareholders()}
                                    onViewDetails={handleViewDetails}
                                />
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}