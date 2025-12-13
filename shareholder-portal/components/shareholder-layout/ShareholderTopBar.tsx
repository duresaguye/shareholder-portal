"use client";

import { Bell, Menu, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/useShareholders";

interface ShareholderTopBarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onMobileMenuClick: () => void;
}

export function ShareholderTopBar({ isCollapsed, onToggleCollapse, onMobileMenuClick }: ShareholderTopBarProps) {
    const { data } = useCurrentUser();
    const user = data?.shareholder;
    const displayName = user
        ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username
        : "Shareholder User";
    const email = user?.email ?? "shareholder@company.com";

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6 shadow-sm">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMobileMenuClick}
                    className="mr-2 text-gray-500 hover:text-gray-700 lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Desktop Sidebar Toggle */}
                <button
                    onClick={onToggleCollapse}
                    className="hidden items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:flex"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <>
                            <ChevronRight className="h-5 w-5" />
                            <span className="text-sm font-medium">Show Menu</span>
                        </>
                    ) : (
                        <>
                            <ChevronLeft className="h-5 w-5" />
                            <span className="text-sm font-medium">Hide Menu</span>
                        </>
                    )}
                </button>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button
                    className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                    <div className="hidden flex-col items-end sm:flex">
                        <span className="text-sm font-medium text-gray-900">{displayName}</span>
                        <span className="text-xs text-gray-500">{email}</span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <User className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </header>
    );
}
