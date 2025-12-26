import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: String },
  tags: [{ type: String }],
  stockQty: { type: Number, default: 0 },
  sku: { type: String },
  targetAudience: { type: String, enum: ['Men', 'Women', 'Kids', 'Unisex'], default: 'Unisex' },
  collection: { type: String, enum: ['New Arrival', 'Best Seller', 'Featured', 'None', 'Trending Now', 'Daily Wear', 'Festive', 'Back to School'], default: 'None' },
  type: { type: String, enum: ['Clothing', 'Footwear', 'Accessory'], default: 'Clothing' },
  sizes: [{ type: String }],
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
