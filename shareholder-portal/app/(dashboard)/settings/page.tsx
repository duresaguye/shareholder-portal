"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/lib/hooks/useShareholders";

export default function SettingsPage() {
    const { data: currentUserData } = useCurrentUser();

    const admin = currentUserData?.shareholder;
    const adminName = admin ? `${admin.firstName} ${admin.lastName}` : "Admin";

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Settings
            </h2>

            {/* Settings Content Grid */}
            <div className="grid gap-6">

                {/* Company Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                        <CardDescription>
                            View your company details and public profile
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Company Details Display */}
                        <div className="space-y-6">

                            <div className="grid gap-6 md:grid-cols-2">


                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-gray-500">
                                        Company Name
                                    </div>
                                    <div className="text-lg font-semibold">
                                        {adminName}
                                    </div>
                                </div>


                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-gray-500">
                                        Contact Email
                                    </div>
                                    <div className="text-lg font-semibold">
                                        {admin?.email || "Not available"}
                                    </div>
                                </div>


                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-gray-500">
                                        Phone Number
                                    </div>
                                    <div className="text-lg font-semibold">
                                        {admin?.phone || "Not available"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}