
"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProposals } from "@/lib/hooks/useProposals";
import { useShareholder } from "@/lib/hooks/useShareholders";
import {
    ArrowLeft,
    Mail,
    PieChart,
    Shield,
    TrendingUp,
    DollarSign,
    Target,
    Calendar,
    Phone,
    MapPin,
    Building2,
    User,
    FileText,
    MessageSquare,
    Settings,
    Activity,
    Vote,
    BadgePercent,
    ArrowUpRight,
    Users,
    BarChart3,
    Percent,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Helper to parse proposal metadata and format description
const parseProposalDescription = (proposal: any) => {
    if (!proposal?.description || !proposal.description.includes("METADATA:")) {
        return proposal.description || "";
    }
    
    const [descriptionPart, metaRaw] = proposal.description.split("METADATA:");
    let cleanDescription = descriptionPart.trim();
    
    try {
        const meta = JSON.parse(metaRaw.trim());
        
        // Format based on proposal type
        if (proposal.type === 'NEW_SHAREHOLDER' && meta.newShareholderData) {
            const { firstName, lastName, email, targetOwnership, targetShares } = meta.newShareholderData;
            cleanDescription = `Proposal to add ${firstName} ${lastName} (${email}) as a new shareholder with ${targetOwnership}% ownership (${targetShares} shares)${meta.acquisitionMode === 'purchaseFromSingle' ? ' through single shareholder purchase' : ' through dilution'}.`;
        }
    } catch {
        // If parsing fails, just use the description part without metadata
    }
    
    return cleanDescription;
};

export default function ShareholderDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    
    // Fetch all data at the top level
    const { data: shareholderData, isLoading: shareholderLoading, error: shareholderError } = useShareholder(id);
    const { data: proposalsData, isLoading: proposalsLoading } = useProposals();
    
    // Calculate derived values
    const shareholder = shareholderData?.shareholder;
    const shareholderName = shareholder ? `${shareholder.firstName} ${shareholder.lastName}` : '';
    
    // Filter proposals related to this shareholder (NEW_SHAREHOLDER proposals targeting this shareholder)
    const relatedProposals = useMemo(() => 
        proposalsData?.proposals?.filter(
            (p: any) => p.type === 'NEW_SHAREHOLDER' && p.targetShareholderId === id
        ) || [],
        [proposalsData, id]
    );

    // Calculate voting history (keep hook before any early returns to preserve hook order)
    const votingHistory = useMemo(() => {
        if (!proposalsData?.proposals || !shareholder) return {
            totalVotes: 0,
            participation: 0,
            accuracy: 0,
            lastVote: shareholder?.lastLogin || shareholder?.createdAt || new Date().toISOString(),
            votes: []
        };

        const shareholderVotes = proposalsData.proposals.flatMap((proposal: any) => 
            (proposal.votes || []).filter((vote: any) => 
                vote.shareholderId === shareholder.id || 
                vote.voterId === shareholder.id ||
                (vote.shareholder && vote.shareholder.id === shareholder.id)
            ).map((vote: any) => ({
                vote: vote,
                proposal: proposal
            }))
        );

        const totalVotes = shareholderVotes.length;
        const lastVote = shareholderVotes.length > 0 
            ? shareholderVotes.sort((a: any, b: any) => {
                const dateA = new Date(a.vote?.createdAt || 0).getTime();
                const dateB = new Date(b.vote?.createdAt || 0).getTime();
                return dateB - dateA;
            })[0].vote?.createdAt
            : shareholder.lastLogin || shareholder.createdAt;

        // Calculate participation (percentage of proposals voted on)
        const totalEligibleVotes = proposalsData.proposals.filter((p: any) => p.status === 'closed' || p.status === 'open').length;
        const participation = totalEligibleVotes > 0 
            ? Math.round((totalVotes / totalEligibleVotes) * 100) 
            : 0;

        // Accuracy not available without proposal result field; set to 0 or derive differently
        const accuracy = 0;

        return {
            totalVotes,
            participation,
            accuracy,
            lastVote,
            votes: shareholderVotes.sort((a: any, b: any) => {
                const dateA = new Date(a.vote?.createdAt || 0).getTime();
                const dateB = new Date(b.vote?.createdAt || 0).getTime();
                return dateB - dateA; // Most recent first
            })
        };
    }, [proposalsData, shareholder]);

    // Loading state
    if (shareholderLoading || !shareholder) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading shareholder details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (shareholderError || !shareholderData?.shareholder) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="text-center space-y-3">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                        <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Shareholder Not Found</h2>
                    <p className="text-gray-600 max-w-md">
                        The shareholder you're looking for doesn't exist or has been removed.
                    </p>
                </div>
                <Link href="/shareholders">
                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Shareholders
                    </Button>
                </Link>
            </div>
        );
    }

    // Calculate derived values
    const shareValue = 125.50; // This should come from API in real implementation
    const totalValue = shareholder.totalShares * shareValue;
    const joinDate = new Date(shareholder.createdAt).toLocaleDateString();
    const memberSince = Math.floor((Date.now() - new Date(shareholder.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365));
    
    const transactions = [
        { date: joinDate, type: "Initial Purchase", shares: shareholder.totalShares, price: shareValue, total: totalValue },
    ];
    
    const documents = ["Share Certificate", "Voting Agreement"];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/shareholders">
                        <Button variant="outline" size="icon" className="rounded-xl border-gray-300">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                            <AvatarImage src={`/avatars/${shareholder.id}.png`} alt={shareholderName} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl">
                                {shareholderName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">{shareholderName}</h1>
                                <Badge className={`${shareholder.status === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}>
                                    {shareholder.status.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <Badge variant="outline" className={`${shareholder.type === 'institution' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'} gap-1.5`}>
                                    {shareholder.type === 'institution' ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                    {shareholder.type.charAt(0).toUpperCase() + shareholder.type.slice(1)}
                                </Badge>
                       
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Shares Card */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-blue-700">SHARES HELD</CardTitle>
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <PieChart className="h-4 w-4" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-gray-900">
                                {shareholder.totalShares.toLocaleString()}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{shareholder.ownership.toFixed(2)}% ownership</span>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +2.3%
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Portfolio Value Card */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-emerald-700">PORTFOLIO VALUE</CardTitle>
                            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-gray-900">
                                ${(totalValue / 1000).toFixed(1)}K
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">${shareValue.toFixed(2)} per share</span>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +12.5%
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Voting Power Card */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/30">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-purple-700">VOTING POWER</CardTitle>
                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                <Vote className="h-4 w-4" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-gray-900">
                                {shareholder.ownership.toFixed(2)}%
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">of total company votes</span>
                                <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                    <BadgePercent className="h-3 w-3 mr-1" />
                                    Influential
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tenure Card */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/30">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-amber-700">MEMBER TENURE</CardTitle>
                            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                                <Calendar className="h-4 w-4" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-gray-900">
                                {memberSince} {memberSince === 1 ? 'Year' : 'Years'}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Since {joinDate}</span>
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Loyal
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white gap-2">
                        <Activity className="h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="voting" className="rounded-lg data-[state=active]:bg-white gap-2">
                        <Vote className="h-4 w-4" />
                        Voting History
                    </TabsTrigger>
                    <TabsTrigger value="transactions" className="rounded-lg data-[state=active]:bg-white gap-2">
                        <ArrowUpRight className="h-4 w-4" />
                        Transactions
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-white gap-2">
                        <FileText className="h-4 w-4" />
                        Documents
                    </TabsTrigger>
                    <TabsTrigger value="proposals" className="rounded-lg data-[state=active]:bg-white gap-2">
                        <Vote className="h-4 w-4" />
                        Related Proposals
                        {relatedProposals.length > 0 && (
                            <Badge className="ml-2 bg-blue-500 text-white">{relatedProposals.length}</Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Contact Information */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-gray-600" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Mail className="h-4 w-4" />
                                            Email Address
                                        </div>
                                        <div className="font-medium text-gray-900">{shareholder.email}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Phone className="h-4 w-4" />
                                            Phone Number
                                        </div>
                                        <div className="font-medium text-gray-900">{shareholder.phone || 'Not provided'}</div>
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            Address
                                        </div>
                                        <div className="font-medium text-gray-900">{shareholder.address || 'Not provided'}</div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-900">Quick Actions</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Mail className="h-4 w-4" />
                                            Send Email
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            Send Message
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <FileText className="h-4 w-4" />
                                            Request Document
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Voting Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-gray-600" />
                                    Voting Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Participation Rate</span>
                                            <span className="font-bold text-gray-900">{votingHistory.participation}%</span>
                                        </div>
                                        <Progress
                                            value={votingHistory.participation}
                                            className="h-2"
                                            indicatorClassName="bg-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Voting Accuracy</span>
                                            <span className="font-bold text-gray-900">{votingHistory.accuracy}%</span>
                                        </div>
                                        <Progress
                                            value={votingHistory.accuracy}
                                            className="h-2"
                                            indicatorClassName="bg-emerald-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="text-center p-3 rounded-lg bg-gray-50">
                                        <div className="text-2xl font-bold text-gray-900">{votingHistory.totalVotes}</div>
                                        <div className="text-xs text-gray-600">Total Votes</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-gray-50">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {new Date(votingHistory.lastVote).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="text-xs text-gray-600">Last Voted</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Ownership Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Percent className="h-5 w-5 text-gray-600" />
                                Ownership Insights
                            </CardTitle>
                            <CardDescription>
                                How {shareholder.firstName} {shareholder.lastName}&apos;s holdings compare to other shareholders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">{shareholderName}&apos;s Holdings</span>
                                        <span className="font-bold text-gray-900">{shareholder.ownership.toFixed(2)}%</span>
                                    </div>
                                    <Progress
                                        value={shareholder.ownership}
                                        max={100}
                                        className="h-3"
                                        indicatorClassName="bg-gradient-to-r from-blue-500 to-blue-600"
                                    />
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>
                                        This shareholder ranks in the <span className="font-bold text-gray-900">top {shareholder.ownership > 5 ? '5%' : shareholder.ownership > 1 ? '15%' : '30%'}</span> of all shareholders by ownership percentage.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Voting History Tab */}
                <TabsContent value="voting">
                    <Card>
                        <CardHeader>
                            <CardTitle>Voting History</CardTitle>
                            <CardDescription>
                                Detailed record of all votes cast by {shareholderName}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {proposalsLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                                        <p className="text-gray-600">Loading voting history...</p>
                                    </div>
                                </div>
                            ) : votingHistory.votes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <Vote className="h-12 w-12 text-gray-400 mb-4" />
                                    <h4 className="font-medium text-gray-900 mb-2">No Voting History</h4>
                                    <p className="text-sm text-gray-600 max-w-md">
                                        {shareholderName} has not cast any votes yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {votingHistory.votes.map((voteItem: any, index: number) => {
                                        const vote = voteItem.vote;
                                        const proposal = voteItem.proposal;
                                        const voteType = vote?.vote || 'UNKNOWN';
                                        const voteDate = vote?.createdAt || '';
                                        const voteWeight = vote?.voteWeight || 0;
                                        
                                        const getVoteColor = (voteType: string) => {
                                            switch (voteType) {
                                                case 'YES':
                                                    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
                                                case 'NO':
                                                    return 'bg-rose-100 text-rose-700 border-rose-200';
                                                case 'ABSTAIN':
                                                    return 'bg-gray-100 text-gray-700 border-gray-200';
                                                default:
                                                    return 'bg-gray-100 text-gray-700 border-gray-200';
                                            }
                                        };

                                        const getStatusColor = (status: string) => {
                                            switch (status) {
                                                case 'open':
                                                    return 'bg-blue-500/10 text-blue-700';
                                                case 'approved':
                                                    return 'bg-emerald-500/10 text-emerald-700';
                                                case 'rejected':
                                                    return 'bg-rose-500/10 text-rose-700';
                                                case 'closed':
                                                    return 'bg-gray-500/10 text-gray-700';
                                                default:
                                                    return 'bg-gray-500/10 text-gray-700';
                                            }
                                        };

                                        return (
                                            <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-bold text-gray-900">{proposal?.title || 'Unknown Proposal'}</h4>
                                                            <Badge className={getStatusColor(proposal?.status || '')}>
                                                                {proposal?.status?.toUpperCase() || 'UNKNOWN'}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                            {proposal?.description ? parseProposalDescription(proposal) : 'No description available'}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span>Type: {proposal?.type?.replace('_', ' ') || 'Unknown'}</span>
                                                            <span>Created: {proposal?.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600">Vote:</span>
                                                            <Badge className={`${getVoteColor(voteType)} font-medium`}>
                                                                {voteType || 'UNKNOWN'}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600">Weight:</span>
                                                            <span className="font-medium text-gray-900">{voteWeight.toFixed(2)}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{voteDate ? new Date(voteDate).toLocaleDateString('en-US', { 
                                                            year: 'numeric', 
                                                            month: 'short', 
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>
                                All share purchases, sales, and dividend transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {transactions.map((transaction, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${transaction.type === 'Purchase' ? 'bg-emerald-100 text-emerald-600' : transaction.type === 'Sale' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {transaction.type === 'Purchase' ? '↑' : transaction.type === 'Sale' ? '↓' : '💰'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{transaction.type}</div>
                                                <div className="text-sm text-gray-500">{transaction.date}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">
                                                {transaction.shares > 0 ? `${transaction.shares.toLocaleString()} shares` : 'Dividend'}
                                            </div>
                                            <div className={`text-sm ${transaction.total > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {transaction.total > 0 ? '+' : ''}${Math.abs(transaction.total).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">
                                View All Transactions
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents & Files</CardTitle>
                            <CardDescription>
                                All documents associated with this shareholder account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="p-4 rounded-full bg-gray-100 mb-4">
                                    <FileText className="h-12 w-12 text-gray-400" />
                                </div>
                                <h4 className="font-medium text-gray-900 mb-2">Coming Soon</h4>
                                <p className="text-sm text-gray-600 max-w-md">
                                    Document management feature is currently under development. You'll be able to view, download, and manage all shareholder documents here.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Proposals Tab */}
                <TabsContent value="proposals">
                    <Card>
                        <CardHeader>
                            <CardTitle>Related Proposals</CardTitle>
                            <CardDescription>
                                Proposals related to {shareholderName}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {proposalsLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                                        <p className="text-gray-600">Loading proposals...</p>
                                    </div>
                                </div>
                            ) : relatedProposals.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <Vote className="h-12 w-12 text-gray-400 mb-4" />
                                    <h4 className="font-medium text-gray-900 mb-2">No Related Proposals</h4>
                                    <p className="text-sm text-gray-600 max-w-md">
                                        There are no proposals currently related to this shareholder.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {relatedProposals.map((proposal: any) => {
                                        const yesVotes = proposal.votes?.filter((v: any) => v.vote === 'YES').length || 0;
                                        const noVotes = proposal.votes?.filter((v: any) => v.vote === 'NO').length || 0;
                                        const totalVotes = proposal.votes?.length || 0;
                                        
                                        return (
                                            <div key={proposal.id} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-bold text-gray-900">{proposal.title}</h4>
                                                            <Badge className={`${
                                                                proposal.status === 'open' ? 'bg-emerald-500/10 text-emerald-700' :
                                                                proposal.status === 'approved' ? 'bg-blue-500/10 text-blue-700' :
                                                                proposal.status === 'rejected' ? 'bg-red-500/10 text-red-700' :
                                                                'bg-gray-500/10 text-gray-700'
                                                            }`}>
                                                                {proposal.status.toUpperCase()}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">{parseProposalDescription(proposal)}</p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span>Type: {proposal.type}</span>
                                                            <span>Required: {proposal.requiredThreshold}%</span>
                                                            <span>Created: {new Date(proposal.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {proposal.status === 'open' && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">Voting Progress:</span>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-emerald-700 font-medium">YES: {yesVotes}</span>
                                                                <span className="text-red-700 font-medium">NO: {noVotes}</span>
                                                                <span className="text-gray-600">Total: {totalVotes}</span>
                                                            </div>
                                                        </div>
                                                        <Progress 
                                                            value={(yesVotes / Math.max(totalVotes, 1)) * 100} 
                                                            className="h-2 mt-2"
                                                            indicatorClassName="bg-emerald-500"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}