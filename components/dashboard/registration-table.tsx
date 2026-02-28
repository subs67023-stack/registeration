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
import { FileDown, Calendar } from "lucide-react";
import { format } from "date-fns";
import { generateReportPDF } from "@/lib/pdf-utils";

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

    const currentData = groups[activeTab] || [];

    const handleExport = () => {
        const totals = {
            count: currentData.length,
            amount: currentData.reduce((acc: number, curr: any) => acc + curr.fees, 0)
        };
        generateReportPDF(`${title} - ${activeTab} Category`, currentData, totals);
    };

    return (
        <Card className="shadow-lg border-indigo-50">
            <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-indigo-900">{title}</CardTitle>
                <Button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700 font-bold">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs defaultValue="All" onValueChange={setActiveTab} className="w-full">
                    <div className="px-6 py-2 border-b bg-indigo-50/30">
                        <TabsList className="bg-white border rounded-lg p-1">
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="0-12">0–12</TabsTrigger>
                            <TabsTrigger value="13-16">13–16</TabsTrigger>
                            <TabsTrigger value="Open">Open</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value={activeTab} className="m-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-100 hover:bg-gray-100">
                                        <TableHead className="w-[80px] font-bold text-indigo-950">S.No</TableHead>
                                        <TableHead className="font-bold text-indigo-950">Reg No</TableHead>
                                        <TableHead className="font-bold text-indigo-950">Name</TableHead>
                                        <TableHead className="font-bold text-indigo-950">Age (Group)</TableHead>
                                        <TableHead className="font-bold text-indigo-950">Phone</TableHead>
                                        <TableHead className="font-bold text-indigo-950">Fee</TableHead>
                                        <TableHead className="font-bold text-indigo-950">Method</TableHead>
                                        <TableHead className="font-bold text-indigo-950 shrink-0">Added On</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-32 text-center text-gray-500 italic">
                                                No registrations found for this category.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentData.map((item: any, index: number) => (
                                            <TableRow key={item.id} className="hover:bg-indigo-50/50 transition-colors">
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell className="font-mono font-semibold">{item.registrationNumber}</TableCell>
                                                <TableCell className="font-medium text-gray-950">{item.name}</TableCell>
                                                <TableCell>
                                                    {item.age} <span className="text-xs text-gray-500">({item.ageGroup})</span>
                                                </TableCell>
                                                <TableCell>{item.phone}</TableCell>
                                                <TableCell className="font-bold text-indigo-600">₹{item.fees}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.paymentMethod === "ONLINE" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                                                        }`}>
                                                        {item.paymentMethod}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-gray-500 text-xs">
                                                    {format(new Date(item.createdAt), "dd MMM yyyy")}
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
