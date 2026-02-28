import { Button } from "@/components/ui/button";

export default function DashboardHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-indigo-950 tracking-tight">{title}</h1>
        </div>
    );
}
