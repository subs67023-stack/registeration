import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import FreeKitForm from "@/components/dashboard/free-kit-form";

export default async function FreeKitPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-indigo-950 tracking-tighter">Free Kit Registration</h1>
                    <p className="text-gray-500 font-medium mt-1">Register committee members for free kits</p>
                </div>
            </div>

            <div className="py-8">
                <FreeKitForm />
            </div>
        </div>
    );
}
