"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Package } from "lucide-react";
import { generateKitAnalysisPDF } from "@/lib/pdf-utils";

interface KitAnalysisTableProps {
    data: any[];
}

export default function KitAnalysisTable({ data }: KitAnalysisTableProps) {
    const ageGroups = ["6-12", "13-17", "Open"];
    
    const analysis = ageGroups.map(group => {
        const groupData = data.filter(r => r.ageGroup === group);
        const sizes = Array.from(new Set(groupData.map(r => r.kitSize).filter(Boolean))) as string[];
        const sizeCounts = sizes.map(size => ({
            size,
            count: groupData.filter(r => r.kitSize === size).length
        })).sort((a, b) => a.size.localeCompare(b.size));

        return {
            group,
            sizeCounts,
            total: groupData.length
        };
    }).filter(g => g.total > 0);

    const handleExport = () => {
        generateKitAnalysisPDF(data);
    };

    return (
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white mt-8">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-black text-indigo-950 tracking-tight">Detailed Kit Breakdown</CardTitle>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Size distribution per category</p>
                </div>
                <Button onClick={handleExport} size="sm" className="bg-rotaract-red hover:bg-red-700 font-black text-[10px] uppercase tracking-widest h-9 px-4 rounded-xl shadow-lg transition-all active:scale-95">
                    <FileDown className="mr-2 h-3.5 w-3.5" />
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Category</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Kit Sizes & Quantities</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400 text-right">Group Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analysis.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-32 text-center text-gray-400 font-bold italic">
                                        No kit data available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                analysis.map((item) => (
                                    <TableRow key={item.group} className="hover:bg-gray-50/30 transition-all border-b group">
                                        <TableCell className="py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                                    <Package className="h-4 w-4 text-indigo-600" />
                                                </div>
                                                <span className="font-black text-indigo-950">{item.group}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {item.sizeCounts.map(sc => (
                                                    <div key={sc.size} className="bg-white border-2 border-indigo-100 px-3 py-1.5 rounded-xl shadow-sm flex items-center space-x-2">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase">Size</span>
                                                        <span className="font-black text-indigo-600 font-mono">{sc.size}</span>
                                                        <span className="w-px h-3 bg-indigo-100" />
                                                        <span className="font-black text-indigo-950">{sc.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <span className="text-xl font-black text-rotaract-red tracking-tighter">{item.total}</span>
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
