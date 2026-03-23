"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerFreeKit } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, RefreshCw, Package } from "lucide-react";
import Logo from "@/components/logo";

const freeKitSchema = z.object({
    name: z.string().min(2, "Name is required"),
    kitSize: z.string().min(1, "Kit Size is required"),
});

type FreeKitFormValues = z.infer<typeof freeKitSchema>;

export default function FreeKitForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FreeKitFormValues>({
        resolver: zodResolver(freeKitSchema),
        defaultValues: {
            name: "",
            kitSize: "",
        },
    });

    const onSubmit = async (data: FreeKitFormValues) => {
        setLoading(true);
        setError(null);
        try {
            const result = await registerFreeKit(data.name, data.kitSize);

            if (result.success) {
                setSuccess(result.registration);
                reset();
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto mt-6 px-4">
                <Alert className="border-indigo-500 bg-indigo-50/50 shadow-xl overflow-hidden pb-0 pt-8 px-0">
                    <div className="px-6 pb-6">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                                <CheckCircle2 className="h-10 w-10 text-indigo-600" />
                            </div>
                        </div>
                        <AlertTitle className="text-indigo-800 font-black text-2xl text-center mb-2">Free Kit Added!</AlertTitle>
                        <AlertDescription className="text-indigo-700 text-center space-y-4">
                            <p className="text-sm font-medium opacity-80">Committee member kit has been registered successfully.</p>
                            <div className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-inner text-center">
                                <p className="text-[10px] uppercase text-indigo-600 font-black tracking-[0.2em] mb-2">Registration ID</p>
                                <p className="text-3xl font-black font-mono text-indigo-950 tracking-tighter">{success.registrationNumber}</p>
                                <div className="mt-4 pt-4 border-t border-indigo-50 flex justify-between items-center">
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase text-gray-400 font-black">Name</p>
                                        <p className="font-bold text-indigo-950">{success.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase text-gray-400 font-black">Size</p>
                                        <p className="font-bold text-indigo-950">{success.kitSize}</p>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={() => setSuccess(null)} variant="outline" className="w-full border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-100 transition-all h-12 rounded-xl">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Register Another
                            </Button>
                        </AlertDescription>
                    </div>
                    <div className="bg-indigo-600 h-2 w-full mt-4" />
                </Alert>
            </div>
        );
    }

    return (
        <Card className="max-w-md mx-auto shadow-2xl border-none overflow-hidden rounded-[2rem]">
            <div className="bg-indigo-900 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-full -mr-10 -mt-10 opacity-30" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-700 rounded-full -ml-8 -mb-8 opacity-20" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 mb-4 shadow-xl border border-white/30">
                        <Logo width={50} height={50} />
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tighter text-center">Committee Free Kit</CardTitle>
                    <p className="text-indigo-200 mt-1 font-medium text-xs opacity-80 uppercase tracking-widest">Admin Access Only</p>
                </div>
            </div>

            <CardContent className="p-8 bg-white">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Full Name</Label>
                            <Input id="name" {...register("name")} placeholder="Committee Member Name" spellCheck={false} className="h-14 border-2 border-gray-100 bg-gray-50/50 shadow-sm focus:border-indigo-600 focus:bg-white transition-all rounded-xl text-black font-bold text-base" />
                            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="kitSize" className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Kit Size</Label>
                            <div className="relative">
                                <Input id="kitSize" {...register("kitSize")} placeholder="e.g. 38, 40, S, M" spellCheck={false} className="h-14 border-2 border-gray-100 bg-gray-50/50 shadow-sm focus:border-indigo-600 focus:bg-white transition-all rounded-xl text-black font-bold text-base pl-12" />
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                            {errors.kitSize && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.kitSize.message}</p>}
                        </div>
                    </div>

                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 mb-1">Assigned Group</p>
                        <p className="text-lg font-black text-indigo-900">13-17 Years</p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">Free Distribution • Tagged as Committee</p>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="rounded-2xl">
                            <AlertDescription className="font-bold">{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full h-16 text-lg font-black bg-indigo-900 hover:bg-indigo-950 text-white shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-[0.98] rounded-2xl" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "REGISTER FREE KIT"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
