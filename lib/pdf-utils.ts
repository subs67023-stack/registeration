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

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${registration.registrationNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const generateKitAnalysisPDF = (data: any[]) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(63, 81, 181);
    doc.text("KIT SIZE ANALYSIS REPORT", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${format(new Date(), "PPPpp")}`, 105, 28, { align: "center" });

    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    const body: any[] = [];
    const ageGroups = ["6-12", "13-17", "Open"];
    
    let grandTotal = 0;

    ageGroups.forEach(group => {
        const groupData = data.filter(r => !r.isFree && r.ageGroup === group);
        const sizes = Array.from(new Set(groupData.map(r => r.kitSize).filter(Boolean))) as string[];
        
        if (groupData.length > 0) {
            body.push([{ content: `Category: ${group}`, colSpan: 3, styles: { fillColor: [240, 240, 240], fontStyle: 'bold' } }]);
            
            let groupTotal = 0;
            sizes.forEach(size => {
                const count = groupData.filter(r => r.kitSize === size).length;
                body.push(["", size, count]);
                groupTotal += count;
            });
            
            body.push([{ content: `Total for ${group}`, colSpan: 2, styles: { fontStyle: 'bold' } }, groupTotal]);
            grandTotal += groupTotal;
        }
    });

    // Add Free Kits Section
    const freeKitsData = data.filter(r => r.isFree);
    if (freeKitsData.length > 0) {
        body.push([{ content: "Category: Free Kits (Committee)", colSpan: 3, styles: { fillColor: [240, 240, 240], fontStyle: 'bold' } }]);
        const sizes = Array.from(new Set(freeKitsData.map(r => r.kitSize).filter(Boolean))) as string[];
        let groupTotal = 0;
        sizes.forEach(size => {
            const count = freeKitsData.filter(r => r.kitSize === size).length;
            body.push(["", size, count]);
            groupTotal += count;
        });
        body.push([{ content: "Total for Free Kits", colSpan: 2, styles: { fontStyle: 'bold' } }, groupTotal]);
        grandTotal += groupTotal;
    }

    body.push([{ content: "GRAND TOTAL", colSpan: 2, styles: { fillColor: [63, 81, 181], textColor: [255, 255, 255], fontStyle: 'bold' } }, { content: grandTotal.toString(), styles: { fillColor: [63, 81, 181], textColor: [255, 255, 255], fontStyle: 'bold' } }]);

    autoTable(doc, {
        startY: 40,
        head: [["Group", "Kit Size", "Quantity"]],
        body: body,
        theme: "grid",
        headStyles: { fillColor: [63, 81, 181] },
    });

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kit-analysis-${format(new Date(), "yyyy-MM-dd")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
