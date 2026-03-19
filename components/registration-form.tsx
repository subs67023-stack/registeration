"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { calculateAge, getAgeGroupAndFee } from "@/lib/utils";
import { registerParticipant, updateRegistration } from "@/lib/actions";
import { generateRegistrationPDF } from "@/lib/pdf-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, FileDown, RefreshCw, MessageCircle } from "lucide-react";
import Logo from "@/components/logo";

const registrationSchema = z.object({
    name: z.string().min(2, "Name is required"),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date of birth"),
    gender: z.enum(["M", "F"]),
    kitSize: z.string().min(1, "Kit Size is required"),
    aadharNo: z.string().length(12, "Aadhar Number must be exactly 12 digits").regex(/^\d+$/, "Aadhar must be numeric"),
    schoolCollege: z.string().min(2, "School/College name is required"),
    village: z.string().min(2, "Village name is required"),
    phone: z.string().length(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Phone must be numeric"),
    paymentMethod: z.enum(["CASH", "ONLINE"]),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegistrationForm({ 
    subadminId = null, 
    initialData = null,
    onSuccess = null
}: { 
    subadminId?: string | null;
    initialData?: any | null;
    onSuccess?: ((data: any) => void) | null;
}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [ageInfo, setAgeInfo] = useState({ 
        age: initialData?.age || 0, 
        ageGroup: initialData?.ageGroup || "N/A", 
        fee: initialData?.fees || 0 
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: initialData?.name || "",
            dob: initialData?.dob ? new Date(initialData.dob).toISOString().split('T')[0] : "",
            gender: initialData?.gender || "M",
            kitSize: initialData?.kitSize || "",
            aadharNo: initialData?.aadharNo || "",
            schoolCollege: initialData?.schoolCollege || "",
            village: initialData?.village || "",
            phone: initialData?.phone || "",
            paymentMethod: initialData?.paymentMethod || "CASH",
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
            let result;
            if (initialData) {
                result = await updateRegistration(initialData.id, data);
            } else {
                result = await registerParticipant({ ...data, subadminId });
            }

            if (result.success) {
                if (onSuccess) {
                    onSuccess(result.registration);
                } else {
                    setSuccess(result.registration);
                }
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
                <Alert className="border-green-500 bg-green-50/50 shadow-xl overflow-hidden pb-0 pt-8 px-0">
                    <div className="px-6 pb-6">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                        </div>
                        <AlertTitle className="text-green-800 font-black text-2xl text-center mb-2">Done!</AlertTitle>
                        <AlertDescription className="text-green-700 text-center space-y-4">
                            <p className="text-sm font-medium opacity-80">Your registration is complete. Download your receipt below.</p>
                            <div className="bg-white p-6 rounded-2xl border-2 border-green-100 shadow-inner">
                                <p className="text-[10px] uppercase text-green-600 font-black tracking-[0.2em] mb-2">Registration ID</p>
                                <p className="text-3xl font-black font-mono text-green-900 tracking-tighter">{success.registrationNumber}</p>
                            </div>

                            <div className="flex flex-col space-y-3 pt-4">
                                <Button onClick={() => generateRegistrationPDF(success)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98]">
                                    <FileDown className="mr-2 h-5 w-5" />
                                    Download Receipt
                                </Button>
                                <Button
                                    onClick={() => {
                                        const message = `🙏🏻नमस्कार, 🙏🏻\n\n*${success.name}*\nआपण मॅरेथॉन स्पर्धेसाठी रजिस्ट्रेशन केले आहे.🏃🏻‍♀️🏃🏻\n \n📅 तारीख : 29 March 2026\n📍ठिकाण : मंगलमूर्ती हॉल पटनकोडोली \n⏰  वेळ    : स. 6 वाजता \n\nREG NO       -  ${success.registrationNumber}\nNAME          - ${success.name}\nCATEGORY   - ${success.ageGroup}\nKIT SIZE       - ${success.kitSize || 'N/A'}\nFEES            - ₹${success.fees}\n\nअधिक माहिती साठी खालील ग्रुप ला जॉइन करा.\nव्हॉट्सॲप लिंक (मॅरेथॉन माहिती)\nhttps://chat.whatsapp.com/Bpn8V7jiPGPFhL4eqRADlb\nइंस्टाग्राम लिंक \nhttps://www.instagram.com/rotaract_pattankodoli?igsh=MmpjODF1Z2FpcDYz\n \nनियम व अटी \n1. स्पर्धेत सहभागी होण्यासाठी नोंदणी करणे आवश्यक आहे.\n2. स्पर्धकांनी वेळेवर स्पर्धेच्या ठिकाणी उपस्थित राहणे बंधनकारक आहे.\n3. स्पर्धकांनी स्पर्धेदरम्यान आयोजकांनी दिलेला बिब नंबर / आयडी लावणे आवश्यक आहे.\n4. स्पर्धेदरम्यान कोणत्याही प्रकारची फसवणूक किंवा शॉर्टकट वापरल्यास स्पर्धक अपात्र ठरवला जाईल.\n5. 18 वर्षांखालील स्पर्धकांसाठी पालकांची परवानगी आवश्यक आहे.\n6. स्पर्धकांनी स्वतःच्या आरोग्याची जबाबदारी स्वतः घ्यावी.\n7. आयोजक समितीचा निर्णय अंतिम व सर्वांसाठी बंधनकारक राहील.\n8. स्पर्धेच्या दरम्यान सुरक्षिततेचे सर्व नियम पाळणे आवश्यक आहे.\n9. स्पर्धा मार्गावर कचरा टाकू नये व स्वच्छता राखावी.\n10. स्पर्धेतील विजेत्यांना आयोजकांच्या वतीने पारितोषिक देण्यात येईल.\n\n\nधन्यवाद 🙏🏻\n*ROTARACT CLUB PATTANKODOLI*`;
                                        window.open(`https://wa.me/91${success.phone}?text=${encodeURIComponent(message)}`, '_blank');
                                    }}
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-14 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
                                >
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Send to WhatsApp
                                </Button>
                                <Button onClick={() => setSuccess(null)} variant="ghost" className="w-full text-green-700 font-semibold hover:bg-green-100 transition-all h-12">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Register Another
                                </Button>
                            </div>
                        </AlertDescription>
                    </div>
                    <div className="bg-green-600 h-2 w-full mt-4" />
                </Alert>
            </div>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto shadow-2xl border-none overflow-hidden rounded-[2rem]">
            <div className="bg-rotaract-red p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rotaract-gold rounded-full -mr-10 -mt-10 opacity-30" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-rotaract-blue rounded-full -ml-8 -mb-8 opacity-20" />

                <div className="relative z-10 flex flex-col items-center sm:items-start">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 mb-4 shadow-xl border border-white/30">
                        <Logo width={50} height={50} />
                    </div>
                    <CardTitle className="text-3xl md:text-4xl font-black tracking-tighter">Event Registration</CardTitle>
                    <p className="text-white mt-1 font-medium text-sm opacity-80">Rotaract Club Participant Enrollment</p>
                </div>
            </div>

            <CardContent className="p-6 md:p-10 bg-white">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-rotaract-red border-b pb-2">Personal Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-black text-black uppercase tracking-wider ml-1">Full Name</Label>
                                <Input id="name" {...register("name")} placeholder="Full Name" spellCheck={false} className="h-14 border-2 border-black bg-white shadow-sm focus:border-indigo-600 transition-all rounded-xl text-black font-bold text-base" />
                                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="dob" className="text-xs font-black text-black uppercase tracking-wider ml-1">Date of Birth</Label>
                                <Input id="dob" type="date" {...register("dob")} className="h-14 border-2 border-black bg-white shadow-sm focus:border-indigo-600 transition-all rounded-xl text-black font-bold text-base" />
                                {errors.dob && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.dob.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="gender" className="text-xs font-black text-black uppercase tracking-wider ml-1">Gender</Label>
                                <Select onValueChange={(val) => setValue("gender", val as "M" | "F")} defaultValue="M">
                                    <SelectTrigger className="h-14 border-2 border-black bg-white shadow-sm focus:ring-indigo-600 rounded-xl text-black font-bold text-base">
                                        <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">Male</SelectItem>
                                        <SelectItem value="F">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="kitSize" className="text-xs font-black text-black uppercase tracking-wider ml-1">Kit Size</Label>
                                <Input id="kitSize" {...register("kitSize")} placeholder="e.g. 38, 40, S, M" spellCheck={false} className="h-14 border-2 border-black bg-white shadow-sm focus:border-indigo-600 transition-all rounded-xl text-black font-bold text-base" />
                                {errors.kitSize && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.kitSize.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="aadharNo" className="text-xs font-black text-black uppercase tracking-wider ml-1">Aadhar Number</Label>
                                <Input id="aadharNo" {...register("aadharNo")} placeholder="12-digit number" maxLength={12} spellCheck={false} className="h-14 border-2 border-black bg-white shadow-sm focus:border-indigo-600 transition-all rounded-xl font-mono tracking-[0.3em] text-black font-bold text-base" />
                                {errors.aadharNo && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.aadharNo.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-rotaract-red border-b pb-2">Contact & Institution</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-xs font-black text-black uppercase tracking-wider ml-1">Phone Number</Label>
                                <Input id="phone" {...register("phone")} placeholder="10-digit mobile" maxLength={10} spellCheck={false} className="h-14 border-2 border-black bg-white shadow-sm focus:border-indigo-600 transition-all rounded-xl font-mono text-black font-bold text-base" />
                                {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.phone.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="schoolCollege" className="text-xs font-black text-black uppercase tracking-wider ml-1">School / College</Label>
                                <Input id="schoolCollege" {...register("schoolCollege")} placeholder="Current institution" spellCheck={false} className="h-14 border-2 border-black bg-white shadow-sm focus:border-indigo-600 transition-all rounded-xl text-black font-bold text-base" />
                                {errors.schoolCollege && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.schoolCollege.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="village" className="text-xs font-black text-black uppercase tracking-wider ml-1">Village Name</Label>
                                <Input id="village" {...register("village")} placeholder="Home village" spellCheck={false} className="h-14 border-2 border-black bg-white shadow-sm focus:border-indigo-600 transition-all rounded-xl text-black font-bold text-base" />
                                {errors.village && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.village.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="paymentMethod" className="text-xs font-black text-black uppercase tracking-wider ml-1">Payment Method</Label>
                                <Select onValueChange={(val) => setValue("paymentMethod", val as "CASH" | "ONLINE")} defaultValue="CASH">
                                    <SelectTrigger className="h-14 border-2 border-black bg-white shadow-sm focus:ring-indigo-600 rounded-xl text-black font-bold text-base">
                                        <SelectValue placeholder="Select Method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH">CASH</SelectItem>
                                        <SelectItem value="ONLINE">ONLINE (Scan & Pay)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-3xl border border-red-100 flex flex-row flex-wrap justify-between items-center shadow-inner gap-4">
                        <div className="space-y-1">
                            <p className="font-black text-[10px] uppercase tracking-[0.2em] text-rotaract-red/60">Current Age</p>
                            <p className="text-3xl font-black text-rotaract-red">{ageInfo.age || 0}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-black text-[10px] uppercase tracking-[0.2em] text-rotaract-red/60">Age Category</p>
                            <div className="bg-white px-3 py-1 rounded-full border border-red-100 inline-block shadow-sm">
                                <p className="text-sm font-black text-rotaract-red">{ageInfo.ageGroup}</p>
                            </div>
                        </div>
                        <div className="text-right space-y-1 bg-rotaract-red px-6 py-2 rounded-2xl shadow-lg border-b-4 border-red-800">
                            <p className="font-black text-[10px] uppercase tracking-[0.2em] text-rotaract-gold opacity-80">Registration Fee</p>
                            <p className="text-3xl font-black text-white">₹{ageInfo.fee}</p>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="rounded-2xl">
                            <AlertDescription className="font-bold">{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full h-16 text-xl font-black bg-rotaract-red hover:bg-red-700 text-white shadow-xl shadow-red-100 transition-all hover:-translate-y-1 active:scale-[0.98] rounded-2xl" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                Confirming...
                            </>
                        ) : (
                            initialData ? "UPDATE REGISTRATION" : "REGISTER NOW"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
