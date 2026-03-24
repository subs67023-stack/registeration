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
import { Trash2, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { deleteFreeKit } from "@/lib/actions";
import { useTransition } from "react";

export default function FreeKitTable({
    data
}: {
    data: any[];
}) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this free kit?")) {
            startTransition(async () => {
                await deleteFreeKit(id);
            });
        }
    };

    return (
        <Card className="shadow-2xl border-none overflow-hidden rounded-[1.5rem]">
            <CardHeader className="border-b bg-white flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                <div className="flex items-center space-x-3 text-center sm:text-left">
                    <div className="w-2 h-8 bg-green-500 rounded-full hidden sm:block" />
                    <div>
                        <CardTitle className="text-2xl font-black text-indigo-950 tracking-tight">Free Kit Records</CardTitle>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Total: {data.length}</p>
                    </div>
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
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center text-gray-400 font-bold italic">
                                        No free kit registrations found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item: any, index: number) => (
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
                                            {format(new Date(item.createdAt), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <div className="flex items-center justify-end space-x-1">
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
        </Card>
    );
}
