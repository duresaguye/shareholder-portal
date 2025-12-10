"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    PieChart,
    Vote,
    DollarSign,
    FileText,
    FolderOpen,
    MessageSquare,
    Megaphone,
    Settings,
    LogOut,
    User,
} from "lucide-react";

const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Dashboard", href: "/shareholder-dashboard", icon: User },
    { name: "Shareholders", href: "/shareholders", icon: Users },
    { name: "Shares", href: "/shares", icon: PieChart },
    { name: "Voting", href: "/voting", icon: Vote },
    { name: "Dividends", href: "/dividends", icon: DollarSign },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Documents", href: "/documents", icon: FolderOpen },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Announcements", href: "/announcements", icon: Megaphone },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
}

export function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className={cn(
            "fixed inset-y-0 left-0 z-30 flex h-full flex-col border-r border-border bg-white shadow-sm transition-all duration-300 ease-in-out lg:translate-x-0",
            isCollapsed ? "w-20" : "w-64",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className={cn(
                "flex h-16 items-center border-b border-border px-6",
                isCollapsed ? "justify-center px-0" : "justify-between"
            )}>
                <h1 className={cn(
                    "font-bold text-primary transition-all duration-300",
                    isCollapsed ? "text-2xl" : "text-xl"
                )}>
                    {isCollapsed ? "P" : "Portal"}
                </h1>
                <button
                    onClick={onCloseMobile}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                    <LogOut className="h-5 w-5 rotate-180" />
                </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                        isCollapsed && "justify-center px-2"
                                    )}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {!isCollapsed && <span>{item.name}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="border-t border-border p-4">
                <button className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50",
                    isCollapsed && "justify-center px-2"
                )}>
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>Sign Out</span>}
                </button>
            </div>
        </div>
    );
}
