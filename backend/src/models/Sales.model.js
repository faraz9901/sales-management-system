import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    invoiceNumber: { type: Number, required: true },
}, { timestamps: true });

export const Sales = mongoose.model('Sales', salesSchema);