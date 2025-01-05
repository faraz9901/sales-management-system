import dotenv from 'dotenv'
import mongoose from "mongoose";
import { createUsersforTesting } from '../controllers/user.controller.js';

dotenv.config()

export const env = {
    DB_URL: process.env.DB_URL,
    PORT: process.env.PORT,
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
    JWT_SECRET: process.env.JWT_SECRET
}


export async function connectToDatabase() {
    try {
        await mongoose.connect(env.DB_URL);
        console.log('Connected to MongoDB');
        await createUsersforTesting()
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export const getDateAndTime = (date) => {
    if (date) {
        const now = new Date(date);

        // Get current date and time components
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Format the date and time as a string
        return `${year}-${month}-${day} - ${hours}:${minutes}:${seconds}`;
    }

    return "";
}


export const recordHeaders = [
    { header: "Customer Name", key: "customerName", width: 15 },
    { header: "Product", key: "product", width: 15 },
    { header: "Quantity", key: "quantity", width: 15 },
    { header: "Price", key: "price", width: 15 },
    { header: "Category", key: "category", width: 15 },
    { header: "Date", key: "date", width: 15 },
    { header: "Invoice Number", key: "invoiceNumber", width: 15 }
]

export const logHeaders = [
    { header: "Date", key: "date", width: 50 },
    { header: "Action", key: "message", width: 150 },
]


