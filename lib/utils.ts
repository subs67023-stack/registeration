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
    if (age >= 6 && age <= 12) {
        return { ageGroup: "6-12", fee: 150 };
    } else if (age >= 13 && age <= 17) {
        return { ageGroup: "13-17", fee: 200 };
    } else if (age >= 18 && age <= 60) {
        return { ageGroup: "Open", fee: 250 };
    } else {
        return { ageGroup: "N/A", fee: 0 };
    }
}

export function generateRegistrationNumber() {
    const prefix = "REG";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `${prefix}${timestamp}${random}`;
}
