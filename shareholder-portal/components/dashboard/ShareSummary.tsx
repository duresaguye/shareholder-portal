"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, DollarSign, PieChart, TrendingUp } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/useShareholders";

export function ShareSummary() {
    const { data, isLoading, error } = useCurrentUser();
    
    const shareholder = data?.shareholder;
    const totalShares = shareholder?.totalShares || 0;
    const ownership = shareholder?.ownership || 0;
    
    // Calculate total shares in the system (assuming 1,000,000 for now)
 //fix? later replace with actual data from API
    const totalSystemShares = 1000000;
    const ownershipPercentage = totalSystemShares > 0 
        ? ((totalShares / totalSystemShares) * 100).toFixed(2)
        : "0.00";

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-2xl font-bold">Loading...</div>
                    ) : error ? (
                        <div className="text-2xl font-bold text-red-500">Error</div>
                    ) : (
                        <>
                            <div className="text-2xl font-bold">{totalShares.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {shareholder?.type === 'institution' ? 'Institutional Holdings' : 'Class A Common Stock'}
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">% Ownership</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-2xl font-bold">Loading...</div>
                    ) : error ? (
                        <div className="text-2xl font-bold text-red-500">Error</div>
                    ) : (
                        <>
                            <div className="text-2xl font-bold">{ownershipPercentage}%</div>
                            <p className="text-xs text-muted-foreground">
                                of {totalSystemShares.toLocaleString()} total shares
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Dividends</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$12,450</div>
                    <p className="text-xs text-muted-foreground">
                        Lifetime earnings
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-xs text-muted-foreground">
                        Awaiting approval
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
