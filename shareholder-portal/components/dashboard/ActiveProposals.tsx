"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Clock,
    Users,
    ThumbsUp,
    ThumbsDown,
    HelpCircle,
    BarChart3,
    Vote,
    Shield,
    MessageSquare,
    AlertCircle,
    Target,
    ChevronRight,
    Check,
    X,
    TrendingUp,
    Loader2,
    RefreshCw,
    Search
} from "lucide-react";
import { useState } from "react";
import { useProposals, useCastVote, useVotingResults } from "@/lib/hooks/useProposals";
import { useCurrentUser } from "@/lib/hooks/useShareholders";
import { Proposal, VotingResult } from "@/lib/types/api";

export function ActiveProposals() {
    const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
    const [voteChoice, setVoteChoice] = useState<"YES" | "NO" | "ABSTAIN" | "">("");
    const [voteReason, setVoteReason] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Fetch proposals from API
    const { data: proposalsData, isLoading, error, refetch } = useProposals();
    const castVoteMutation = useCastVote();
    const { data: currentUserData } = useCurrentUser();
    
    // Get voting results for selected proposal
    const { data: votingResults } = useVotingResults(selectedProposalId || "");

    // Filter active/open proposals
    const activeProposals = proposalsData?.proposals?.filter(
        (p: Proposal) => p.status === 'open' || p.status === 'pending'
    ) || [];

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredActiveProposals = normalizedSearch
        ? activeProposals.filter((p: Proposal) =>
            p.title.toLowerCase().includes(normalizedSearch) ||
            (p.description || "").toLowerCase().includes(normalizedSearch)
        )
        : activeProposals;

    const getCurrentProposal = () => {
        return activeProposals.find((p: Proposal) => p.id === selectedProposalId);
    };

    const handleVoteSubmit = async () => {
        if (!voteChoice || !selectedProposalId) return;
        const proposal = getCurrentProposal();
        if (proposal && hasUserVoted(proposal)) return;
        
        try {
            await castVoteMutation.mutateAsync({
                proposalId: selectedProposalId,
                vote: { vote: voteChoice }
            });
            
            alert('Vote submitted successfully!');
            setSelectedProposalId(null);
            setVoteChoice("");
            setVoteReason("");
            refetch();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to submit vote';
            alert(message);
        }
    };

    const handleCardClick = (proposalId: string) => {
        setSelectedProposalId(proposalId);
    };

    // Check if user has already voted
    const hasUserVoted = (proposal: Proposal) => {
        const userId = currentUserData?.shareholder?.id;
        if (!userId) return false;
        return proposal.votes?.some(v => v.shareholderId === userId) ?? false;
    };

    const VoteOptionCard = ({
        option,
        label,
        description,
        icon: Icon,
        color,
        bgColor,
        borderColor,
        isSelected
    }: {
        option: "YES" | "NO" | "ABSTAIN";
        label: string;
        description: string;
        icon: React.ComponentType<{ className?: string }>;
        color: string;
        bgColor: string;
        borderColor: string;
        isSelected: boolean;
    }) => (
        <div
            className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? `${borderColor} ${bgColor}` : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            onClick={() => setVoteChoice(option)}
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${isSelected ? 'bg-white' : 'bg-gray-100'}`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div className="space-y-1">
                    <h3 className={`font-bold text-lg ${color}`}>{label}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
            {isSelected && (
                <div className="p-2 bg-white rounded-full">
                    <Check className="h-5 w-5 text-emerald-600" />
                </div>
            )}
        </div>
    );

    return (
        <>
            <Card className="col-span-4 lg:col-span-4 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Active Proposals</CardTitle>
                            <CardDescription className="text-base mt-2">
                                Click on any proposal to cast your vote
                            </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2 w-full lg:w-auto lg:flex-row lg:items-center">
                            <div className="relative w-full lg:w-64">
                                <Input
                                    placeholder="Search proposals..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                            <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isLoading}
                                className="gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                                Refresh
                            </Button>
                            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium gap-1.5">
                                <Vote className="h-3.5 w-3.5" />
                                {filteredActiveProposals.length} Active Votes
                            </Badge>
                        </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="grid gap-6 md:grid-cols-2">
                    {isLoading ? (
                        <div className="col-span-2 flex items-center justify-center h-64">
                            <div className="text-center">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                                <p className="text-gray-600">Loading proposals...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="col-span-2 flex items-center justify-center h-64">
                            <Alert className="max-w-md">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Failed to load proposals: {error.message}
                                </AlertDescription>
                            </Alert>
                        </div>
                    ) : filteredActiveProposals.length === 0 ? (
                        <div className="col-span-2 flex items-center justify-center h-64">
                            <div className="text-center">
                                <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No active proposals at this time</p>
                            </div>
                        </div>
                    ) : (
                        filteredActiveProposals.map((proposal: Proposal) => {
                            const yesVotes = proposal.votes?.filter(v => v.vote === 'YES').length || 0;
                            const noVotes = proposal.votes?.filter(v => v.vote === 'NO').length || 0;
                            const abstainVotes = proposal.votes?.filter(v => v.vote === 'ABSTAIN').length || 0;
                            const totalVotes = proposal.votes?.length || 0;
                            
                            // Per-card voting results should come from the backend; if available for selected proposal, use them, otherwise fall back to simple counts.
                            const votingResult = selectedProposalId === proposal.id ? votingResults?.votingResults : undefined;
                            const yesPercentage = votingResult?.yesPercentage || (totalVotes ? (yesVotes / totalVotes) * 100 : 0);
                            const noPercentage = votingResult?.noPercentage || (totalVotes ? (noVotes / totalVotes) * 100 : 0);
                            const abstainPercentage = votingResult?.abstainPercentage || (totalVotes ? (abstainVotes / totalVotes) * 100 : 0);
                            
                            const category = proposal.type === 'NEW_SHAREHOLDER' ? 'New Shareholder' : 
                                           proposal.type === 'FINANCIAL' ? 'Financial' : 
                                           proposal.type === 'MANAGER_ELECTION' ? 'Governance' : 'General';
                            
            const userHasVoted = hasUserVoted(proposal);
            const cleanDescription = proposal.description?.split("METADATA:")[0]?.trim() ?? proposal.description;

            return (
                        <div
                            key={proposal.id}
                            className="group cursor-pointer"
                            onClick={() => handleCardClick(proposal.id)}
                        >
                            <Card key={proposal.id} className="h-full border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.01]">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${category === 'Governance' ? 'bg-purple-100' : category === 'Financial' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                                                    <Shield className={`h-5 w-5 ${category === 'Governance' ? 'text-purple-600' : category === 'Financial' ? 'text-emerald-600' : 'text-blue-600'}`} />
                                                </div>
                                                <Badge className={`${proposal.status === 'open' ? 'bg-amber-500/10 text-amber-700' : 'bg-blue-500/10 text-blue-700'}`}>
                                                    {proposal.status === 'open' ? 'Open' : 'Pending'}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                {proposal.title}
                                            </CardTitle>
                                            <CardDescription className="text-gray-600 line-clamp-2">
                                                {cleanDescription}
                                            </CardDescription>
                                            {proposal.candidates && proposal.candidates.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {proposal.candidates.slice(0, 3).map((candidate, idx) => (
                                                        <Badge key={`${candidate.name}-${idx}`} variant="outline" className="text-xs">
                                                            {candidate.name}{candidate.position ? ` • ${candidate.position}` : ""}
                                                        </Badge>
                                                    ))}
                                                    {proposal.candidates.length > 3 && (
                                                        <span className="text-xs text-gray-500">
                                                            +{proposal.candidates.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-5">
                                    {/* Voting Status */}
                                    <div className="rounded-xl bg-gray-50 p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <BarChart3 className="h-4 w-4" />
                                                Current Voting
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-center">
                                                    <div className="font-bold text-emerald-700">{yesPercentage.toFixed(1)}%</div>
                                                    <div className="text-xs text-gray-500">For</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-rose-700">{noPercentage.toFixed(1)}%</div>
                                                    <div className="text-xs text-gray-500">Against</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-gray-700">{abstainPercentage.toFixed(1)}%</div>
                                                    <div className="text-xs text-gray-500">Abstain</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bars */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-emerald-700 font-medium">In Favor</span>
                                                        <span className="font-bold">{yesPercentage.toFixed(1)}%</span>
                                                    </div>
                                                    <Progress
                                                        value={yesPercentage}
                                                        className="h-2 bg-gray-200"
                                                        indicatorClassName="bg-emerald-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-rose-700 font-medium">Against</span>
                                                        <span className="font-bold">{noPercentage.toFixed(1)}%</span>
                                                    </div>
                                                    <Progress
                                                        value={noPercentage}
                                                        className="h-2 bg-gray-200"
                                                        indicatorClassName="bg-rose-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                <Target className="h-4 w-4" />
                                                <span className="text-xs font-medium">Required</span>
                                            </div>
                                            <div className="font-bold text-gray-900 text-sm">{proposal.requiredThreshold}%</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                <Users className="h-4 w-4" />
                                                <span className="text-xs font-medium">Votes</span>
                                            </div>
                                            <div className="font-bold text-gray-900">{totalVotes}</div>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0">
                                    <div className="w-full">
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>{userHasVoted ? "You already voted" : "Click to vote →"}</span>
                                            <span className="flex items-center gap-1">
                                                <TrendingUp className="h-4 w-4" />
                                                {totalVotes} voters
                                            </span>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                        );
                    })
                    )}
                </CardContent>
            </Card>

            {/* Voting Dialog - Fixed to show properly */}
            <Dialog open={selectedProposalId !== null} onOpenChange={(open) => {
                if (!open) {
                    setSelectedProposalId(null);
                    setVoteChoice("");
                    setVoteReason("");
                }
            }}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    {getCurrentProposal() && (
                        <>
                            <DialogHeader className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <DialogTitle className="text-2xl font-bold text-gray-900">
                                        Cast Your Vote
                                    </DialogTitle>
                                    <Badge className={`${getCurrentProposal()?.status === 'open' ? 'bg-amber-500/10 text-amber-700' : 'bg-blue-500/10 text-blue-700'}`}>
                                        {getCurrentProposal()?.type}
                                    </Badge>
                                </div>
                                <DialogDescription className="text-gray-600 text-base">
                                    Review the proposal details and make your decision. You can vote only once per proposal.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {/* Proposal Details */}
                                <div className="space-y-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                                            {getCurrentProposal()?.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {getCurrentProposal()?.description?.split("METADATA:")[0]?.trim()}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <Target className="h-4 w-4" />
                                                Required Threshold
                                            </div>
                                            <div className="font-bold text-gray-900">{getCurrentProposal()?.requiredThreshold}%</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <Users className="h-4 w-4" />
                                                Total Votes
                                            </div>
                                            <div className="font-bold text-blue-600">
                                                {getCurrentProposal()?.votes?.length || 0}
                                            </div>
                                        </div>
                                    </div>
                                    {getCurrentProposal()?.candidates && getCurrentProposal()?.candidates?.length ? (
                                        <div className="space-y-2 pt-2">
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <Shield className="h-4 w-4" />
                                                Candidates
                                            </div>
                                            <div className="space-y-3">
                                                {getCurrentProposal()?.candidates?.map((candidate, idx) => (
                                                    <div key={`${candidate.name}-${idx}`} className="p-3 rounded-lg bg-white border border-gray-200 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-semibold text-gray-900">{candidate.name || `Candidate ${idx + 1}`}</div>
                                                            {candidate.position && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {candidate.position}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {candidate.bio && (
                                                            <p className="text-sm text-gray-600 whitespace-pre-line">
                                                                {candidate.bio}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Voting Options */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">Select Your Vote</h3>
                                    <div className="space-y-3">
                                        <VoteOptionCard
                                            option="YES"
                                            label="Vote YES"
                                            description="Support this proposal"
                                            icon={ThumbsUp}
                                            color="text-emerald-700"
                                            bgColor="bg-emerald-50"
                                            borderColor="border-emerald-500"
                                            isSelected={voteChoice === 'YES'}
                                        />

                                        <VoteOptionCard
                                            option="NO"
                                            label="Vote NO"
                                            description="Oppose this proposal"
                                            icon={ThumbsDown}
                                            color="text-rose-700"
                                            bgColor="bg-rose-50"
                                            borderColor="border-rose-500"
                                            isSelected={voteChoice === 'NO'}
                                        />

                                        <VoteOptionCard
                                            option="ABSTAIN"
                                            label="Abstain"
                                            description="Decline to vote on this matter"
                                            icon={HelpCircle}
                                            color="text-gray-700"
                                            bgColor="bg-gray-50"
                                            borderColor="border-gray-500"
                                            isSelected={voteChoice === 'ABSTAIN'}
                                        />
                                    </div>
                                </div>

                                {/* Reason (Optional) */}
                                <div className="space-y-3">
                                    <Label htmlFor="reason" className="text-gray-900 font-medium">
                                        <MessageSquare className="h-4 w-4 inline mr-2" />
                                        Add a comment (optional)
                                    </Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Explain your voting decision..."
                                        value={voteReason}
                                        onChange={(e) => setVoteReason(e.target.value)}
                                        className="min-h-[100px] resize-none"
                                    />
                                </div>

                                {/* Important Notice */}
                                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="font-medium text-amber-900">Important Voting Information</p>
                                            <ul className="text-sm text-amber-800 space-y-1">
                                                <li>• Your vote is weighted based on your ownership percentage</li>
                                                <li>• Requires {getCurrentProposal()?.requiredThreshold}% approval to pass</li>
                                                <li>• Once submitted, your vote cannot be changed</li>
                                                <li>• Results will be announced after voting closes</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-gray-300 hover:bg-gray-50 h-12"
                                    onClick={() => {
                                        setSelectedProposalId(null);
                                        setVoteChoice("");
                                        setVoteReason("");
                                    }}
                                    disabled={castVoteMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-3 h-12 text-lg"
                                    onClick={handleVoteSubmit}
                                    disabled={!voteChoice || castVoteMutation.isPending || (getCurrentProposal() && hasUserVoted(getCurrentProposal() as Proposal))}
                                >
                                    {castVoteMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Vote className="h-5 w-5" />
                                            Submit Vote
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}