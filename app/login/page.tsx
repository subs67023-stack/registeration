"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShieldCheck } from "lucide-react";
import Logo from "@/components/logo";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("Invalid email or password");
            } else {
                const response = await fetch("/api/auth/session");
                const session = await response.json();

                if (session?.user?.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push("/subadmin");
                }
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4 py-8">
            <div className="mb-8 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center p-3 mb-4 shadow-2xl border border-indigo-100">
                    <Logo width={60} height={60} />
                </div>
                <h1 className="text-3xl font-black text-indigo-950 tracking-tighter">Rotaract</h1>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Management Portal</p>
            </div>

            <Card className="w-full max-w-md shadow-[0_20px_50px_rgba(79,70,229,0.1)] border-none rounded-[2rem] overflow-hidden">
                <CardHeader className="space-y-1 bg-indigo-900 text-white p-8">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-black tracking-tight">Sign In</CardTitle>
                        <ShieldCheck className="h-6 w-6 text-indigo-300 opacity-50" />
                    </div>
                    <p className="text-xs text-indigo-200 opacity-70">
                        Authorized personnel only. Enter your credentials.
                    </p>
                </CardHeader>
                <CardContent className="p-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-black ml-1">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    spellCheck={false}
                                    className="h-14 border-2 border-black bg-white focus:bg-white focus:border-indigo-600 transition-all rounded-xl text-black font-bold text-base placeholder:text-gray-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-black uppercase tracking-wider text-black ml-1">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-14 border-2 border-black bg-white focus:bg-white focus:border-indigo-600 transition-all rounded-xl text-black font-bold text-base placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                        {error && (
                            <Alert variant="destructive" className="rounded-xl">
                                <AlertDescription className="text-xs font-bold">{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all hover:shadow-lg active:scale-[0.98] rounded-xl" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "LOGIN TO DASHBOARD"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8 text-[10px] items-center flex space-x-2 text-gray-400 font-bold uppercase tracking-widest">
                <span>Public Portal</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <Link href="/register" className="text-indigo-600 hover:underline">Register Participant</Link>
            </div>
        </div>
    );
}
