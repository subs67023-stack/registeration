"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    UserPlus,
    Users,
    LogOut,
    ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();
    const isAdmin = user.role === "ADMIN";

    const adminLinks = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Registrations", href: "/admin/registrations", icon: ClipboardList },
        { name: "Manage Subadmins", href: "/admin/users", icon: Users },
    ];

    const subadminLinks = [
        { name: "Dashboard", href: "/subadmin", icon: LayoutDashboard },
        { name: "New Registration", href: "/subadmin/new", icon: UserPlus },
    ];

    const links = isAdmin ? adminLinks : subadminLinks;

    return (
        <div className="w-64 bg-indigo-900 text-white flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-bold tracking-tight text-white">RegManager</h2>
                <p className="text-xs text-indigo-300 uppercase mt-1">
                    {user.role} Portal
                </p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                                pathname === link.href
                                    ? "bg-indigo-700 text-white"
                                    : "text-indigo-100 hover:bg-indigo-800"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-indigo-800">
                <div className="flex items-center space-x-3 mb-4 px-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                        {user.name?.[0] || "U"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-indigo-300 truncate">{user.email}</p>
                    </div>
                </div>
                <Button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    variant="ghost"
                    className="w-full justify-start text-indigo-100 hover:bg-indigo-800 hover:text-white px-3"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
