import { prisma } from "@/lib/prisma";
import DashboardHeader from "@/components/dashboard/header";
import RegistrationTable from "@/components/dashboard/registration-table";

export default async function AdminRegistrations() {
    const registrations = await prisma.registration.findMany({
        orderBy: { createdAt: "desc" },
        include: { subadmin: true }
    });

    const groups = {
        "6-12": registrations.filter((r: any) => r.ageGroup === "6-12"),
        "13-17": registrations.filter((r: any) => r.ageGroup === "13-17"),
        "Open": registrations.filter((r: any) => r.ageGroup === "Open"),
        "All": registrations
    };

    return (
        <div className="space-y-6">
            <DashboardHeader title="All Registrations" />
            <RegistrationTable
                title="Registration Records"
                data={registrations}
                groups={groups}
            />
        </div>
    );
}
