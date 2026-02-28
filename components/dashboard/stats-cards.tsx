import { Card, CardContent } from "@/components/ui/card";
import { Users, IndianRupee } from "lucide-react";

export default function StatsCards({ total, amount }: { total: number; amount: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-xl bg-rotaract-blue text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                <CardContent className="flex items-center p-8">
                    <div className="p-4 bg-white/20 rounded-2xl mr-6 backdrop-blur-sm border border-white/20">
                        <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rotaract-gold">Total Registrations</p>
                        <p className="text-4xl font-black">{total}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-rotaract-red text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                <CardContent className="flex items-center p-8">
                    <div className="p-4 bg-white/10 rounded-2xl mr-6 backdrop-blur-sm border border-white/10">
                        <IndianRupee className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Total Collected</p>
                        <p className="text-4xl font-black">₹{amount}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
