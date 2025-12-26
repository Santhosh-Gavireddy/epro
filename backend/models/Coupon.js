// backend/models/Coupon.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  validUntil: {
    type: Date,
    required: true
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster querying
couponSchema.index({ code: 1, isActive: 1 });

// Add a method to check if coupon is valid
couponSchema.methods.isValid = function() {
  return this.isActive && new Date(this.validUntil) > new Date();
};

// Create and export the model
const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;