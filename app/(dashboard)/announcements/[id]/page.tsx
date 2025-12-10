"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeft, Calendar, Eye, Share2, Megaphone, Edit, Trash2 } from "lucide-react";

// Duplicated mock data for demo purposes
const announcements = [
    {
        id: 1,
        title: "Q4 2023 Earnings Call Scheduled",
        content: "We are pleased to announce that our Q4 2023 earnings call will be held on January 25th at 2:00 PM EST. All shareholders are invited to attend. The call will cover financial results, strategic initiatives, and outlook for 2024. Dial-in details and webinar link have been sent via email.",
        author: "John Smith",
        role: "CEO",
        date: "2024-01-08",
        timeAgo: "2 days ago",
        views: 245,
        shares: 42,
        priority: "high",
        category: "Financial"
    },
    {
        id: 2,
        title: "Annual Shareholder Meeting Announcement",
        content: "Mark your calendars! The Annual General Meeting will take place on March 15th, 2024. We'll be discussing important matters including board elections, executive compensation, and strategic direction. Proxy materials will be mailed to all registered shareholders by February 1st.",
        author: "Sarah Johnson",
        role: "Corporate Secretary",
        date: "2024-01-05",
        timeAgo: "5 days ago",
        views: 189,
        shares: 28,
        priority: "medium",
        category: "Governance"
    },
    {
        id: 3,
        title: "New Board Member Appointment",
        content: "We're excited to announce the appointment of Dr. Emily Chen to our Board of Directors. Dr. Chen brings 20+ years of experience in technology and venture capital. Her expertise will be invaluable as we expand our market presence in the Asia-Pacific region.",
        author: "Robert Williams",
        role: "Board Chairman",
        date: "2023-12-28",
        timeAgo: "2 weeks ago",
        views: 312,
        shares: 56,
        priority: "medium",
        category: "Corporate"
    },
    {
        id: 4,
        title: "Dividend Payment Schedule Update",
        content: "The Q4 dividend payment has been scheduled for January 31st, 2024. All shareholders of record as of January 15th will receive $0.25 per share. Payments will be distributed electronically to registered shareholders.",
        author: "Michael Brown",
        role: "CFO",
        date: "2023-12-20",
        timeAgo: "3 weeks ago",
        views: 421,
        shares: 67,
        priority: "high",
        category: "Financial"
    }
];

export default function AnnouncementDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [announcement, setAnnouncement] = useState<typeof announcements[0] | null>(null);

    useEffect(() => {
        if (params.id) {
            const found = announcements.find(a => a.id === parseInt(params.id as string));
            setAnnouncement(found || null);
        }
    }, [params.id]);

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
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="outline" className="gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200">
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
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


                </CardContent>
            </Card>
        </div>
    );
}
