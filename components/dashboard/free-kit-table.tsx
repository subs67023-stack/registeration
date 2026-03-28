"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { deleteFreeKit } from "@/lib/actions";
import { useTransition, useState } from "react";
import EditFreeKitSheet from "./edit-free-kit-sheet";

export default function FreeKitTable({
    data
}: {
    data: any[];
}) {
    const [isPending, startTransition] = useTransition();
    const [editingFreeKit, setEditingFreeKit] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = data.filter((item: any) => {
        if (!searchQuery) return true;
        return item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this free kit?")) {
            startTransition(async () => {
                await deleteFreeKit(id);
            });
        }
    };

    return (
        <Card className="shadow-2xl border-none overflow-hidden rounded-[1.5rem] mt-8">
            <CardHeader className="border-b bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-2xl font-black text-indigo-950 tracking-tight">Free Kit Registrations</CardTitle>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Committee Member List</p>
                </div>
                <div className="relative group w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 bg-gray-50/50 border-gray-200 rounded-xl focus-visible:ring-indigo-600 focus-visible:bg-white transition-all font-medium"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b">
                                <TableHead className="w-[80px] font-black uppercase text-[10px] tracking-widest text-gray-400 px-6">S.No</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Name</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Gender</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Kit Size</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">By Admin</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Date</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400 px-6 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center text-gray-400 font-bold italic">
                                        {searchQuery ? "No matching records found." : "No free kit registrations found."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((item: any, index: number) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50/50 transition-all border-b group">
                                        <TableCell className="px-6 font-bold text-gray-400">{index + 1}</TableCell>
                                        <TableCell className="font-black text-gray-900">{item.name}</TableCell>
                                        <TableCell className="font-bold text-gray-600 text-[10px] uppercase">{item.gender || "N/A"}</TableCell>
                                        <TableCell>
                                            <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                                {item.kitSize || "N/A"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-bold text-[10px] uppercase text-gray-500">{item.subadmin?.name || "Main Admin"}</TableCell>
                                        <TableCell className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                            {format(new Date(item.createdAt), "dd MMM")}
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <Button onClick={() => setEditingFreeKit(item)} variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                    <Pencil className="h-4 w-4" />
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
            </CardContent>
            <EditFreeKitSheet
                freeKit={editingFreeKit}
                open={!!editingFreeKit}
                onOpenChange={(open) => !open && setEditingFreeKit(null)}
            />
        </Card>
    );
}
