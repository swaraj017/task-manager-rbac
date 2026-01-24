import Task from "../models/Task.js";
import User from "../models/User.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const { workspaceId } = req.params;

    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user.userId,
      workspace: workspaceId
    });

    await task.populate("assignedTo", "name email");
    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const getWorkspaceTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ workspace: req.params.workspaceId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId })
      .populate("createdBy", "name email")
      .populate("workspace", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { taskId } = req.params;

    if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    ).populate("assignedTo", "name email");

    res.json({ message: "Task updated", task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, assignedTo } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (!user) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, assignedTo },
      { new: true }
    ).populate("assignedTo", "name email");

    res.json({ message: "Task updated", task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};
