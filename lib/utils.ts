import { differenceInYears } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function calculateAge(dob: string | Date): number {
    const birthDate = typeof dob === "string" ? new Date(dob) : dob;
    return differenceInYears(new Date(), birthDate);
}

export function getAgeGroupAndFee(age: number) {
    if (age <= 12) {
        return { ageGroup: "0-12", fee: 100 };
    } else if (age >= 13 && age <= 16) {
        return { ageGroup: "13-16", fee: 150 };
    } else {
        return { ageGroup: "Open", fee: 250 };
    }
}

export function generateRegistrationNumber() {
    const prefix = "REG";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `${prefix}${timestamp}${random}`;
}
