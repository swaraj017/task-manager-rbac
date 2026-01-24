import Workspace from "../models/WorkSpace.js";
import Task from "../models/Task.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name required" });
    }

    const workspace = await Workspace.create({
      name,
      createdBy: req.user.userId
    });

    res.status(201).json({
      message: "Workspace created",
      workspace
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create workspace" });
  }
};

export const getMyWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ createdBy: req.user.userId })
      .populate("createdBy", "name email");

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workspaces" });
  }
};

export const getAllWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ isActive: true })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workspaces" });
  }
};

export const getWorkspaceDetails = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workspace" });
  }
};

export const updateWorkspace = async (req, res) => {
  try {
    const { name, isActive } = req.body;

    const workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { name, isActive },
      { new: true }
    );

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json({ message: "Workspace updated", workspace });
  } catch (err) {
    res.status(500).json({ message: "Failed to update workspace" });
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndDelete(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    await Task.deleteMany({ workspace: req.params.id });

    res.json({ message: "Workspace deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete workspace" });
  }
};
