import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const subadminId = searchParams.get("subadminId");

    try {
        const registrations = await prisma.registration.findMany({
            where: subadminId ? { subadminId } : {},
            include: { subadmin: true },
            orderBy: { createdAt: "desc" },
        });

        const doc = new PDFDocument();
        const buffers: any[] = [];
        doc.on("data", buffers.push.bind(buffers));

        return new Promise<Response>((resolve) => {
            doc.on("end", () => {
                const pdfData = Buffer.concat(buffers);
                resolve(
                    new Response(pdfData, {
                        headers: {
                            "Content-Type": "application/pdf",
                            "Content-Disposition": `attachment; filename=report-${type || "all"}.pdf`,
                        },
                    })
                );
            });

            // PDF Content
            doc.fontSize(20).text("Registration Report", { align: "center" });
            doc.fontSize(12).text(`Type: ${type || "All"}`, { align: "center" });
            doc.moveDown();

            registrations.forEach((reg: any, i: number) => {
                doc.text(`${i + 1}. ${reg.registrationNumber} - ${reg.name} (${reg.ageGroup}) - Fee: ${reg.fees}`);
            });

            doc.end();
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}
