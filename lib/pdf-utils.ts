import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const generateRegistrationPDF = (registration: any) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(63, 81, 181); // Indigo color
    doc.text("REGISTRATION RECEIPT", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${format(new Date(), "PPPpp")}`, 105, 28, { align: "center" });

    // Divider
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    // Content
    autoTable(doc, {
        startY: 40,
        head: [["Field", "Value"]],
        body: [
            ["Registration No", registration.registrationNumber],
            ["Name", registration.name],
            ["Date of Birth", format(new Date(registration.dob), "PPP")],
            ["Age", registration.age.toString()],
            ["Age Group", registration.ageGroup],
            ["Gender", registration.gender],
            ["Kit Size", registration.kitSize || "N/A"],
            ["Aadhar No", registration.aadharNo],
            ["Phone", registration.phone],
            ["School/College", registration.schoolCollege],
            ["Village", registration.village],
            ["Fees Paid", `Rs. ${registration.fees}`],
            ["Payment Method", registration.paymentMethod],
        ],
        theme: "striped",
        headStyles: { fillColor: [63, 81, 181] },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Authorized Signature", 150, finalY);
    doc.line(140, finalY - 5, 185, finalY - 5);

    doc.save(`receipt-${registration.registrationNumber}.pdf`);
};

export const generateReportPDF = (title: string, data: any[], totals: { count: number; amount: number }) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "PPP")}`, 105, 22, { align: "center" });

    const body = data.map((item, index) => [
        index + 1,
        item.registrationNumber,
        item.name,
        item.ageGroup,
        item.kitSize || "N/A",
        item.aadharNo,
        item.phone,
        item.fees,
        item.paymentMethod,
        item.subadmin?.name || "N/A"
    ]);

    autoTable(doc, {
        startY: 30,
        head: [["S.No", "Reg No", "Name", "Group", "Kit", "Aadhar", "Phone", "Fee", "Method", "SubAdmin"]],
        body: body,
        foot: [["", "TOTAL", "", "", "", "", "", `Rs. ${totals.amount}`, "", ""]],
        theme: "grid",
        headStyles: { fillColor: [63, 81, 181] },
        styles: { fontSize: 6.5 }
    });

    doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
};
