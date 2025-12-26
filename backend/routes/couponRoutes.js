// backend/routes/couponRoutes.js
import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all valid coupons
// @route   GET /api/coupons
// @access  Public
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      validUntil: { $gt: new Date() }
    }).select('-__v').sort({ createdAt: -1 });
    
    res.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a new coupon (Admin only)
// @route   POST /api/coupons
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { code, discount, validUntil, minPurchase, maxDiscount } = req.body;
    
    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    
    const coupon = new Coupon({
      code: code.toUpperCase(),
      discount,
      validUntil: new Date(validUntil),
      minPurchase: minPurchase || 0,
      maxDiscount: maxDiscount || null
    });

    await coupon.save();
    
    // Remove sensitive data before sending response
    const { __v, ...couponResponse } = coupon.toObject();
    
    res.status(201).json(couponResponse);
  } catch (error) {
    console.error('Error creating coupon:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public
router.post('/validate', async (req, res) => {
  try {
    const { code, totalAmount = 0 } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      validUntil: { $gt: new Date() }
    });
    
    if (!coupon) {
      return res.status(404).json({ 
        isValid: false,
        message: 'Invalid or expired coupon code' 
      });
    }
    
    // Check minimum purchase amount
    if (totalAmount < (coupon.minPurchase || 0)) {
      return res.status(400).json({
        isValid: false,
        message: `Minimum purchase amount of $${coupon.minPurchase} required`
      });
    }
    
    // Calculate discount amount
    let discountAmount = (totalAmount * coupon.discount) / 100;
    
    // Apply max discount if set
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
    
    res.json({
      isValid: true,
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        discountAmount,
        totalAfterDiscount: (totalAmount - discountAmount).toFixed(2)
      }
    });
    
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;