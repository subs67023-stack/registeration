"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, IndianRupee, PieChart, BarChart3, TrendingUp } from "lucide-react";

interface AnalyticsProps {
    data: any[];
}

export default function AnalyticsCharts({ data }: AnalyticsProps) {
    // 1. Process Data for Age Groups
    const ageGroups = ["0-12", "13-16", "Open"];
    const ageData = ageGroups.map(group => {
        const filtered = data.filter(r => r.ageGroup === group);
        const count = filtered.length;
        const totalFees = filtered.reduce((sum, r) => sum + (r.fees || 0), 0);
        return { name: group, count, totalFees };
    });

    const maxCount = Math.max(...ageData.map(d => d.count), 1);
    const totalAmount = data.reduce((sum, r) => sum + (r.fees || 0), 0);

    // 2. Process Data for Gender
    const genderGroups = ["Male", "Female", "Other"];
    const genderData = genderGroups.map(g => ({
        name: g,
        count: data.filter(r => r.gender === g).length
    })).filter(d => d.count > 0);

    // 3. Process Data for Trend (Last 7 Days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        d.setHours(0, 0, 0, 0);
        return d;
    });

    const trendData = last7Days.map(date => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        return {
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            count: data.filter(r => {
                const regDate = new Date(r.createdAt);
                return regDate >= date && regDate < nextDay;
            }).length
        };
    });

    const maxTrend = Math.max(...trendData.map(d => d.count), 1);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Age Group Distribution with Fees */}
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black text-indigo-950 tracking-tight">Category Breakdown</CardTitle>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Registrations & Revenue</p>
                        </div>
                        <BarChart3 className="h-6 w-6 text-indigo-200" />
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <div className="space-y-6">
                        {ageData.map((group, i) => (
                            <div key={group.name} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-sm font-black text-indigo-900">Group: {group.name}</span>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">₹{group.totalFees} Collected</p>
                                    </div>
                                    <span className="text-lg font-black text-indigo-600">{group.count}</span>
                                </div>
                                <div className="h-3 w-full bg-indigo-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-1000"
                                        style={{ width: `${(group.count / maxCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="border-none shadow-xl rounded-[2rem] bg-indigo-950 text-white flex flex-col justify-center p-8">
                    <TrendingUp className="h-8 w-8 text-indigo-400 mb-4" />
                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Growth Trend</p>
                    <div className="flex items-end space-x-2">
                        <span className="text-4xl font-black">+{trendData[6].count}</span>
                        <span className="text-xs font-bold text-indigo-400 mb-2">Today</span>
                    </div>
                    {/* Mini Sparkline */}
                    <div className="mt-6 flex items-end justify-between h-12 gap-1">
                        {trendData.map((d, i) => (
                            <div
                                key={i}
                                className={`w-full bg-indigo-400/20 rounded-t-sm transition-all duration-500 ${i === 6 ? 'bg-indigo-400' : ''}`}
                                style={{ height: `${(d.count / maxTrend) * 100 || 10}%` }}
                            />
                        ))}
                    </div>
                </Card>

                <Card className="border-none shadow-xl rounded-[2rem] bg-white border border-gray-100 p-8 flex flex-col justify-center">
                    <PieChart className="h-8 w-8 text-rotaract-red mb-4" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender Sync</p>
                    <div className="space-y-3 mt-2">
                        {genderData.map((d, i) => (
                            <div key={d.name} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${i === 0 ? 'bg-indigo-600' : i === 1 ? 'bg-pink-500' : 'bg-gray-400'}`} />
                                    <span className="text-xs font-bold text-gray-600">{d.name}</span>
                                </div>
                                <span className="text-xs font-black text-indigo-950">{d.count}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Full Width Info */}
                <Card className="sm:col-span-2 border-none shadow-xl rounded-[2rem] bg-gradient-to-br from-rotaract-blue to-indigo-900 text-white p-8 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-10">
                        <IndianRupee size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Total Impact</p>
                        <h3 className="text-3xl font-black mb-1">₹{totalAmount.toLocaleString()}</h3>
                        <p className="text-xs text-indigo-300 font-medium">Accumulated registration revenue</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
