import { prisma } from "@/lib/prisma";
import DashboardHeader from "@/components/dashboard/header";
import AnalyticsCharts from "@/components/dashboard/analytics-charts";
import StatsCards from "@/components/dashboard/stats-cards";
import KitAnalysisTable from "@/components/dashboard/kit-analysis-table";

export default async function AdminAnalyticsPage() {
    const [registrations, freeKits] = await Promise.all([
        prisma.registration.findMany({
            orderBy: { createdAt: "desc" },
        }),
        prisma.freeKit.findMany({
            orderBy: { createdAt: "desc" },
        })
    ]);

    const stats = {
        total: registrations.length + freeKits.length,
        amount: registrations.reduce((acc: number, curr: any) => acc + curr.fees, 0)
    };

    return (
        <div className="space-y-8">
            <DashboardHeader title="Special Analytics" />

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-indigo-950 tracking-tighter">Event Performance</h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1 text-rotaract-red">Real-time Registration Data</p>
                </div>

                <StatsCards total={stats.total} amount={stats.amount} />

                <div className="mt-10">
                    <AnalyticsCharts data={registrations} />
                </div>

                <KitAnalysisTable
                    registrations={registrations}
                    freeKits={freeKits}
                />
            </div>
        </div>
    );
}
