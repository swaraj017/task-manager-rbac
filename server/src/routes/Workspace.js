import express from "express";
import {
  createWorkspace,
  getMyWorkspaces,
  getAllWorkspaces,
  getWorkspaceDetails,
  updateWorkspace,
  deleteWorkspace
} from "../controllers/Workspace.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import Task from "../models/Task.js";

const router = express.Router();

// Admin routes
router.post("/", auth, isAdmin, createWorkspace);
router.get("/", auth, isAdmin, getMyWorkspaces);
router.get("/all", auth, isAdmin, getAllWorkspaces);
router.get("/:id", auth, isAdmin, getWorkspaceDetails);
router.patch("/:id", auth, isAdmin, updateWorkspace);
router.delete("/:id", auth, isAdmin, deleteWorkspace);

// Get workspace tasks
router.get("/:id/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ workspace: req.params.id })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

export default router;
