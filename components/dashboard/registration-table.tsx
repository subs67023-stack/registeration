"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown, Trash2, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { generateReportPDF } from "@/lib/pdf-utils";
import { deleteRegistration } from "@/lib/actions";
import { useTransition } from "react";

export default function RegistrationTable({
    title,
    data,
    groups
}: {
    title: string;
    data: any[];
    groups: any;
}) {
    const [activeTab, setActiveTab] = useState("All");
    const [filterMode, setFilterMode] = useState<"category" | "subadmin">("category");
    const [isPending, startTransition] = useTransition();

    // Get unique subadmins from the data
    const subadmins = Array.from(new Set(data.map(item => item.subadmin?.name).filter(Boolean))) as string[];

    // Calculate dynamic data based on filter mode
    const currentData = filterMode === "category"
        ? (groups[activeTab] || [])
        : activeTab === "All"
            ? data
            : data.filter(item => item.subadmin?.name === activeTab);

    const handleExport = () => {
        const totals = {
            count: currentData.length,
            amount: currentData.reduce((acc: number, curr: any) => acc + curr.fees, 0)
        };
        generateReportPDF(`${title} - ${activeTab} (${filterMode})`, currentData, totals);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this registration?")) {
            startTransition(async () => {
                await deleteRegistration(id);
            });
        }
    };

    const handleWhatsApp = (item: any) => {
        const message = `*Registration Confirmation*%0A%0AHello ${item.name},%0AYour registration for the Rotaract Event is successful!%0A%0A*Reg No:* ${item.registrationNumber}%0A*Category:* ${item.ageGroup}%0A*Fee:* ₹${item.fees}%0A%0AThank you!`;
        window.open(`https://wa.me/91${item.phone}?text=${message}`, '_blank');
    };

    return (
        <Card className="shadow-2xl border-none overflow-hidden rounded-[1.5rem]">
            <CardHeader className="border-b bg-white flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                <div className="flex items-center space-x-3 text-center sm:text-left">
                    <div className="w-2 h-8 bg-rotaract-red rounded-full hidden sm:block" />
                    <div>
                        <CardTitle className="text-2xl font-black text-rotaract-blue tracking-tight">{title}</CardTitle>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Filter by: {filterMode === "category" ? "Age Groups" : "Subadmins"}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="flex bg-gray-100 p-1 rounded-xl h-11 border border-gray-200 shadow-inner">
                        <button
                            onClick={() => { setFilterMode("category"); setActiveTab("All"); }}
                            className={`px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterMode === "category" ? "bg-white text-rotaract-blue shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            Cats
                        </button>
                        <button
                            onClick={() => { setFilterMode("subadmin"); setActiveTab("All"); }}
                            className={`px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterMode === "subadmin" ? "bg-white text-rotaract-blue shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            Users
                        </button>
                    </div>
                    <Button onClick={handleExport} className="bg-rotaract-red hover:bg-red-700 font-black text-xs uppercase tracking-widest h-11 px-6 rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95">
                        <FileDown className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-6 py-3 border-b bg-gray-50/50 overflow-x-auto">
                        <TabsList className="bg-white border rounded-xl p-1 h-12 inline-flex">
                            <TabsTrigger value="All" className="rounded-lg font-bold data-[state=active]:bg-rotaract-blue data-[state=active]:text-white min-w-[60px]">All</TabsTrigger>
                            {filterMode === "category" ? (
                                <>
                                    <TabsTrigger value="0-12" className="rounded-lg font-bold data-[state=active]:bg-rotaract-blue data-[state=active]:text-white">0–12</TabsTrigger>
                                    <TabsTrigger value="13-16" className="rounded-lg font-bold data-[state=active]:bg-rotaract-blue data-[state=active]:text-white">13–16</TabsTrigger>
                                    <TabsTrigger value="Open" className="rounded-lg font-bold data-[state=active]:bg-rotaract-blue data-[state=active]:text-white">Open</TabsTrigger>
                                </>
                            ) : (
                                subadmins.map(name => (
                                    <TabsTrigger key={name} value={name} className="rounded-lg font-bold data-[state=active]:bg-rotaract-blue data-[state=active]:text-white whitespace-nowrap px-4">{name}</TabsTrigger>
                                ))
                            )}
                        </TabsList>
                    </div>

                    <TabsContent value={activeTab} className="m-0">
                        {/* Mobile Grid View */}
                        <div className="block lg:hidden p-4 space-y-4">
                            {currentData.length === 0 ? (
                                <div className="h-32 flex items-center justify-center text-gray-400 font-bold italic">
                                    No registrations found.
                                </div>
                            ) : (
                                currentData.map((item: any, index: number) => (
                                    <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-rotaract-red">Reg Number</p>
                                                <p className="font-mono font-black text-rotaract-blue">{item.registrationNumber}</p>
                                            </div>
                                            <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                <p className="text-[10px] font-black">{item.ageGroup}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</p>
                                            <p className="font-black text-lg text-gray-900">{item.name}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact</p>
                                                <p className="font-bold text-sm">{item.phone}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fee Paid</p>
                                                <p className="font-black text-rotaract-red">₹{item.fees}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 gap-2">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${item.paymentMethod === "ONLINE" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                                                    }`}>
                                                    {item.paymentMethod}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {format(new Date(item.createdAt), "dd MMM yyyy")}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Button onClick={() => handleWhatsApp(item)} variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                                    <MessageCircle className="h-4 w-4" />
                                                </Button>
                                                <Button onClick={() => handleDelete(item.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" disabled={isPending}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b">
                                        <TableHead className="w-[80px] font-black uppercase text-[10px] tracking-widest text-gray-400 px-6">S.No</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Reg No</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Name</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Age (Group)</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Phone</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Fee</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Method</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Date</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400 px-6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-48 text-center text-gray-400 font-bold italic">
                                                No registrations found for this category.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentData.map((item: any, index: number) => (
                                            <TableRow key={item.id} className="hover:bg-gray-50/50 transition-all border-b group">
                                                <TableCell className="px-6 font-bold text-gray-400">{index + 1}</TableCell>
                                                <TableCell className="font-mono font-black text-rotaract-blue tracking-tighter">{item.registrationNumber}</TableCell>
                                                <TableCell className="font-black text-gray-900">{item.name}</TableCell>
                                                <TableCell>
                                                    <span className="font-bold">{item.age}</span> <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">({item.ageGroup})</span>
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-600 font-mono text-xs">{item.phone}</TableCell>
                                                <TableCell className="font-black text-rotaract-red">₹{item.fees}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-widest border ${item.paymentMethod === "ONLINE" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-700 border-orange-100"
                                                        }`}>
                                                        {item.paymentMethod}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                                    {format(new Date(item.createdAt), "dd MMM")}
                                                </TableCell>
                                                <TableCell className="px-6 text-right">
                                                    <div className="flex items-center justify-end space-x-1">
                                                        <Button onClick={() => handleWhatsApp(item)} variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                                            <MessageCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button onClick={() => handleDelete(item.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" disabled={isPending}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
