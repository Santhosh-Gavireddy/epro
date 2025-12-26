import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import bcrypt from "bcryptjs";

dotenv.config();
await connectDB();

const seed = async () => {
  try {
    // remove existing
    await User.deleteMany();
    await Product.deleteMany();

    const admins = [
      { name: "Admin One", email: "admin1@epro.com", password: "Admin@123", isAdmin: true },
      { name: "Admin Two", email: "admin2@epro.com", password: "Admin@123", isAdmin: true },
      { name: "Admin Three", email: "admin3@epro.com", password: "Admin@123", isAdmin: true },
    ];

    for (const a of admins) {
      const salt = await bcrypt.genSalt(10);
      a.password = await bcrypt.hash(a.password, salt);
    }

    await User.insertMany(admins);

    const products = [
      { title: "Demo Backpack", slug: "demo-backpack", description: "Stylish backpack", price: 1299, images: ["https://via.placeholder.com/600x400"], stockQty: 20, category: "Bags", tags: ["backpack","bag"] },
      { title: "Classic Sneakers", slug: "classic-sneakers", description: "Comfort sneakers", price: 3499, images: ["https://via.placeholder.com/600x400"], stockQty: 10, category: "Footwear", tags: ["sneakers","shoes"] },
      { title: "Wireless Headphones", slug: "wireless-headphones", description: "Noise-cancelling", price: 4999, images: ["https://via.placeholder.com/600x400"], stockQty: 5, category: "Audio", tags: ["headphones","audio"] },
    ];

    await Product.insertMany(products);

    console.log("Seed completed");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
