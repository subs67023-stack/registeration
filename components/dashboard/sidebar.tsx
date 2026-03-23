"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    UserPlus,
    Users,
    LogOut,
    ClipboardList,
    BarChart3,
    Menu,
    Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import Image from "next/image";

export default function Sidebar({ user, mobile = false }: { user: any; mobile?: boolean }) {
    const pathname = usePathname();
    const isAdmin = user.role === "ADMIN";

    const adminLinks = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { name: "New Registration", href: "/admin/new", icon: UserPlus },
        { name: "Free Kit", href: "/admin/free-kit", icon: Package },
        { name: "Registrations", href: "/admin/registrations", icon: ClipboardList },
        { name: "Manage Subadmins", href: "/admin/users", icon: Users },
    ];

    const subadminLinks = [
        { name: "Dashboard", href: "/subadmin", icon: LayoutDashboard },
        { name: "New Registration", href: "/subadmin/new", icon: UserPlus },
    ];

    const links = isAdmin ? adminLinks : subadminLinks;

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-rotaract-blue text-white font-sans">
            <div className="p-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-rotaract-gold">
                    {/* Logo placeholder - User should upload to /public/logo.png */}
                    <Image
                        src="/logo-new.jpg"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                        onError={(e) => {
                            // Fallback to text if image not found
                            (e.target as any).style.display = 'none';
                            const parent = (e.target as any).parentElement;
                            if (parent) parent.innerHTML = '<span class="text-rotaract-red font-bold text-lg">R</span>';
                        }}
                    />
                </div>
                <div>
                    <h2 className="text-xl font-black tracking-tighter text-white leading-none uppercase">Rotaract</h2>
                    <p className="text-[10px] text-rotaract-gold font-bold uppercase mt-1 tracking-widest">
                        {user.role} Portal
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all text-sm font-bold",
                                pathname === link.href
                                    ? "bg-white text-rotaract-blue shadow-lg scale-[1.02]"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 bg-black/10">
                <div className="flex items-center space-x-3 mb-4 px-3">
                    <div className="w-10 h-10 rounded-full bg-rotaract-red border-2 border-white/20 flex items-center justify-center text-sm font-black shadow-lg">
                        {user.name?.[0] || "U"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-black truncate text-white uppercase tracking-tight">{user.name}</p>
                        <p className="text-[10px] text-rotaract-gold truncate font-bold opacity-80">{user.email}</p>
                    </div>
                </div>
                <Button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    variant="secondary"
                    className="w-full justify-start bg-white/10 hover:bg-rotaract-red text-white border-none transition-all duration-300 h-12 px-3 rounded-xl mb-2"
                >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span className="font-bold uppercase text-xs tracking-widest">Sign Out</span>
                </Button>
            </div>
        </div>
    );

    if (mobile) {
        return <SidebarContent />;
    }

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-white/10 shadow-2xl">
            <SidebarContent />
        </aside>
    );
}
