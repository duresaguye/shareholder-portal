"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Send } from "lucide-react";

export default function MessagesPage() {
    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm">
                Coming soon: messaging will connect to live conversations. Current content is placeholder.
            </div>
            <div className="flex h-[calc(100vh-8rem)] gap-6">
                <Card className="w-80 flex flex-col">
                <CardHeader className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search messages..."
                            className="pl-9"
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                    <div className="flex flex-col">
                        {[1, 2, 3].map((i) => (
                            <button
                                key={i}
                                className={`flex flex-col gap-1 border-b p-4 text-left hover:bg-gray-50 ${i === 1 ? "bg-blue-50" : ""
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">John Doe</span>
                                    <span className="text-xs text-gray-500">10:30 AM</span>
                                </div>
                                <p className="line-clamp-1 text-sm text-gray-600">
                                    Regarding the upcoming board meeting agenda...
                                </p>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="flex-1 flex flex-col">
                <CardHeader className="border-b p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200" />
                        <div>
                            <CardTitle className="text-base">John Doe</CardTitle>
                            <div className="text-xs text-green-600">Online</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex justify-end">
                        <div className="bg-primary text-white rounded-lg py-2 px-4 max-w-[70%]">
                            Hi John, thanks for reaching out.
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 rounded-lg py-2 px-4 max-w-[70%]">
                            Regarding the upcoming board meeting agenda, I wanted to propose adding a discussion on the new expansion plan.
                        </div>
                    </div>
                </CardContent>
                <div className="p-4 border-t">
                    <form className="flex gap-2">
                        <Input placeholder="Type your message..." className="flex-1" />
                        <Button type="submit" size="icon">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </Card>
            </div>
        </div>
    );
}
