"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Settings
            </h2>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                        <CardDescription>
                            Manage your company details and public profile
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Company Name</Label>
                                    <Input id="companyName" defaultValue="Acme Inc." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input id="website" defaultValue="https://acme.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Contact Email</Label>
                                    <Input id="email" defaultValue="contact@acme.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" defaultValue="+1 (555) 000-0000" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>


            </div>
        </div>
    );
}
