import ExcelJS from 'exceljs';

export const createExcelFile = async (columns, rows, filename, res) => {// Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Add columns to the worksheet
    worksheet.columns = columns


    // Add rows to the worksheet
    rows.forEach((row) => {
        worksheet.addRow(row);
    })

    // Set response headers for file download
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}.xlsx"`
    );

    // Write the workbook to the response stream
    await workbook.xlsx.write(res);

    // End the response
    res.end();
}