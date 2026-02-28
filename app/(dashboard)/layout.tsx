import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/dashboard/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Logo from "@/components/logo";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/50">
            {/* Sidebar for Desktop */}
            <Sidebar user={session.user} />

            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-indigo-900 text-white sticky top-0 z-40 shadow-md">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden border border-indigo-300">
                        <Logo width={32} height={32} textClassName="text-indigo-900 font-bold text-sm" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Rotaract</span>
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-indigo-800">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72 border-none">
                        <Sidebar user={session.user} mobile={true} />
                    </SheetContent>
                </Sheet>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden">
                <div className="container max-w-7xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
