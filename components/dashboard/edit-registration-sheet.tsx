"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import RegistrationForm from "@/components/registration-form";

interface EditRegistrationSheetProps {
    registration: any | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditRegistrationSheet({
    registration,
    open,
    onOpenChange,
}: EditRegistrationSheetProps) {
    if (!registration) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0 border-none bg-gray-50">
                <SheetHeader className="p-6 bg-white border-b sticky top-0 z-20">
                    <SheetTitle className="text-2xl font-black text-indigo-950 tracking-tighter">Edit Registration</SheetTitle>
                    <SheetDescription className="font-bold text-gray-400 text-xs uppercase tracking-widest">
                        Update details for {registration.registrationNumber}
                    </SheetDescription>
                </SheetHeader>
                <div className="p-4 md:p-8">
                    <RegistrationForm 
                        initialData={registration} 
                        onSuccess={() => onOpenChange(false)} 
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
