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
        const registrationNumber = generateRegistrationNumber();

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
