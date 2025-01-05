import PDFDocumet from "pdfkit"

export default function createPdf(details, res) {
    try {
        const doc = new PDFDocumet({ size: "A4" });

        // Pipe the document to the response stream
        doc.pipe(res);

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');

        doc.font('Helvetica-Bold').fontSize(20).text("Sales Tracker", 50, 50);


        doc.font('Helvetica-Bold').fontSize(25).text("Invoice", 1, 50, { align: "right" });

        doc.font("Helvetica").fontSize(12).text(`
            To
            ${details.customerName}
            `, 10, 100)

        doc.font("Helvetica").fontSize(12).text(`
            Invoice No: ${details.invoiceNumber}
            Date: ${new Date(details.date).toLocaleDateString('en-GB')}`
            , 10, 100, { align: "right" })


        doc.font('Helvetica-Bold').text('Product', 60, 200)
        doc.font('Helvetica-Bold').text(details.product, 60, 200, { align: "right" })

        doc.font('Helvetica').text('Unit Price ', 60, 240)
        doc.text("Rs." + details.price, 1, 240, { align: "right" })

        doc.font('Helvetica').text('Quantity ', 60, 280)
        doc.text(details.quantity, 1, 280, { align: "right" })

        // Total Horizonatal line 
        doc.moveTo(50, 320) // Start point
            .lineTo(550, 320) // End point
            .stroke()

        doc.font('Helvetica-Bold').text('Total Paid ', 60, 340)
        doc.text("Rs." + details.price * details.quantity, 1, 340, { align: "right" })

        doc.font('Helvetica-BoldOblique').text('Thank you for your business', 60, 400, { align: "center" });
        doc.font('Helvetica').text('For any queries in regards to this invoice, please contact salestracker@gmail.com', 60, 440);

        doc.end();
    }
    catch (error) {
        console.error('Error generating PDF:', error);
    }
}
