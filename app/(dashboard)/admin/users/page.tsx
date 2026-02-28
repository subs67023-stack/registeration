import { prisma } from "@/lib/prisma";
import DashboardHeader from "@/components/dashboard/header";
import SubadminManagement from "@/components/admin/subadmin-management";

export default async function ManageSubadmins() {
    const subadmins = await prisma.user.findMany({
        where: { role: "SUBADMIN" },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-6">
            <DashboardHeader title="Manage Subadmins" />
            <SubadminManagement initialSubadmins={subadmins} />
        </div>
    );
}
