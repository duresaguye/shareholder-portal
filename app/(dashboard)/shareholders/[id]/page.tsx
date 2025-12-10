"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    Percent
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const shareholders = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        shares: 6250,
        ownership: 0.5,
        status: "active",
        type: "individual",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, New York, NY 10001",
        joinDate: "2022-03-15",
        memberSince: 2,
        shareValue: 125.50,
        totalValue: 6250 * 125.50,
        votingPower: 0.5,
        votingHistory: {
            totalVotes: 24,
            participation: 92,
            accuracy: 85,
            lastVote: "2024-11-15"
        },
        transactions: [
            { date: "2024-11-10", type: "Purchase", shares: 500, price: 124.80, total: 62400 },
            { date: "2024-08-22", type: "Dividend", shares: 0, price: 0, total: 937.50 },
            { date: "2024-05-15", type: "Purchase", shares: 1000, price: 122.30, total: 122300 },
        ],
        documents: ["Share Certificate", "Voting Agreement", "Tax Forms"]
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        shares: 15000,
        ownership: 1.2,
        status: "active",
        type: "individual",
        phone: "+1 (555) 987-6543",
        address: "456 Oak Ave, San Francisco, CA 94105",
        joinDate: "2021-08-22",
        memberSince: 3,
        shareValue: 125.50,
        totalValue: 15000 * 125.50,
        votingPower: 1.2,
        votingHistory: {
            totalVotes: 32,
            participation: 100,
            accuracy: 92,
            lastVote: "2024-11-20"
        },
        transactions: [
            { date: "2024-10-05", type: "Purchase", shares: 2000, price: 123.90, total: 247800 },
            { date: "2024-07-15", type: "Dividend", shares: 0, price: 0, total: 2250 },
            { date: "2024-01-20", type: "Purchase", shares: 3000, price: 118.40, total: 355200 },
        ],
        documents: ["Share Certificate", "Voting Agreement"]
    },
    {
        id: "3",
        name: "Acme Corporation",
        email: "contact@acme.com",
        shares: 250000,
        ownership: 20.0,
        status: "active",
        type: "institution",
        phone: "+1 (555) 456-7890",
        address: "789 Tech Blvd, Suite 500, Austin, TX 78701",
        joinDate: "2020-01-10",
        memberSince: 4,
        shareValue: 125.50,
        totalValue: 250000 * 125.50,
        votingPower: 20.0,
        votingHistory: {
            totalVotes: 28,
            participation: 100,
            accuracy: 95,
            lastVote: "2024-11-18"
        },
        transactions: [
            { date: "2024-09-30", type: "Purchase", shares: 50000, price: 124.20, total: 6210000 },
            { date: "2024-06-30", type: "Dividend", shares: 0, price: 0, total: 37500 },
            { date: "2024-03-15", type: "Purchase", shares: 75000, price: 120.80, total: 9060000 },
        ],
        documents: ["Corporate Share Certificate", "Board Resolution", "Proxy Agreement"]
    },
    {
        id: "4",
        name: "Robert Johnson",
        email: "robert@example.com",
        shares: 3500,
        ownership: 0.28,
        status: "inactive",
        type: "individual",
        phone: "+1 (555) 234-5678",
        address: "321 Pine Rd, Seattle, WA 98101",
        joinDate: "2023-02-28",
        memberSince: 1,
        shareValue: 125.50,
        totalValue: 3500 * 125.50,
        votingPower: 0.28,
        votingHistory: {
            totalVotes: 5,
            participation: 25,
            accuracy: 60,
            lastVote: "2024-05-10"
        },
        transactions: [
            { date: "2024-02-28", type: "Purchase", shares: 3500, price: 121.50, total: 425250 },
            { date: "2024-05-10", type: "Sale", shares: 500, price: 124.30, total: -62150 },
        ],
        documents: ["Share Certificate"]
    },
];

export default function ShareholderDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const shareholder = shareholders.find(s => s.id === id);

    if (!shareholder) {
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

    const tenureYears = shareholder.memberSince;
    const totalVotes = shareholder.votingHistory.totalVotes;

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
                            <AvatarImage src={`/avatars/${shareholder.id}.png`} alt={shareholder.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl">
                                {shareholder.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900">{shareholder.name}</h1>
                                <Badge className={`${shareholder.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}>
                                    {shareholder.status.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <Badge variant="outline" className={`${shareholder.type === 'institution' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'} gap-1.5`}>
                                    {shareholder.type === 'institution' ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                    {shareholder.type.charAt(0).toUpperCase() + shareholder.type.slice(1)}
                                </Badge>
                                <span className="text-sm text-gray-500">ID: SH-{shareholder.id.padStart(4, '0')}</span>
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
                            <div className="text-3xl font-bold text-gray-900">
                                {shareholder.shares.toLocaleString()}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{shareholder.ownership}% ownership</span>
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
                            <div className="text-3xl font-bold text-gray-900">
                                ${(shareholder.totalValue / 1000).toFixed(1)}K
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">${shareholder.shareValue.toFixed(2)} per share</span>
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
                            <div className="text-3xl font-bold text-gray-900">
                                {shareholder.votingPower}%
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
                            <div className="text-3xl font-bold text-gray-900">
                                {tenureYears} {tenureYears === 1 ? 'Year' : 'Years'}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Since {shareholder.joinDate}</span>
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
                                        <div className="font-medium text-gray-900">{shareholder.phone}</div>
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            Address
                                        </div>
                                        <div className="font-medium text-gray-900">{shareholder.address}</div>
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
                                            <span className="font-bold text-gray-900">{shareholder.votingHistory.participation}%</span>
                                        </div>
                                        <Progress
                                            value={shareholder.votingHistory.participation}
                                            className="h-2"
                                            indicatorClassName="bg-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Voting Accuracy</span>
                                            <span className="font-bold text-gray-900">{shareholder.votingHistory.accuracy}%</span>
                                        </div>
                                        <Progress
                                            value={shareholder.votingHistory.accuracy}
                                            className="h-2"
                                            indicatorClassName="bg-emerald-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="text-center p-3 rounded-lg bg-gray-50">
                                        <div className="text-2xl font-bold text-gray-900">{totalVotes}</div>
                                        <div className="text-xs text-gray-600">Total Votes</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-gray-50">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {new Date(shareholder.votingHistory.lastVote).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                                How {shareholder.name}'s holdings compare to other shareholders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">{shareholder.name}'s Holdings</span>
                                        <span className="font-bold text-gray-900">{shareholder.ownership}%</span>
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
                                Detailed record of all votes cast by {shareholder.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border border-gray-200 p-4 text-center">
                                <Vote className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <h4 className="font-medium text-gray-900 mb-2">Voting History Details</h4>
                                <p className="text-sm text-gray-600 max-w-md mx-auto">
                                    View all voting records, including proposal details, votes cast, and outcomes for {shareholder.name}.
                                </p>
                                <Button className="mt-4" variant="outline">
                                    View Full Voting History
                                </Button>
                            </div>
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
                                {shareholder.transactions.map((transaction, index) => (
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {shareholder.documents.map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{doc}</div>
                                                <div className="text-sm text-gray-500">PDF • 2.4 MB</div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            Download
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}