import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";

// Create order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalPrice } = req.body;
    console.log("Creating order with items:", items);
    if (!items || items.length === 0) return res.status(400).json({ message: "No items" });

    // Reduce stock (simple)
    for (const it of items) {
      const prod = await Product.findById(it.product);
      if (!prod) return res.status(400).json({ message: "Product not found" });
      if (prod.stockQty < it.quantity) return res.status(400).json({ message: `Not enough stock for ${prod.title || prod.slug}` });
      prod.stockQty -= it.quantity;
      await prod.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
      status: "pending",
    });

    // notify realtime
    req.app.get("io").emit("order:updated", order);

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message || "Server error creating order" });
  }
};

// Get order by id (owner or admin)
export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate({
      path: "items.product",
      select: "title images price"
    });
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  res.json(order);
};

// Get orders for logged in user
export const getMyOrders = async (req, res) => {
  try {
    console.log(`[getMyOrders] Fetching for user: ${req.user._id}`);
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    // If no orders found with direct match, try casting to verify
    if (orders.length === 0) {
      console.log('[getMyOrders] No orders found with direct ID match. Checking if ID type mismatch...');
    }
    console.log(`[getMyOrders] Found ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    console.error("Error in getMyOrders:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

// Admin: get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res.status(500).json({ message: "Server error fetching all orders" });
  }
};

// Admin update status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, isPaid } = req.body;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Not found" });
  if (status) order.status = status;
  if (typeof isPaid !== "undefined") {
    order.isPaid = !!isPaid;
    if (order.isPaid) {
      order.paidAt = new Date();
      // Auto-advance status to processing if it's currently pending
      if (order.status === 'pending') {
        order.status = 'processing';
      }
    }
  }
  await order.save();
  req.app.get("io").emit("order:updated", order);
  res.json(order);
};

// Cancel order (User)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Ensure user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized to cancel this order");
    }

    if (order.status !== 'pending') {
      res.status(400);
      throw new Error("Cannot cancel order that is not pending");
    }

    order.status = 'cancelled';
    const updatedOrder = await order.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('order:updated', updatedOrder);

    res.json(updatedOrder);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message || "Server error cancelling order" });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Revenue
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    // 2. Count of orders
    const ordersCount = await Order.countDocuments();

    // 3. Count of products
    const productsCount = await Product.countDocuments();

    // 3.5 Count of users and feedbacks
    const usersCount = await User.countDocuments();
    const feedbacksCount = await Feedback.countDocuments();

    // 4. Sales by Category (Pie Chart)
    // We need to unwind items to get product category
    const salesByCategory = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalSales: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      }
    ]);

    // 5. Monthly Sales (Bar Chart)
    const monthlySales = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersCount,
      productsCount,
      usersCount,
      feedbacksCount,
      salesByCategory,
      monthlySales
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
