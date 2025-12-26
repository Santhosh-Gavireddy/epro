import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import products from "./products_data.js";

dotenv.config();

const importData = async () => {
    try {
        await connectDB();

        console.log("Connected to MongoDB...");

        for (const p of products) {
            // Map SKU to sku, and ensure other fields are correct
            const productToInsert = {
                ...p,
                sku: p.SKU, // Map SKU to sku
            };
            // Remove SKU if it exists in the object keys to avoid strict mode errors (if any) or just cleaner object
            delete productToInsert.SKU;

            // Upsert: Update if exists, Insert if not. Match by slug.
            await Product.findOneAndUpdate(
                { slug: productToInsert.slug },
                productToInsert,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`Processed: ${productToInsert.title}`);
        }

        console.log("All products imported successfully!");
        process.exit();
    } catch (err) {
        console.error("Error with import:", err);
        process.exit(1);
    }
};

importData();
