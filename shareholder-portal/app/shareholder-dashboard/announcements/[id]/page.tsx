"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Megaphone } from "lucide-react";
import { announcementsApi, type Announcement } from "@/lib/api/announcements";

export default function ShareholderAnnouncementDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            if (!params.id) return;
            try {
                setIsLoading(true);
                const data = await announcementsApi.getById(params.id as string);
                setAnnouncement(data);
            } catch (err) {
                setAnnouncement(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnnouncement();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-500">
                Loading announcement...
            </div>
        );
    }

    if (!announcement) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <p className="text-gray-500">Announcement not found</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Button
                variant="ghost"
                className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Announcements
            </Button>

            <div className="flex items-start justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge className={`${announcement.priority === 'high'
                            ? 'bg-rose-500'
                            : announcement.priority === 'medium'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            } text-white gap-1.5`}>
                            <Megaphone className="h-3 w-3" />
                            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50 text-gray-700">
                            {announcement.category}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {announcement.title}
                    </h1>
                </div>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg">
                                    {announcement.author.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold text-gray-900">{announcement.author}</div>
                                <div className="text-sm text-gray-500">{announcement.role}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">{announcement.date}</span>
                            </div>
                            <div className="text-sm text-gray-500">{announcement.timeAgo}</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                    <div className="prose prose-gray max-w-none">
                        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                            {announcement.content}
                        </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Megaphone className="h-4 w-4" />
                                Priority Level
                            </h4>
                            <p className={`font-bold ${announcement.priority === 'high' ? 'text-rose-600' : announcement.priority === 'medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {announcement.priority.toUpperCase()}
                            </p>
                        </div>
                        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Published Date
                            </h4>
                            <p className="font-bold text-gray-800">{announcement.date}</p>
                            <p className="text-sm text-gray-600">{announcement.timeAgo}</p>
                        </div>
                        <div className="space-y-2 p-4 bg-emerald-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900">Category</h4>
                            <p className="font-bold text-emerald-700">{announcement.category}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

