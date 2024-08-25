import mongoose from "mongoose";
import { Billing } from "./billing.model.js";

const paymentSchema = new mongoose.Schema({
  bill:{
    type: mongoose.Schema.Types.ObjectId,
    ref: Billing,
    required: true,
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);