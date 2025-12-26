import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  createOrder,
  getOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getDashboardStats
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/stats", protect, authorize("admin"), getDashboardStats); // Stats before :id
router.get("/:id", protect, getOrder);

// admin
router.get("/", protect, authorize("admin"), getAllOrders);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

// user cancel
router.put("/:id/cancel", protect, cancelOrder);

export default router;
