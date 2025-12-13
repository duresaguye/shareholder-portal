"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";
import {
    LayoutDashboard,
    LogOut,
    Megaphone,
    FileText,
    ArrowRightLeft,
} from "lucide-react";

const menuItems = [
    { name: "Dashboard", href: "/shareholder-dashboard", icon: LayoutDashboard },
    { name: "Announcements", href: "/shareholder-dashboard/announcements", icon: Megaphone },
    { name: "Active Proposals", href: "/shareholder-dashboard#active-proposals", icon: FileText },
    { name: "Transfer Requests", href: "/shareholder-dashboard#transfer-requests", icon: ArrowRightLeft },
];

interface ShareholderSidebarProps {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
}

export function ShareholderSidebar({ isCollapsed, isMobileOpen, onCloseMobile }: ShareholderSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [currentHash, setCurrentHash] = useState("");

    const handleLogout = () => {
        authApi.logout();
        // Force a hard redirect to ensure all state is cleared
        window.location.href = '/login';
    };

    useEffect(() => {
        // Set initial hash
        setCurrentHash(window.location.hash);

        // Update hash on change
        const handleHashChange = () => {
            setCurrentHash(window.location.hash);
        };

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    // Also update hash when clicking links (since next/link might not trigger hashchange immediately in all cases)
    const handleLinkClick = (href: string) => {
        if (href.includes("#")) {
            setCurrentHash(href.substring(href.indexOf("#")));
        } else {
            setCurrentHash("");
        }
        if (window.innerWidth < 1024) {
            onCloseMobile();
        }
    };

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
                        // Check if item is active
                        let isActive = false;
                        if (item.href.includes("#")) {
                            // For hash links, exact match of path and hash
                            const [path, hash] = item.href.split("#");
                            isActive = pathname === path && currentHash === `#${hash}`;
                        } else {
                            // For non-hash links
                            if (item.href === "/shareholder-dashboard") {
                                // Dashboard is active only if no hash is present (or empty hash)
                                isActive = pathname === item.href && (!currentHash || currentHash === "");
                            } else {
                                // Other pages (like announcements)
                                isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                            }
                        }

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    onClick={() => handleLinkClick(item.href)}
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
                <button 
                    onClick={handleLogout}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50",
                        isCollapsed && "justify-center px-2"
                    )}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>Sign Out</span>}
                </button>
            </div>
        </div>
    );
}
