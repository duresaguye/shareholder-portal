"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, TrendingUp, Vote, FileCheck, Calendar } from "lucide-react";
import { useProposals } from "@/lib/hooks/useProposals";
import { useCurrentUser } from "@/lib/hooks/useShareholders";
import { useMemo } from "react";

export function HistorySection() {
    const { data: userData } = useCurrentUser();
    const currentUserId = userData?.shareholder.id;

    const { data: proposalsData, isLoading: loadingProposals } = useProposals();
    const proposals = proposalsData?.proposals ?? [];

    const votes = useMemo(() => {
        if (!currentUserId) return [];
        return proposals
            .flatMap((p: any) =>
                (p.votes || [])
                    .filter((v: any) => v.voterId === currentUserId || v.shareholderId === currentUserId)
                    .map((v: any) => ({
                        id: `${p.id}-${v.id}`,
                        date: v.createdAt ? new Date(v.createdAt).toISOString().split("T")[0] : "—",
                        proposal: p.title ?? p.description ?? "Proposal",
                        vote: v.vote?.toLowerCase?.() ?? "—",
                        result: p.status ?? "pending",
                    }))
            )
            .slice(0, 10);
    }, [currentUserId, proposals]);

    // No purchase/doc endpoints yet
    const purchases: any[] = [];
    const documents: any[] = [];

    return (
        <Card className="col-span-4 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">History & Documents</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Track your investment journey, voting activity, and important documents
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export All
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <Tabs defaultValue="purchases" className="space-y-6">
                    <TabsList className="bg-gray-100 p-1 rounded-xl w-full max-w-md">
                        <TabsTrigger value="purchases" className="rounded-lg data-[state=active]:bg-white gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Share History
                        </TabsTrigger>
                        <TabsTrigger value="voting" className="rounded-lg data-[state=active]:bg-white gap-2">
                            <Vote className="h-4 w-4" />
                            Voting History
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-white gap-2">
                            <FileCheck className="h-4 w-4" />
                            Documents
                        </TabsTrigger>
                    </TabsList>

                    {/* Share History Tab */}
                    <TabsContent value="purchases" className="space-y-4">
                        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                            <div className="p-4 border-b bg-gray-50/50">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    Transaction History
                                </h3>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold text-gray-700">Date</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Transaction</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Shares</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Price/Share</TableHead>
                                        <TableHead className="font-semibold text-gray-700 text-right">Total Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {purchases.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-6 text-center text-gray-500">
                                                Coming soon — purchase history will appear here.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Voting History Tab */}
                    <TabsContent value="voting" className="space-y-4">
                        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                            <div className="p-4 border-b bg-gray-50/50">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Vote className="h-5 w-5 text-emerald-600" />
                                    Voting Activity
                                </h3>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold text-gray-700">Date</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Proposal</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Your Vote</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Result</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingProposals && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-6 text-center text-gray-500">
                                                Loading voting history...
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {!loadingProposals && votes.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-6 text-center text-gray-500">
                                                {proposals.length === 0
                                                    ? "Coming soon — voting history will show once available."
                                                    : "No votes recorded yet for your account."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {votes.map((vote) => (
                                        <TableRow key={vote.id} className="group hover:bg-gray-50/80 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    {vote.date}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900">{vote.proposal}</TableCell>
                                            <TableCell>
                                                <Badge className={`
                          ${vote.vote === 'yes' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200' : 'bg-rose-500/10 text-rose-700 border-rose-200'}
                          font-medium
                        `}>
                                                    {vote.vote === 'yes' ? '✓ Yes' : '✗ No'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`
                          ${vote.result === 'approved' ? 'text-emerald-700 border-emerald-300' : 'text-rose-700 border-rose-300'}
                          font-medium
                        `}>
                                                    {vote.result.charAt(0).toUpperCase() + vote.result.slice(1)}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="space-y-4">
                        {documents.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-10 text-center text-gray-600">
                                Coming soon — documents will be available once connected to the backend.
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {documents.map((doc) => (
                                        <Card key={doc.id} className="group border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white">
                                                        <FileText className="h-6 w-6" />
                                                    </div>
                                                    <div className="space-y-1 flex-1">
                                                        <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
                                                            {doc.title}
                                                        </CardTitle>
                                                        <div className="flex items-center justify-between">
                                                            <CardDescription className="text-sm">{doc.type}</CardDescription>
                                                            <span className="text-xs text-gray-500">{doc.size}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4" />
                                                        {doc.date}
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-2 border-gray-300 hover:bg-gray-50"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                <div className="pt-4 border-t">
                                    <Button variant="ghost" className="w-full gap-2 text-gray-600 hover:text-gray-900">
                                        <FileText className="h-4 w-4" />
                                        View All Documents
                                    </Button>
                                </div>
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}