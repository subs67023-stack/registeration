import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RegistrationForm from "@/components/registration-form";
import DashboardHeader from "@/components/dashboard/header";

export default async function SubadminNewRegistration() {
    const session = await getServerSession(authOptions);

    return (
        <div className="space-y-6">
            <DashboardHeader title="Add New Registration" />
            <div className="bg-white rounded-xl shadow-sm border p-1">
                <RegistrationForm subadminId={session?.user?.id} />
            </div>
        </div>
    );
}
