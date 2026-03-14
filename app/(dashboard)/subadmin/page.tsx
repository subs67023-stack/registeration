import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateReportPDF } from "@/lib/pdf-utils";
import DashboardHeader from "@/components/dashboard/header";
import StatsCards from "@/components/dashboard/stats-cards";
import RegistrationTable from "@/components/dashboard/registration-table";
import AnalyticsCharts from "@/components/dashboard/analytics-charts";

export default async function SubadminDashboard() {
    const session = await getServerSession(authOptions);

    const registrations = await prisma.registration.findMany({
        where: { subadminId: session?.user?.id },
        orderBy: { createdAt: "desc" },
        include: { subadmin: true }
    });

    const stats = {
        total: registrations.length,
        amount: registrations.reduce((acc: number, curr: any) => acc + curr.fees, 0)
    };

    const groups = {
        "6-12": registrations.filter((r: any) => r.ageGroup === "6-12"),
        "13-17": registrations.filter((r: any) => r.ageGroup === "13-17"),
        "Open": registrations.filter((r: any) => r.ageGroup === "Open"),
        "All": registrations
    };

    return (
        <div className="space-y-6">
            <DashboardHeader title="Subadmin Dashboard" />

            <StatsCards total={stats.total} amount={stats.amount} />

            <AnalyticsCharts data={registrations} />

            <RegistrationTable
                title="My Registrations"
                data={registrations}
                groups={groups}
            />
        </div>
    );
}
