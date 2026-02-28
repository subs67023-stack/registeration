import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardHeader from "@/components/dashboard/header";
import StatsCards from "@/components/dashboard/stats-cards";
import RegistrationTable from "@/components/dashboard/registration-table";
import AnalyticsCharts from "@/components/dashboard/analytics-charts";

export default async function AdminDashboard() {
    const registrations = await prisma.registration.findMany({
        orderBy: { createdAt: "desc" },
        include: { subadmin: true }
    });

    const stats = {
        total: registrations.length,
        amount: registrations.reduce((acc, curr) => acc + curr.fees, 0)
    };

    const groups = {
        "0-12": registrations.filter(r => r.ageGroup === "0-12"),
        "13-16": registrations.filter(r => r.ageGroup === "13-16"),
        "Open": registrations.filter(r => r.ageGroup === "Open"),
        "All": registrations
    };

    return (
        <div className="space-y-6">
            <DashboardHeader title="Admin Overview" />

            <StatsCards total={stats.total} amount={stats.amount} />

            <AnalyticsCharts data={registrations} />

            <RegistrationTable
                title="All Registrations"
                data={registrations}
                groups={groups}
            />
        </div>
    );
}
