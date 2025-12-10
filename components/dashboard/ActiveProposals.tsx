"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    TrendingUp
} from "lucide-react";
import { useState } from "react";

export function ActiveProposals() {
    const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
    const [voteChoice, setVoteChoice] = useState<string>("");
    const [voteReason, setVoteReason] = useState<string>("");

    const proposals = [
        {
            id: 1,
            title: "2024 Board Election",
            description: "Elect 3 new directors to the board for the upcoming fiscal year. This election will shape the company's strategic direction for the next 3 years.",
            status: "active",
            deadline: "Dec 31, 2024",
            participation: 65,
            voters: 245,
            urgency: "high",
            currentVotes: {
                for: 45,
                against: 15,
                abstain: 5
            },
            impact: "High",
            category: "Governance",
            requires: "Majority Vote",
            candidates: ["Sarah Chen", "Michael Rodriguez", "James Wilson", "Priya Patel"]
        },
        {
            id: 2,
            title: "Q4 Dividend Distribution",
            description: "Approve the proposed dividend of $1.50 per share for Q4 2024. This represents a 15% increase from last quarter.",
            status: "active",
            deadline: "Jan 15, 2025",
            participation: 42,
            voters: 158,
            urgency: "medium",
            currentVotes: {
                for: 38,
                against: 8,
                abstain: 4
            },
            impact: "Medium",
            category: "Financial",
            requires: "Simple Majority",
            estimatedYield: "3.2%"
        }
    ];

    const getCurrentProposal = () => {
        return proposals.find(p => p.id === selectedProposal);
    };

    const handleVoteSubmit = () => {
        if (!voteChoice) return;
        console.log(`Voted ${voteChoice} on proposal ${selectedProposal}: ${voteReason}`);
        // Here you would typically make an API call
        setSelectedProposal(null);
        setVoteChoice("");
        setVoteReason("");
    };

    const handleCardClick = (proposalId: number) => {
        setSelectedProposal(proposalId);
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
    }: any) => (
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
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Active Proposals</CardTitle>
                            <CardDescription className="text-base mt-2">
                                Click on any proposal to cast your vote
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium gap-1.5">
                            <Vote className="h-3.5 w-3.5" />
                            {proposals.length} Active Votes
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="grid gap-6 md:grid-cols-2">
                    {proposals.map((proposal) => (
                        <div
                            key={proposal.id}
                            className="group cursor-pointer"
                            onClick={() => handleCardClick(proposal.id)}
                        >
                            <Card className="h-full border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.01]">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${proposal.category === 'Governance' ? 'bg-purple-100' : 'bg-emerald-100'}`}>
                                                    <Shield className={`h-5 w-5 ${proposal.category === 'Governance' ? 'text-purple-600' : 'text-emerald-600'}`} />
                                                </div>
                                                <Badge className={`${proposal.urgency === 'high' ? 'bg-amber-500/10 text-amber-700' : 'bg-blue-500/10 text-blue-700'}`}>
                                                    {proposal.urgency === 'high' ? 'High Priority' : 'Medium Priority'}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                {proposal.title}
                                            </CardTitle>
                                            <CardDescription className="text-gray-600 line-clamp-2">
                                                {proposal.description}
                                            </CardDescription>
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
                                                    <div className="font-bold text-emerald-700">{proposal.currentVotes.for}%</div>
                                                    <div className="text-xs text-gray-500">For</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-rose-700">{proposal.currentVotes.against}%</div>
                                                    <div className="text-xs text-gray-500">Against</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-gray-700">{proposal.currentVotes.abstain}%</div>
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
                                                        <span className="font-bold">{proposal.currentVotes.for}%</span>
                                                    </div>
                                                    <Progress
                                                        value={proposal.currentVotes.for}
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
                                                        <span className="font-bold">{proposal.currentVotes.against}%</span>
                                                    </div>
                                                    <Progress
                                                        value={proposal.currentVotes.against}
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
                                                <Clock className="h-4 w-4" />
                                                <span className="text-xs font-medium">Deadline</span>
                                            </div>
                                            <div className="font-bold text-gray-900">{proposal.deadline}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                <Users className="h-4 w-4" />
                                                <span className="text-xs font-medium">Participation</span>
                                            </div>
                                            <div className="font-bold text-gray-900">{proposal.participation}%</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                <Target className="h-4 w-4" />
                                                <span className="text-xs font-medium">Impact</span>
                                            </div>
                                            <div className={`font-bold ${proposal.impact === 'High' ? 'text-amber-600' : 'text-blue-600'}`}>
                                                {proposal.impact}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                <Shield className="h-4 w-4" />
                                                <span className="text-xs font-medium">Required</span>
                                            </div>
                                            <div className="font-bold text-gray-900 text-sm">{proposal.requires}</div>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0">
                                    <div className="w-full">
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>Click to vote →</span>
                                            <span className="flex items-center gap-1">
                                                <TrendingUp className="h-4 w-4" />
                                                {proposal.voters} voters
                                            </span>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Voting Dialog - Fixed to show properly */}
            <Dialog open={selectedProposal !== null} onOpenChange={(open) => {
                if (!open) {
                    setSelectedProposal(null);
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
                                    <Badge className={`${getCurrentProposal()?.urgency === 'high' ? 'bg-amber-500/10 text-amber-700' : 'bg-blue-500/10 text-blue-700'}`}>
                                        {getCurrentProposal()?.category}
                                    </Badge>
                                </div>
                                <DialogDescription className="text-gray-600 text-base">
                                    Review the proposal details and make your decision
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
                                            {getCurrentProposal()?.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <Clock className="h-4 w-4" />
                                                Voting Deadline
                                            </div>
                                            <div className="font-bold text-gray-900">{getCurrentProposal()?.deadline}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <Target className="h-4 w-4" />
                                                Impact Level
                                            </div>
                                            <div className={`font-bold ${getCurrentProposal()?.impact === 'High' ? 'text-amber-600' : 'text-blue-600'}`}>
                                                {getCurrentProposal()?.impact} Impact
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Voting Options */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">Select Your Vote</h3>
                                    <div className="space-y-3">
                                        <VoteOptionCard
                                            option="for"
                                            label="Vote For"
                                            description="Support this proposal"
                                            icon={ThumbsUp}
                                            color="text-emerald-700"
                                            bgColor="bg-emerald-50"
                                            borderColor="border-emerald-500"
                                            isSelected={voteChoice === 'for'}
                                        />

                                        <VoteOptionCard
                                            option="against"
                                            label="Vote Against"
                                            description="Oppose this proposal"
                                            icon={ThumbsDown}
                                            color="text-rose-700"
                                            bgColor="bg-rose-50"
                                            borderColor="border-rose-500"
                                            isSelected={voteChoice === 'against'}
                                        />

                                        <VoteOptionCard
                                            option="abstain"
                                            label="Abstain"
                                            description="Decline to vote on this matter"
                                            icon={HelpCircle}
                                            color="text-gray-700"
                                            bgColor="bg-gray-50"
                                            borderColor="border-gray-500"
                                            isSelected={voteChoice === 'abstain'}
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
                                                <li>• Your vote is weighted based on your share count</li>
                                                <li>• Voting closes on {getCurrentProposal()?.deadline}</li>
                                                <li>• Once submitted, your vote cannot be changed</li>
                                                <li>• Results will be announced after the deadline</li>
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
                                        setSelectedProposal(null);
                                        setVoteChoice("");
                                        setVoteReason("");
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-3 h-12 text-lg"
                                    onClick={handleVoteSubmit}
                                    disabled={!voteChoice}
                                >
                                    <Vote className="h-5 w-5" />
                                    Submit Vote
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}