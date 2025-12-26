import Product from "../models/Product.js";

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const { limit = 10, sort, page = 1, ...filters } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = Product.find(filters);

    if (sort) {
      query = query.sort(sort);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    // Get total count for pagination
    const total = await Product.countDocuments(filters);

    // Apply pagination
    const products = await query.skip(skip).limit(limitNum);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// GET /api/products/:idOrSlug
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// GET /api/products/search?q=
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const products = await Product.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ],
    }).limit(50);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    console.log("Creating product with data:", req.body);

    // Auto-generate slug if not provided
    let { title, slug, stockQuantity, stockQty, sizes, ...otherData } = req.body;

    if (!slug && title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      // Append timestamp to ensure uniqueness
      slug = `${slug}-${Date.now()}`;
    }

    // Map stockQuantity to stockQty if needed
    const finalStockQty = stockQty !== undefined ? stockQty : (stockQuantity !== undefined ? stockQuantity : 0);

    const productData = {
      ...otherData,
      title,
      slug,
      stockQty: finalStockQty,
      sizes
    };

    const product = await Product.create(productData);

    // Safely emit socket event
    if (req.app.locals.io) {
      try {
        req.app.locals.io.emit("product:updated", product);
      } catch (socketError) {
        console.error("Socket emit failed:", socketError);
      }
    }

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Create failed", error: error.message });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "Not found" });

    if (req.app.locals.io) {
      try {
        req.app.locals.io.emit("product:updated", updated);
      } catch (socketError) {
        console.error("Socket emit failed:", socketError);
      }
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    console.log("Deleting product with ID:", req.params.id);
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      console.log("Product not found for deletion");
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.app.locals.io) {
      try {
        req.app.locals.io.emit("product:updated", { _id: req.params.id, deleted: true });
      } catch (socketError) {
        console.error("Socket emit failed:", socketError);
      }
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
