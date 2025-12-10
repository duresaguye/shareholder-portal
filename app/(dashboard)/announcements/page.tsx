"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Megaphone, Plus, Calendar, Eye, MoreVertical, Send, X, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
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

export default function AnnouncementsPage() {
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        role: "",
        content: "",
        category: "General",
        priority: "medium" as "high" | "medium" | "low",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const getTimeAgo = (date: Date) => {
            const now = new Date();
            const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

            if (diffInHours < 1) return "Just now";
            if (diffInHours < 24) return `${diffInHours} hours ago`;
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays === 1) return "1 day ago";
            if (diffInDays < 7) return `${diffInDays} days ago`;
            if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
            return `${Math.floor(diffInDays / 30)} months ago`;
        };

        const now = new Date();
        const newAnnouncement: Announcement = {
            id: announcements.length + 1,
            title: formData.title,
            content: formData.content,
            author: formData.author || "Admin User",
            role: formData.role || "Administrator",
            date: now.toISOString().split('T')[0],
            timeAgo: getTimeAgo(now),
            priority: formData.priority,
            category: formData.category,
        };

        setAnnouncements(prev => [newAnnouncement, ...prev]);

        // Reset form and close modal
        setFormData({
            title: "",
            author: "",
            role: "",
            content: "",
            category: "General",
            priority: "medium",
        });
        setIsSubmitting(false);
        setIsCreateModalOpen(false);
    };

    const handleViewAnnouncement = (id: number) => {
        router.push(`/announcements/${id}`);
    };

    const handleDeleteAnnouncement = (id: number) => {
        setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    };

    const handleEditAnnouncement = (id: number) => {
        const announcement = announcements.find(ann => ann.id === id);
        if (announcement) {
            setFormData({
                title: announcement.title,
                author: announcement.author,
                role: announcement.role,
                content: announcement.content,
                category: announcement.category,
                priority: announcement.priority,
            });
            setIsCreateModalOpen(true);
        }
    };

    return (
        <div className="space-y-8">
            {/* Create Announcement Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900">Create New Announcement</DialogTitle>
                                <DialogDescription className="text-gray-600 mt-2">
                                    Create a new announcement for all shareholders
                                </DialogDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <form onSubmit={handleCreateAnnouncement} className="space-y-6 pt-4">
                        <div className="space-y-3">
                            <Label htmlFor="title" className="text-gray-700 font-medium">
                                Title <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g., Important Company Update"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="h-11 rounded-lg border-gray-300 focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label htmlFor="author" className="text-gray-700 font-medium">
                                    Author Name <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="author"
                                    name="author"
                                    placeholder="e.g., John Doe"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    required
                                    className="h-11 rounded-lg border-gray-300 focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="role" className="text-gray-700 font-medium">
                                    Author Role
                                </Label>
                                <Input
                                    id="role"
                                    name="role"
                                    placeholder="e.g., Administrator"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="h-11 rounded-lg border-gray-300 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label htmlFor="category" className="text-gray-700 font-medium">
                                    Category
                                </Label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => handleSelectChange("category", e.target.value)}
                                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="General">General</option>
                                    <option value="Financial">Financial</option>
                                    <option value="Governance">Governance</option>
                                    <option value="Corporate">Corporate</option>
                                    <option value="Operational">Operational</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="priority" className="text-gray-700 font-medium">
                                    Priority
                                </Label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={(e) => handleSelectChange("priority", e.target.value)}
                                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="content" className="text-gray-700 font-medium">
                                Content <span className="text-rose-500">*</span>
                            </Label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                className="flex min-h-[200px] w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                placeholder="Write your announcement here..."
                                required
                            />
                        </div>

                        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                    disabled={isSubmitting}
                                >
                                    <Send className="h-4 w-4" />
                                    {isSubmitting ? "Publishing..." : "Publish Announcement"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                    <p className="text-gray-600 mt-2">
                        Create and manage announcements for shareholders
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                    <Plus className="h-4 w-4" />
                    New Announcement
                </Button>
            </div>

            {/* Announcements List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">All Announcements</h2>
                    <Badge className="bg-blue-500 text-white">
                        {announcements.length} Total
                    </Badge>
                </div>

                <div className="grid gap-6">
                    {announcements.map((announcement) => (
                        <Card key={announcement.id} className="group border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Badge className={`${announcement.priority === 'high'
                                                ? 'bg-rose-500 hover:bg-rose-600'
                                                : announcement.priority === 'medium'
                                                    ? 'bg-amber-500 hover:bg-amber-600'
                                                    : 'bg-emerald-500 hover:bg-emerald-600'
                                                } text-white gap-1.5`}>
                                                <Megaphone className="h-3 w-3" />
                                                {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                                            </Badge>
                                            <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                                {announcement.category}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {announcement.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-xs">
                                                        {announcement.author.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <span className="font-medium text-gray-900">{announcement.author}</span>
                                                    <span className="text-gray-500 ml-2">{announcement.role}</span>
                                                </div>
                                            </div>
                                            <Separator orientation="vertical" className="h-4" />
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{announcement.date}</span>
                                                <span className="text-gray-400">•</span>
                                                <span>{announcement.timeAgo}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem onClick={() => handleViewAnnouncement(announcement.id)}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEditAnnouncement(announcement.id)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-rose-600"
                                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <p className="text-gray-600 leading-relaxed line-clamp-2">
                                    {announcement.content}
                                </p>

                                <Separator />

                                <div className="flex items-center justify-between text-sm">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handleViewAnnouncement(announcement.id)}
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