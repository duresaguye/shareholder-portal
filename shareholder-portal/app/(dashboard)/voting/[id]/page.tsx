"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProposal, useVotingResults, useCastVote } from "@/lib/hooks/useProposals";
import { useShareholders, useCurrentUser } from "@/lib/hooks/useShareholders";
import { useShareClasses } from "@/lib/hooks/useShareClasses";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowLeft,
    Users,
    Calendar,
    Clock,
    TrendingUp,
    BarChart3,
    Target,
    Shield,
    FileText,
    Mail,
    CheckCircle,
    XCircle,
    TrendingDown,
    Loader2,
    AlertCircle
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AdminVoteDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: proposalData, isLoading: proposalLoading, error: proposalError } = useProposal(id);
    const { data: votingResultsData, isLoading: resultsLoading } = useVotingResults(id);
    const { data: shareholdersData } = useShareholders();
    const { data: shareClassesData } = useShareClasses();
    const { data: currentUserData } = useCurrentUser();
    const castVote = useCastVote();
    
    const proposal = proposalData?.proposal;
    const candidates = (proposal as unknown as { candidates?: { name?: string; position?: string; bio?: string }[] })?.candidates;
    const votingResults = votingResultsData?.votingResults;
    const currentShareholderId = currentUserData?.shareholder?.id;
    const userVote = proposal?.votes?.find(v => v.shareholderId === currentShareholderId);

    const parseMetadata = () => {
        if (!proposal?.description?.includes("METADATA:")) return null;
        const [, metaRaw] = proposal.description.split("METADATA:");
        try {
            return JSON.parse(metaRaw.trim());
        } catch {
            return null;
        }
    };

    const metadata = parseMetadata();
    const newShareholderMeta = metadata?.newShareholderData;
    const transferRequest = proposal?.transferRequests?.[0];
    const shareholdersMap = new Map((shareholdersData?.shareholders || []).map((s) => [s.id, s]));
    const shareClassesMap = new Map((shareClassesData?.shareClasses || []).map((sc) => [sc.id, sc]));
    
    const handleSendReminder = (email: string, name: string) => {
        const subject = encodeURIComponent(`Reminder: Vote on "${proposal?.title || "Proposal"}"`);
        const body = encodeURIComponent(
            `Dear ${name},\n\n` +
            `This is a reminder that you haven't voted on the proposal: "${proposal?.title || "Proposal"}"\n\n` +
            `Please log in to the shareholder portal to cast your vote.\n\n` +
            `Proposal Details:\n${(proposal?.description || "").split('\n\nMETADATA:')[0]}\n\n` +
            `Thank you,\nShareholder Portal`
        );
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    const handleExportResults = () => {
        console.log("Exporting voting results");
        // Implement export logic here
    };

    const handleVote = async (voteType: "YES" | "NO" | "ABSTAIN") => {
        if (!id || userVote) return;
        await castVote.mutateAsync({ proposalId: id, vote: { vote: voteType } });
    };

    if (proposalLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (proposalError || !proposal) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            <span>Error loading proposal. Please try again.</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const totalShareholders = shareholdersData?.shareholders?.length || 0;
    const votersCount = proposal.votes?.length || 0;
    const createdDate = new Date(proposal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const updatedDate = new Date(proposal.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Get non-voters (shareholders who haven't voted)
    const votersIds = new Set(proposal.votes?.map(v => v.shareholderId) || []);
    const nonVoters = shareholdersData?.shareholders?.filter(sh => !votersIds.has(sh.id)) || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/voting">
                        <Button variant="outline" size="icon" className="rounded-xl border-gray-300">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {proposal.title}
                        </h1>
                        <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="text-xs">
                                {proposal.type.replace('_', ' ')}
                            </Badge>
                            <Badge className={`${proposal.status === 'open' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200' : 'bg-gray-500/10 text-gray-700 border-gray-200'}`}>
                                {proposal.status.toUpperCase()}
                            </Badge>
                            {proposal.author && (
                                <Badge variant="outline" className="text-xs">
                                    By {proposal.author.firstName} {proposal.author.lastName}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Stats Grid */}
            {resultsLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {votingResults ? Math.round(votingResults.totalVotingWeight) : 0}%
                                    </div>
                                    <div className="text-sm text-gray-600">Participation</div>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {votersCount}/{totalShareholders}
                                    </div>
                                    <div className="text-sm text-gray-600">Voters</div>
                                </div>
                                <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50 to-rose-100/30">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {proposal.requiredThreshold}%
                                    </div>
                                    <div className="text-sm text-gray-600">Required</div>
                                </div>
                                <div className="p-3 rounded-lg bg-rose-100 text-rose-600">
                                    <Target className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/30">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {votingResults?.isApproved ? '✓' : '✗'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {votingResults?.isApproved ? 'Approved' : 'Pending'}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                                    <Clock className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Proposal Details */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Proposal Details
                            </CardTitle>
                            <CardDescription>
                                Complete information about the voting proposal
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900">Description</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{proposal.description.split('\n\nMETADATA:')[0]}</p>
                            </div>

                            {newShareholderMeta && (
                                <div className="p-4 rounded-lg border bg-blue-50 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-blue-700">
                                        <Shield className="h-4 w-4" />
                                        New Shareholder Details
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-800">
                                        <div><span className="font-semibold">Name:</span> {newShareholderMeta.firstName} {newShareholderMeta.lastName}</div>
                                        <div><span className="font-semibold">Email:</span> {newShareholderMeta.email}</div>
                                        <div><span className="font-semibold">Username:</span> {newShareholderMeta.username}</div>
                                        <div><span className="font-semibold">Type:</span> {newShareholderMeta.type}</div>
                                        <div><span className="font-semibold">Target Shares:</span> {newShareholderMeta.targetShares}</div>
                                        <div><span className="font-semibold">Target Ownership:</span> {newShareholderMeta.targetOwnership}%</div>
                                        <div className="md:col-span-2">
                                            <span className="font-semibold">Acquisition Mode:</span> {
                                                metadata?.acquisitionMode === 'purchaseFromSingle' ? 'Purchase from Single Shareholder' : 
                                                metadata?.acquisitionMode === 'purchaseByDilution' ? 'Purchase by Dilution' : 
                                                metadata?.acquisitionMode
                                            }
                                        </div>
                                        {metadata?.acquisitionMode === 'purchaseFromSingle' && metadata?.fromShareholderId && (
                                            <div className="md:col-span-2 p-3 rounded bg-white border border-blue-200">
                                                <div className="font-semibold text-blue-700 mb-2">Shares will be transferred from:</div>
                                                {proposal?.targetShareholder ? (
                                                    <div className="text-sm text-gray-700">
                                                        <div><span className="font-medium">Name:</span> {proposal.targetShareholder.firstName} {proposal.targetShareholder.lastName}</div>
                                                        <div><span className="font-medium">Email:</span> {proposal.targetShareholder.email}</div>
                                                        <div><span className="font-medium">Current Shares:</span> {proposal.targetShareholder.totalShares}</div>
                                                        <div><span className="font-medium">Current Ownership:</span> {proposal.targetShareholder.ownership?.toFixed(2) || '0.00'}%</div>
                                                        <div className="mt-2 text-xs text-gray-600">
                                                            After transfer: {proposal.targetShareholder.totalShares - newShareholderMeta.targetShares} shares
                                                        </div>
                                                    </div>
                                                ) : shareholdersMap.get(metadata.fromShareholderId) ? (
                                                    <div className="text-sm text-gray-700">
                                                        <div><span className="font-medium">Name:</span> {shareholdersMap.get(metadata.fromShareholderId)!.firstName} {shareholdersMap.get(metadata.fromShareholderId)!.lastName}</div>
                                                        <div><span className="font-medium">Email:</span> {shareholdersMap.get(metadata.fromShareholderId)!.email}</div>
                                                        <div><span className="font-medium">Current Shares:</span> {shareholdersMap.get(metadata.fromShareholderId)!.totalShares || 'N/A'}</div>
                                                        <div className="mt-2 text-xs text-gray-600">
                                                            After transfer: {(shareholdersMap.get(metadata.fromShareholderId)!.totalShares || 0) - newShareholderMeta.targetShares} shares
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-500">Shareholder ID: {metadata.fromShareholderId}</div>
                                                )}
                                            </div>
                                        )}
                                        {metadata?.acquisitionMode === 'purchaseByDilution' && (
                                            <div className="md:col-span-2 p-3 rounded bg-white border border-blue-200">
                                                <div className="font-semibold text-blue-700 mb-2">Share Acquisition Method:</div>
                                                <div className="text-sm text-gray-700">
                                                    New shares will be issued, diluting all existing shareholders proportionally. 
                                                    The new shareholder will receive {newShareholderMeta.targetShares} shares representing {newShareholderMeta.targetOwnership}% ownership.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {transferRequest && (
                                <div className="p-4 rounded-lg border bg-amber-50 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-amber-700">
                                        <BarChart3 className="h-4 w-4" />
                                        Share Transfer Request
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-800">
                                        <div>
                                            <span className="font-semibold">From Shareholder:</span>{" "}
                                            {transferRequest.from ? (
                                                <div className="mt-1 ml-4">
                                                    <div>{transferRequest.from.firstName} {transferRequest.from.lastName}</div>
                                                    <div className="text-xs text-gray-600">{transferRequest.from.email}</div>
                                                    {transferRequest.from.totalShares !== undefined && (
                                                        <div className="text-xs text-gray-600">
                                                            Current: {transferRequest.from.totalShares} shares
                                                            {transferRequest.from.totalShares !== undefined && (
                                                                <span className="ml-2">
                                                                    → {transferRequest.from.totalShares - transferRequest.amount} shares after transfer
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : shareholdersMap.get(transferRequest.fromShareholderId) ? (
                                                <div className="mt-1 ml-4">
                                                    <div>{shareholdersMap.get(transferRequest.fromShareholderId)!.firstName} {shareholdersMap.get(transferRequest.fromShareholderId)!.lastName}</div>
                                                    <div className="text-xs text-gray-600">{shareholdersMap.get(transferRequest.fromShareholderId)!.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">{transferRequest.fromShareholderId}</span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-semibold">To Shareholder:</span>{" "}
                                            {transferRequest.to ? (
                                                <div className="mt-1 ml-4">
                                                    <div>{transferRequest.to.firstName} {transferRequest.to.lastName}</div>
                                                    <div className="text-xs text-gray-600">{transferRequest.to.email}</div>
                                                    {transferRequest.to.totalShares !== undefined && (
                                                        <div className="text-xs text-gray-600">
                                                            Current: {transferRequest.to.totalShares} shares
                                                            <span className="ml-2">
                                                                → {transferRequest.to.totalShares + transferRequest.amount} shares after transfer
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : shareholdersMap.get(transferRequest.toShareholderId) ? (
                                                <div className="mt-1 ml-4">
                                                    <div>{shareholdersMap.get(transferRequest.toShareholderId)!.firstName} {shareholdersMap.get(transferRequest.toShareholderId)!.lastName}</div>
                                                    <div className="text-xs text-gray-600">{shareholdersMap.get(transferRequest.toShareholderId)!.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">{transferRequest.toShareholderId}</span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Share Class:</span>{" "}
                                            {transferRequest.shareClass?.name || shareClassesMap.get(transferRequest.shareClassId)?.name || transferRequest.shareClassId}
                                        </div>
                                        <div><span className="font-semibold">Amount:</span> {transferRequest.amount} shares</div>
                                        <div><span className="font-semibold">Price/Share:</span> ${transferRequest.price?.toFixed(2) || transferRequest.price}</div>
                                        <div><span className="font-semibold">Total Value:</span> ${(transferRequest.amount * (transferRequest.price || 0)).toFixed(2)}</div>
                                        <div><span className="font-semibold">Status:</span> <span className="capitalize">{transferRequest.status}</span></div>
                                    </div>
                                </div>
                            )}

                            {candidates && candidates.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Users className="h-4 w-4 text-blue-600" />
                                        Candidates
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {candidates.map((candidate: { name?: string; position?: string; bio?: string }, idx: number) => (
                                            <div key={`${candidate.name}-${idx}`} className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-1">
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
                            )}

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Shield className="h-4 w-4" />
                                        <span>Voting Requirement</span>
                                    </div>
                                    <div className="font-medium text-gray-900">{proposal.requiredThreshold}% threshold required</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Target className="h-4 w-4" />
                                        <span>Proposal Type</span>
                                    </div>
                                    <div className="font-medium text-gray-900">{proposal.type.replace('_', ' ')}</div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Created on {createdDate} • Updated {updatedDate}
                                </div>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Non-Voters List */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingDown className="h-5 w-5 text-amber-600" />
                                Remaining Non-Voters
                            </CardTitle>
                            <CardDescription>
                                {nonVoters.length} shareholders still need to vote
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {nonVoters.slice(0, 5).map((voter) => (
                                    <div key={voter.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                        <div className="space-y-1">
                                            <div className="font-medium text-gray-900">{voter.firstName} {voter.lastName}</div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Mail className="h-4 w-4" />
                                                {voter.email}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900">{voter.totalShares.toLocaleString()} shares</div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-blue-600 hover:text-blue-700"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSendReminder(voter.email, `${voter.firstName} ${voter.lastName}`);
                                                }}
                                            >
                                                <Mail className="h-4 w-4 mr-1" />
                                                Remind
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {nonVoters.length > 5 && (
                                    <div className="text-center pt-2">
                                        <Button variant="ghost" size="sm">
                                            View All {nonVoters.length} Non-Voters →
                                        </Button>
                                    </div>
                                )}
                                {nonVoters.length === 0 && (
                                    <div className="text-center text-gray-500 py-4">
                                        All shareholders have voted!
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Results & Actions */}
                <div className="space-y-6">
                    

                    {/* Live Results */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                Live Results
                            </CardTitle>
                            <CardDescription>Current voting breakdown</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {resultsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                </div>
                            ) : votingResults ? (
                                <>
                                    {/* For Votes */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                <span className="font-medium text-gray-700">For</span>
                                            </div>
                                            <div className="font-bold text-emerald-700">{votingResults.yesPercentage.toFixed(1)}%</div>
                                        </div>
                                        <Progress
                                            value={votingResults.yesPercentage}
                                            className="h-2.5 bg-gray-200"
                                            indicatorClassName="bg-emerald-500"
                                        />
                                        <div className="text-sm text-gray-500">
                                            {votingResults.yesWeight.toFixed(2)}% voting weight
                                        </div>
                                    </div>

                                    {/* Against Votes */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="h-4 w-4 text-rose-500" />
                                                <span className="font-medium text-gray-700">Against</span>
                                            </div>
                                            <div className="font-bold text-rose-700">{votingResults.noPercentage.toFixed(1)}%</div>
                                        </div>
                                        <Progress
                                            value={votingResults.noPercentage}
                                            className="h-2.5 bg-gray-200"
                                            indicatorClassName="bg-rose-500"
                                        />
                                        <div className="text-sm text-gray-500">
                                            {votingResults.noWeight.toFixed(2)}% voting weight
                                        </div>
                                    </div>

                                    {/* Abstain Votes */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                                <span className="font-medium text-gray-700">Abstain</span>
                                            </div>
                                            <div className="font-bold text-gray-700">{votingResults.abstainPercentage.toFixed(1)}%</div>
                                        </div>
                                        <Progress
                                            value={votingResults.abstainPercentage}
                                            className="h-2.5 bg-gray-200"
                                            indicatorClassName="bg-gray-500"
                                        />
                                        <div className="text-sm text-gray-500">
                                            {votingResults.abstainWeight.toFixed(2)}% voting weight
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Total Votes & Quorum Status */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={`text-center p-4 rounded-lg ${votingResults.isApproved ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                                            <div className="text-2xl font-bold text-gray-900">{votingResults.totalVotingWeight.toFixed(1)}%</div>
                                            <div className={`text-sm ${votingResults.isApproved ? 'text-emerald-700' : 'text-amber-700'}`}>
                                                Total Weight
                                            </div>
                                        </div>
                                        <div className={`text-center p-4 rounded-lg ${votingResults.isApproved ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {votingResults.isApproved ? '✓' : '✗'}
                                            </div>
                                            <div className={`text-sm ${votingResults.isApproved ? 'text-emerald-700' : 'text-amber-700'}`}>
                                                {votingResults.isApproved ? 'Approved' : 'Pending'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quorum Progress */}
                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Quorum Progress</span>
                                            <span className="font-bold text-gray-900">
                                                {Math.min(100, Math.round((votingResults.yesPercentage / proposal.requiredThreshold) * 100))}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={Math.min(100, Math.round((votingResults.yesPercentage / proposal.requiredThreshold) * 100))}
                                            className="h-2"
                                            indicatorClassName={votingResults.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}
                                        />
                                        <div className="text-xs text-gray-500 text-center">
                                            {proposal.requiredThreshold}% required for approval
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-500 py-4">
                                    No voting results available
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Results update every 5 minutes
                            </div>
                        </CardFooter>
                    </Card>



                    {/* Voting Timeline */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Voting Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="text-gray-700">Created</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{createdDate}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                        <span className="text-gray-700">Updated</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{updatedDate}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${votingResults?.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                        <span className="text-gray-700">Status</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{proposal.status.toUpperCase()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}