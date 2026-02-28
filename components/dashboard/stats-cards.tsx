import { Card, CardContent } from "@/components/ui/card";
import { Users, IndianRupee } from "lucide-react";

export default function StatsCards({ total, amount }: { total: number; amount: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-indigo-600">
                <CardContent className="flex items-center p-6">
                    <div className="p-4 bg-indigo-100 rounded-full mr-5">
                        <Users className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Registrations</p>
                        <p className="text-3xl font-bold text-gray-900">{total}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-600">
                <CardContent className="flex items-center p-6">
                    <div className="p-4 bg-emerald-100 rounded-full mr-5">
                        <IndianRupee className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Collected Amount</p>
                        <p className="text-3xl font-bold text-gray-900">₹{amount}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
