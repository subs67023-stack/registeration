"use server";

import { prisma } from "@/lib/prisma";
import { generateRegistrationNumber, calculateAge, getAgeGroupAndFee } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function registerParticipant(formData: any) {
    try {
        const {
            name,
            dob,
            gender,
            kitSize,
            aadharNo,
            schoolCollege,
            village,
            phone,
            paymentMethod,
            subadminId,
        } = formData;

        const age = calculateAge(new Date(dob));
        const { ageGroup, fee } = getAgeGroupAndFee(age);

        // Sequential Registration Number REG0001 to REG9999
        // Fetch registrations to determine the next sequential number.
        // We filter in memory to ignore old timestamp-based numbers.
        const recentRegistrations = await prisma.registration.findMany({
            where: {
                registrationNumber: {
                    startsWith: 'REG',
                },
            },
            select: { registrationNumber: true }
        });

        let nextNumber = 1;
        const validNumbers = recentRegistrations
            .map((r: { registrationNumber: string }) => r.registrationNumber)
            .filter((num: string) => num.length <= 8) // Accommodate up to REG99999 just in case
            .map((num: string) => parseInt(num.replace('REG', ''), 10))
            .filter((num: number) => !isNaN(num));

        if (validNumbers.length > 0) {
            nextNumber = Math.max(...validNumbers) + 1;
        }

        const registrationNumber = `REG${nextNumber.toString().padStart(4, '0')}`;

        const registration = await prisma.registration.create({
            data: {
                registrationNumber,
                name,
                dob: new Date(dob),
                age,
                gender,
                kitSize,
                aadharNo,
                schoolCollege,
                village,
                phone,
                ageGroup,
                fees: fee,
                paymentMethod,
                subadminId: subadminId || null,
            },
        });

        revalidatePath("/admin");
        revalidatePath("/subadmin");
        revalidatePath("/admin/registrations");

        return { success: true, registration };
    } catch (error: any) {
        console.error("Registration error:", error);
        return { success: false, error: error.message };
    }
}

export async function createSubadmin(data: any) {
    try {
        const { name, email, password } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, error: "Email already exists" };
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
                role: "SUBADMIN",
            },
        });

        revalidatePath("/admin/users");
        return { success: true, user };
    } catch (error: any) {
        console.error("Create subadmin error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteSubadmin(id: string) {
    try {
        await prisma.user.delete({
            where: { id },
        });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteRegistration(id: string) {
    try {
        await prisma.registration.delete({
            where: { id },
        });
        revalidatePath("/admin");
        revalidatePath("/subadmin");
        revalidatePath("/admin/registrations");
        return { success: true };
    } catch (error: any) {
        console.error("Delete registration error:", error);
        return { success: false, error: error.message };
    }
}

export async function updateRegistration(id: string, formData: any) {
    try {
        const {
            name,
            dob,
            gender,
            kitSize,
            aadharNo,
            schoolCollege,
            village,
            phone,
            paymentMethod,
        } = formData;

        const age = calculateAge(new Date(dob));
        const { ageGroup, fee } = getAgeGroupAndFee(age);

        const registration = await prisma.registration.update({
            where: { id },
            data: {
                name,
                dob: new Date(dob),
                age,
                gender,
                kitSize,
                aadharNo,
                schoolCollege,
                village,
                phone,
                ageGroup,
                fees: fee,
                paymentMethod,
            },
        });

        revalidatePath("/admin");
        revalidatePath("/subadmin");
        revalidatePath("/admin/registrations");

        return { success: true, registration };
    } catch (error: any) {
        console.error("Update registration error:", error);
        return { success: false, error: error.message };
    }
}
