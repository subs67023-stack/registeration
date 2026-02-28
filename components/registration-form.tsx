"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { calculateAge, getAgeGroupAndFee } from "@/lib/utils";
import { registerParticipant } from "@/lib/actions";
import { generateRegistrationPDF } from "@/lib/pdf-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, FileDown } from "lucide-react";

const registrationSchema = z.object({
    name: z.string().min(2, "Name is required"),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date of birth"),
    gender: z.enum(["M", "F"]),
    aadharNo: z.string().length(12, "Aadhar Number must be exactly 12 digits").regex(/^\d+$/, "Aadhar must be numeric"),
    schoolCollege: z.string().min(2, "School/College name is required"),
    village: z.string().min(2, "Village name is required"),
    phone: z.string().length(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Phone must be numeric"),
    paymentMethod: z.enum(["CASH", "ONLINE"]),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegistrationForm({ subadminId = null }: { subadminId?: string | null }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [ageInfo, setAgeInfo] = useState({ age: 0, ageGroup: "N/A", fee: 0 });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            gender: "M",
            paymentMethod: "CASH",
        },
    });

    const dobValue = watch("dob");

    useEffect(() => {
        if (dobValue) {
            const age = calculateAge(new Date(dobValue));
            const { ageGroup, fee } = getAgeGroupAndFee(age);
            setAgeInfo({ age, ageGroup, fee });
        }
    }, [dobValue]);

    const onSubmit = async (data: RegistrationFormValues) => {
        setLoading(true);
        setError(null);
        try {
            const result = await registerParticipant({ ...data, subadminId });
            if (result.success) {
                setSuccess(result.registration);
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
            <div className="max-w-md mx-auto mt-10">
                <Alert className="border-green-500 bg-green-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mb-2" />
                    <AlertTitle className="text-green-800 font-bold text-xl">Registration Successful!</AlertTitle>
                    <AlertDescription className="text-green-700 mt-2">
                        <p className="mb-4">Participant has been registered successfully.</p>
                        <div className="bg-white p-4 rounded border border-green-200 mb-6">
                            <p className="text-xs uppercase text-green-600 font-bold tracking-widest mb-1">Registration Number</p>
                            <p className="text-3xl font-black font-mono text-green-900 leading-none">{success.registrationNumber}</p>
                        </div>

                        <div className="space-y-3">
                            <Button onClick={() => generateRegistrationPDF(success)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12">
                                <FileDown className="mr-2 h-5 w-5" />
                                Download PDF Receipt
                            </Button>
                            <Button onClick={() => setSuccess(null)} variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-100">
                                Register Another Participant
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto my-10 shadow-xl border-t-4 border-t-indigo-600 overflow-hidden">
            <div className="bg-indigo-600 p-6 text-white text-center">
                <CardTitle className="text-2xl font-bold">Registration Details</CardTitle>
                <p className="text-indigo-100 mt-1">Please enter participant information accurately</p>
            </div>
            <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-indigo-900 font-semibold">Full Name</Label>
                            <Input id="name" {...register("name")} placeholder="Enter name" className="border-indigo-100 focus:border-indigo-300" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob" className="text-indigo-900 font-semibold">Date of Birth</Label>
                            <Input id="dob" type="date" {...register("dob")} className="border-indigo-100" />
                            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-indigo-900 font-semibold">Gender</Label>
                            <Select onValueChange={(val) => setValue("gender", val as "M" | "F")} defaultValue="M">
                                <SelectTrigger className="border-indigo-100">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="M">Male</SelectItem>
                                    <SelectItem value="F">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="aadharNo" className="text-indigo-900 font-semibold">Aadhar Number (12 digits)</Label>
                            <Input id="aadharNo" {...register("aadharNo")} placeholder="12 digit aadhar" maxLength={12} className="border-indigo-100" />
                            {errors.aadharNo && <p className="text-red-500 text-xs mt-1">{errors.aadharNo.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-indigo-900 font-semibold">Phone Number (10 digits)</Label>
                            <Input id="phone" {...register("phone")} placeholder="10 digit phone" maxLength={10} className="border-indigo-100" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="schoolCollege" className="text-indigo-900 font-semibold">School / College</Label>
                            <Input id="schoolCollege" {...register("schoolCollege")} placeholder="School name" className="border-indigo-100" />
                            {errors.schoolCollege && <p className="text-red-500 text-xs mt-1">{errors.schoolCollege.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="village" className="text-indigo-900 font-semibold">Village Name</Label>
                            <Input id="village" {...register("village")} placeholder="Village name" className="border-indigo-100" />
                            {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod" className="text-indigo-900 font-semibold">Payment Method</Label>
                            <Select onValueChange={(val) => setValue("paymentMethod", val as "CASH" | "ONLINE")} defaultValue="CASH">
                                <SelectTrigger className="border-indigo-100">
                                    <SelectValue placeholder="Select Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CASH">CASH</SelectItem>
                                    <SelectItem value="ONLINE">ONLINE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-5 rounded-xl flex flex-wrap justify-between items-center text-indigo-900 border border-indigo-200">
                        <div>
                            <p className="font-semibold text-xs uppercase tracking-wider opacity-70 mb-1">Calculated Age</p>
                            <p className="text-2xl font-black">{ageInfo.age || 0}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-xs uppercase tracking-wider opacity-70 mb-1">Age Group</p>
                            <p className="text-2xl font-black">{ageInfo.ageGroup}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-xs uppercase tracking-wider opacity-70 mb-1">Fee Amount</p>
                            <p className="text-3xl font-black text-indigo-600">₹{ageInfo.fee}</p>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full h-14 text-xl font-black bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                Registering...
                            </>
                        ) : (
                            "Complete Registration"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
