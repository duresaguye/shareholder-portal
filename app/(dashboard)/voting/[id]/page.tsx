"use client";

import { Button } from "@/components/ui/button";
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
    Download,
    Mail,
    Bell,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    MoreVertical,
    TrendingDown
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - this would come from your database
const proposalDetails = {
    id: "1",
    title: "2024 Board Election",
    description: "Elect 3 new directors to the board for the upcoming fiscal year. This election will shape the company's strategic direction for the next 3 years.",
    category: "Governance",
    status: "active",
    votesFor: 45,
    votesAgainst: 15,
    votesAbstain: 5,
    totalVotes: 65,
    requiredVotes: 60,
    deadline: "Dec 31, 2024",
    created: "Nov 1, 2024",
    urgency: "high",
    votingPowerParticipation: 65,
    shareholdersVoted: 245,
    totalShareholders: 385,
    details: `
        <p>Shareholders are requested to vote on the appointment of the following nominees to the Board of Directors. Each nominee will serve a three-year term expiring at the 2027 Annual Meeting.</p>
        
        <h4>Nominees:</h4>
        <ul>
            <li><strong>Sarah Connor</strong> - CEO, TechDynamics (15 years experience)</li>
            <li><strong>John Smith</strong> - CFO, Global Ventures (12 years experience)</li>
            <li><strong>Emily Chen</strong> - CTO, Future Systems (10 years experience)</li>
        </ul>
        
        <h4>Nominee Backgrounds:</h4>
        <p>All nominees have extensive experience in technology and finance sectors. They have been selected by the nomination committee based on their expertise and alignment with company strategy.</p>
        
        <h4>Term Information:</h4>
        <p>Successful nominees will serve from January 1, 2025 to December 31, 2027. Board meetings are held quarterly with additional special meetings as needed.</p>
    `,
    requirements: "Simple majority of voting shares (50% + 1 vote)",
    impact: "High - Direct impact on company strategy and governance",
    nonVoters: [
        { id: "1", name: "Robert Johnson", email: "robert@example.com", shares: 2500 },
        { id: "2", name: "Sarah Wilson", email: "sarah@example.com", shares: 1800 },
        { id: "3", name: "Mike Brown", email: "mike@example.com", shares: 3200 },
    ]
};

export default function AdminVoteDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const handleSendReminder = () => {
        console.log("Sending reminder to non-voters");
        // Implement reminder logic here
    };

    const handleExportResults = () => {
        console.log("Exporting voting results");
        // Implement export logic here
    };

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
                            {proposalDetails.title}
                        </h1>
                        <div className="flex items-center gap-3 mt-2">
                            <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">
                                {proposalDetails.category}
                            </Badge>
                            <Badge className={`${proposalDetails.urgency === 'high' ? 'bg-rose-500/10 text-rose-700 border-rose-200' : 'bg-blue-500/10 text-blue-700 border-blue-200'}`}>
                                {proposalDetails.urgency === 'high' ? 'High Priority' : 'Normal Priority'}
                            </Badge>
                            <Badge className={`${proposalDetails.status === 'active' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200' : 'bg-gray-500/10 text-gray-700 border-gray-200'}`}>
                                {proposalDetails.status.charAt(0).toUpperCase() + proposalDetails.status.slice(1)}
                            </Badge>
                        </div>
                    </div>
                </div>

            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {proposalDetails.votingPowerParticipation}%
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
                                    {proposalDetails.shareholdersVoted}/{proposalDetails.totalShareholders}
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
                                    {proposalDetails.requiredVotes}%
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
                                    {Math.ceil((new Date(proposalDetails.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                                </div>
                                <div className="text-sm text-gray-600">Days Left</div>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
                                <p className="text-gray-600">{proposalDetails.description}</p>
                            </div>

                            <div className="prose max-w-none text-gray-600">
                                <div dangerouslySetInnerHTML={{ __html: proposalDetails.details }} />
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Shield className="h-4 w-4" />
                                        <span>Voting Requirement</span>
                                    </div>
                                    <div className="font-medium text-gray-900">{proposalDetails.requirements}</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Target className="h-4 w-4" />
                                        <span>Impact Level</span>
                                    </div>
                                    <div className="font-medium text-gray-900">{proposalDetails.impact}</div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Created on {proposalDetails.created} • Deadline: {proposalDetails.deadline}
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
                                {proposalDetails.totalShareholders - proposalDetails.shareholdersVoted} shareholders still need to vote
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {proposalDetails.nonVoters.map((voter) => (
                                    <div key={voter.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                        <div className="space-y-1">
                                            <div className="font-medium text-gray-900">{voter.name}</div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Mail className="h-4 w-4" />
                                                {voter.email}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900">{voter.shares.toLocaleString()} shares</div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-blue-600 hover:text-blue-700"
                                                onClick={() => console.log(`Send reminder to ${voter.email}`)}
                                            >
                                                <Mail className="h-4 w-4 mr-1" />
                                                Remind
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {proposalDetails.nonVoters.length > 3 && (
                                    <div className="text-center pt-2">
                                        <Button variant="ghost" size="sm">
                                            View All {proposalDetails.totalShareholders - proposalDetails.shareholdersVoted} Non-Voters →
                                        </Button>
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
                            {/* For Votes */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        <span className="font-medium text-gray-700">For</span>
                                    </div>
                                    <div className="font-bold text-emerald-700">{proposalDetails.votesFor}%</div>
                                </div>
                                <Progress
                                    value={proposalDetails.votesFor}
                                    className="h-2.5 bg-gray-200"
                                    indicatorClassName="bg-emerald-500"
                                />
                                <div className="text-sm text-gray-500">
                                    {Math.round(proposalDetails.votesFor * proposalDetails.totalShareholders / 100)} shareholders
                                </div>
                            </div>

                            {/* Against Votes */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-rose-500" />
                                        <span className="font-medium text-gray-700">Against</span>
                                    </div>
                                    <div className="font-bold text-rose-700">{proposalDetails.votesAgainst}%</div>
                                </div>
                                <Progress
                                    value={proposalDetails.votesAgainst}
                                    className="h-2.5 bg-gray-200"
                                    indicatorClassName="bg-rose-500"
                                />
                                <div className="text-sm text-gray-500">
                                    {Math.round(proposalDetails.votesAgainst * proposalDetails.totalShareholders / 100)} shareholders
                                </div>
                            </div>

                            {/* Abstain Votes */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                        <span className="font-medium text-gray-700">Abstain</span>
                                    </div>
                                    <div className="font-bold text-gray-700">{proposalDetails.votesAbstain}%</div>
                                </div>
                                <Progress
                                    value={proposalDetails.votesAbstain}
                                    className="h-2.5 bg-gray-200"
                                    indicatorClassName="bg-gray-500"
                                />
                                <div className="text-sm text-gray-500">
                                    {Math.round(proposalDetails.votesAbstain * proposalDetails.totalShareholders / 100)} shareholders
                                </div>
                            </div>

                            <Separator />

                            {/* Total Votes & Quorum Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`text-center p-4 rounded-lg ${proposalDetails.totalVotes >= proposalDetails.requiredVotes ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                                    <div className="text-2xl font-bold text-gray-900">{proposalDetails.totalVotes}%</div>
                                    <div className={`text-sm ${proposalDetails.totalVotes >= proposalDetails.requiredVotes ? 'text-emerald-700' : 'text-amber-700'}`}>
                                        Total Votes
                                    </div>
                                </div>
                                <div className={`text-center p-4 rounded-lg ${proposalDetails.totalVotes >= proposalDetails.requiredVotes ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {proposalDetails.totalVotes >= proposalDetails.requiredVotes ? '✓' : '✗'}
                                    </div>
                                    <div className={`text-sm ${proposalDetails.totalVotes >= proposalDetails.requiredVotes ? 'text-emerald-700' : 'text-amber-700'}`}>
                                        {proposalDetails.totalVotes >= proposalDetails.requiredVotes ? 'Quorum Met' : 'Quorum Needed'}
                                    </div>
                                </div>
                            </div>

                            {/* Quorum Progress */}
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Quorum Progress</span>
                                    <span className="font-bold text-gray-900">
                                        {Math.min(100, Math.round((proposalDetails.totalVotes / proposalDetails.requiredVotes) * 100))}%
                                    </span>
                                </div>
                                <Progress
                                    value={Math.min(100, Math.round((proposalDetails.totalVotes / proposalDetails.requiredVotes) * 100))}
                                    className="h-2"
                                    indicatorClassName={proposalDetails.totalVotes >= proposalDetails.requiredVotes ? 'bg-emerald-500' : 'bg-amber-500'}
                                />
                                <div className="text-xs text-gray-500 text-center">
                                    {proposalDetails.requiredVotes}% required for quorum
                                </div>
                            </div>
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
                                        <span className="text-gray-700">Started</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{proposalDetails.created}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                        <span className="text-gray-700">Deadline</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{proposalDetails.deadline}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700">Results Announced</span>
                                    </div>
                                    <span className="font-medium text-gray-900">Jan 5, 2025</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}