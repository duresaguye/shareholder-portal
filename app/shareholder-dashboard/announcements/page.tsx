"use client";

import { useState } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";

type Announcement = {
    id: number;
    title: string;
    content: string;
    author: string;
    role: string;
    date: string;
    timeAgo: string;
    priority: "high" | "medium" | "low";
    category: string;
};

const initialAnnouncements: Announcement[] = [
    {
        id: 1,
        title: "Q4 2023 Earnings Call Scheduled",
        content: "We are pleased to announce that our Q4 2023 earnings call will be held on January 25th at 2:00 PM EST. All shareholders are invited to attend. The call will cover financial results, strategic initiatives, and outlook for 2024. Dial-in details and webinar link have been sent via email.",
        author: "John Smith",
        role: "CEO",
        date: "2024-01-08",
        timeAgo: "2 days ago",
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
        priority: "high",
        category: "Financial"
    }
];

export default function ShareholderAnnouncementsPage() {
    const [announcements] = useState<Announcement[]>(initialAnnouncements);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const handleViewAnnouncement = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsViewModalOpen(true);
    };

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
            {/* View Announcement Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white rounded-xl shadow-2xl">
                    {selectedAnnouncement && (
                        <>
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white z-50 p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedAnnouncement.priority)}`}>
                                                {selectedAnnouncement.priority.charAt(0).toUpperCase() + selectedAnnouncement.priority.slice(1)} Priority
                                            </div>
                                            <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                                                {selectedAnnouncement.category}
                                            </div>
                                        </div>
                                        <DialogTitle className="text-3xl font-bold text-gray-900 leading-tight">
                                            {selectedAnnouncement.title}
                                        </DialogTitle>
                                        <DialogDescription className="text-gray-600 flex items-center gap-4">
                                            <span className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                {selectedAnnouncement.author} • {selectedAnnouncement.role}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {selectedAnnouncement.date}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {selectedAnnouncement.timeAgo}
                                            </span>
                                        </DialogDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsViewModalOpen(false)}
                                        className="rounded-full h-10 w-10 hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                        <span className="sr-only">Close</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-8">
                                {/* Author Info */}
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                                            {selectedAnnouncement.author.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-lg text-gray-900">{selectedAnnouncement.author}</p>
                                        <p className="text-sm text-gray-600">{selectedAnnouncement.role}</p>
                                        <p className="text-sm text-gray-500 mt-1">Author of this announcement</p>
                                    </div>
                                </div>

                                {/* Announcement Content */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Announcement Details</h3>
                                        <div className="prose prose-lg max-w-none">
                                            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                                                {selectedAnnouncement.content.split('\n').map((paragraph, index) => (
                                                    <p key={index} className="mb-4 last:mb-0">
                                                        {paragraph}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                        <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <Megaphone className="h-4 w-4" />
                                                Priority Level
                                            </h4>
                                            <p className={`font-bold ${selectedAnnouncement.priority === 'high' ? 'text-rose-600' : selectedAnnouncement.priority === 'medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                {selectedAnnouncement.priority.toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Published Date
                                            </h4>
                                            <p className="font-bold text-gray-800">{selectedAnnouncement.date}</p>
                                            <p className="text-sm text-gray-600">{selectedAnnouncement.timeAgo}</p>
                                        </div>
                                        <div className="space-y-2 p-4 bg-emerald-50 rounded-lg">
                                            <h4 className="font-semibold text-gray-900">Category</h4>
                                            <p className="font-bold text-emerald-700">{selectedAnnouncement.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => setIsViewModalOpen(false)}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                                    >
                                        Close Announcement
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

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
                                        onClick={() => handleViewAnnouncement(announcement)}
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}