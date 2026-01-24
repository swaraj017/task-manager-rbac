import express from "express";
import { registerUser, loginUser } from "../controllers/User.js";
import User from "../models/User.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// get current user  
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Search users by name
router.get("/search", auth, async (req, res) => {
  try {
    const users = await User.find({
      name: { $regex: req.query.q, $options: "i" },
      role: "user"
    }).select("_id name email");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to search users" });
  }
});

// Get all users (Admin only)
router.get("/list/all", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("_id name email")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;

