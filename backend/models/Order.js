import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    price: Number,
  }],
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
  },
  paymentMethod: String,
  totalPrice: Number,
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  status: { type: String, default: "pending" }, // pending, processing, shipped, delivered, cancelled
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
