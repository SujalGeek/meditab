// models/Billing.model.js
import mongoose, { Schema, model } from "mongoose";

const prescriptionSchema = new Schema({
    medicines: [
        {
            medicineName: {
                type: String,
                required: true,
            },
            dosage: {
                type: String,
                required: true,
            },
            duration: {
                type: String,
                required: true,
            }
        }
    ],
    notes:{
        type:String,

    },
});

const billItemSchema = new Schema({
    medicineName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    subtotal: {
        type: Number,
        required: true,
    }
});

const billingSchema = new Schema({
    patientName: {
        type: String,
        required: true,
    },
    doctorName: {
        type: String,
        required: true,
    },
    prescription: [prescriptionSchema],
    items: [billItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    tax: {
        type: Number,
        default: 0,
    },
    finalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Insurance'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Partially Paid', 'Refunded'],
        default: 'Pending',
    },
    notes: String,
    issuedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

export const Billing = model("Billing", billingSchema);