"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import FreeKitForm from "./free-kit-form";

interface EditFreeKitSheetProps {
    freeKit: any | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditFreeKitSheet({
    freeKit,
    open,
    onOpenChange,
}: EditFreeKitSheetProps) {
    if (!freeKit) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0 border-none bg-gray-50">
                <SheetHeader className="p-6 bg-white border-b sticky top-0 z-20">
                    <SheetTitle className="text-2xl font-black text-indigo-950 tracking-tighter">Edit Free Kit</SheetTitle>
                    <SheetDescription className="font-bold text-gray-400 text-xs uppercase tracking-widest">
                        Update details for {freeKit.name}
                    </SheetDescription>
                </SheetHeader>
                <div className="p-4 md:p-8">
                    <FreeKitForm 
                        initialData={freeKit} 
                        onSuccess={() => onOpenChange(false)} 
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
