"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Megaphone, Calendar, Eye, X, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { announcementsApi, type Announcement } from "@/lib/api/announcements";

export default function ShareholderAnnouncementsPage() {
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setIsLoading(true);
                const data = await announcementsApi.getAll();
                setAnnouncements(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load announcements");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-rose-500 text-white border-rose-600';
            case 'medium':
                return 'bg-amber-500 text-white border-amber-600';
            case 'low':
                return 'bg-emerald-500 text-white border-emerald-600';
            default:
                return 'bg-blue-500 text-white border-blue-600';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                    <p className="text-gray-600 mt-2">
                        Stay updated with the latest company news and announcements
                    </p>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">All Announcements</h2>
                    <Badge className="bg-blue-500 text-white text-sm py-1.5 px-3">
                        {announcements.length} Total
                    </Badge>
                </div>

                {error && (
                    <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-4 py-3">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-gray-500">Loading announcements...</div>
                ) : (
                    <div className="grid gap-6">
                        {announcements.map((announcement) => (
                            <Card key={announcement.id} className="group border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                                <CardHeader className="pb-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(announcement.priority)}`}>
                                                {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                                            </div>
                                            <Badge variant="outline" className="bg-white text-gray-700 border-gray-300">
                                                {announcement.category}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {announcement.title}
                                        </CardTitle>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border">
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-xs text-white">
                                                        {announcement.author.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <span className="font-medium text-gray-900">{announcement.author}</span>
                                                    <span className="text-gray-500 ml-2">{announcement.role}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>{announcement.date}</span>
                                                </div>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{announcement.timeAgo}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <p className="text-gray-600 leading-relaxed line-clamp-2">
                                        {announcement.content}
                                    </p>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                                            onClick={() => router.push(`/shareholder-dashboard/announcements/${announcement.id}`)}
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}