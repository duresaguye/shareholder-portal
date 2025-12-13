"use client";

import { useState, useEffect } from "react";
import { ShareholderSidebar } from "./ShareholderSidebar";
import { ShareholderTopBar } from "./ShareholderTopBar";
import { cn } from "@/lib/utils";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

export function ShareholderLayout({ children }: { children: React.ReactNode }) {
    const { isAuthorized, isChecking } = useRequireAuth("shareholder");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Persist collapsed state
    useEffect(() => {
        const saved = localStorage.getItem("shareholderSidebarCollapsed");
        if (saved) {
            setIsCollapsed(JSON.parse(saved));
        }
    }, []);

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("shareholderSidebarCollapsed", JSON.stringify(newState));
    };

    if (isChecking) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-600">
                Checking access...
            </div>
        );
    }

    if (!isAuthorized) {
        // Redirect handled by useRequireAuth
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-surface">
            <ShareholderSidebar
                isCollapsed={isCollapsed}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
            />

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div className={cn(
                "flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out",
                isCollapsed ? "lg:ml-20" : "lg:ml-64"
            )}>
                <ShareholderTopBar
                    isCollapsed={isCollapsed}
                    onToggleCollapse={toggleCollapse}
                    onMobileMenuClick={() => setIsMobileOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
