import express from "express";
import {
  createTask,
  getWorkspaceTasks,
  getUserTasks,
  updateTaskStatus,
  updateTask,
  deleteTask
} from "../controllers/Task.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// User routes
router.get("/my-tasks", auth, getUserTasks);
router.patch("/:taskId/status", auth, updateTaskStatus);

// Admin routes
router.post("/:workspaceId", auth, isAdmin, createTask);
router.get("/workspace/:id", auth, isAdmin, getWorkspaceTasks);
router.patch("/:taskId", auth, isAdmin, updateTask);
router.delete("/:taskId", auth, isAdmin, deleteTask);

export default router;
