"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { createSubadmin, deleteSubadmin } from "@/lib/actions";
import { format } from "date-fns";

export default function SubadminManagement({ initialSubadmins }: { initialSubadmins: any[] }) {
    const [subadmins, setSubadmins] = useState(initialSubadmins);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await createSubadmin(formData);
            if (res.success) {
                setSubadmins([res.user, ...subadmins]);
                setFormData({ name: "", email: "", password: "" });
            } else {
                setError(res.error || "Failed to create subadmin");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subadmin?")) return;

        try {
            const res = await deleteSubadmin(id);
            if (res.success) {
                setSubadmins(subadmins.filter(s => s.id !== id));
            }
        } catch (err) {
            alert("Failed to delete subadmin");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 shadow-md h-fit sticky top-8">
                <CardHeader className="bg-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="text-xl font-bold flex items-center">
                        <Plus className="mr-2 h-5 w-5" />
                        Add New Subadmin
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-indigo-950 font-semibold">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Subadmin Name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-indigo-950 font-semibold">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="subadmin@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-indigo-950 font-semibold">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold h-11" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-md">
                <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-xl font-bold text-gray-800">Existing Subadmins</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="font-bold">Name</TableHead>
                                <TableHead className="font-bold">Email</TableHead>
                                <TableHead className="font-bold">Joined On</TableHead>
                                <TableHead className="text-right font-bold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subadmins.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-gray-500 italic">
                                        No subadmins created yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subadmins.map((sub) => (
                                    <TableRow key={sub.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="font-medium text-gray-900">{sub.name}</TableCell>
                                        <TableCell className="text-gray-600">{sub.email}</TableCell>
                                        <TableCell className="text-gray-500 text-xs">
                                            {format(new Date(sub.createdAt), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(sub.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
