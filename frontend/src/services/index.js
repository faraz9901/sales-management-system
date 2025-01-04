import axios from 'axios'

export const request = axios.create({
    baseURL: "https://sales-management-system-server.onrender.com/api/v1/",
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

export const getDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB')
}

export function formatToCurrencySystem(num) {

    if (!num) return num;

    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}




export const ProductCategories = [
    "Fashion & Apparel",
    "Electronics & Gadgets",
    "Home & Furniture",
    "Books, Media & Entertainment",
    "Health & Beauty",
    "Grocery & Food",
    "Automotive",
    "Sports & Outdoors",
    "Baby & Kids",
    "Luxury Goods"
];

export const validateForm = (data) => {
    const errors = {}
    if (!data.customerName) {
        errors.customerName = "Customer name is required"
    }

    if (!data.product) {
        errors.product = "Product is required"
    }

    if (!data.price) {
        errors.price = "Price is required"
    } else if (isNaN(data.price)) {
        errors.price = "Price should be a number"
    }

    if (!data.date) {
        errors.date = "Date is required"
    } else if (new Date(data.date) > new Date()) {
        errors.date = "Date should be in the past"
    }

    if (!data.quantity) {
        errors.quantity = "Quantity is required"
    } else if (isNaN(data.quantity)) {
        errors.quantity = "Quantity should be a number"
    }

    if (!data.category) {
        errors.category = "Category is required"
    }
    return errors
}


export function tableToCSV(table, output_file_name) {
    let csvContent = "";
    for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i];
        let rowData = [];
        // Iterate through each cell in the row
        for (let j = 0; j < row.cells.length; j++) {
            rowData.push(row.cells[j].textContent);
        }
        csvContent += rowData.join(",") + "\n";
    }
    downloadCsv(csvContent, output_file_name)
}

const downloadCsv = (csv_string, output_file_name) => {
    const blob = new Blob([csv_string], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${output_file_name}.csv`;
    link.click();
    link.remove()
}