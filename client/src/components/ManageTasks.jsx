import { useState, useEffect } from "react";
import { workspaceAPI, taskAPI, userAPI } from "../services/api.js";
import CreateTaskModal from "./CreateTaskModal.jsx";

export default function ManageTasks({ workspaces }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState(
    workspaces.length > 0 ? workspaces[0]._id : null
  );
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

  useEffect(() => {
    if (selectedWorkspace) {
      fetchTasks();
      fetchUsers();
    }
  }, [selectedWorkspace]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await workspaceAPI.getTasks(selectedWorkspace);
      setTasks(res.data);
    } catch (err) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskAPI.create(selectedWorkspace, taskData);
      setShowCreateTask(false);
      fetchTasks();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm("Delete this task?")) {
      try {
        await taskAPI.delete(taskId);
        fetchTasks();
      } catch (err) {
        alert("Failed to delete task");
      }
    }
  };

  const handleAssignTask = async (taskId, userId) => {
    try {
      await taskAPI.update(taskId, { assignedTo: userId });
      fetchTasks();
    } catch (err) {
      alert("Failed to assign task");
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      await taskAPI.updateStatus(taskId, status);
      fetchTasks();
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-gray-100 text-gray-800";
      case "IN_PROGRESS":
        return "bg-gray-200 text-gray-800";
      case "COMPLETED":
        return "bg-gray-300 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const workspace = workspaces.find(w => w._id === selectedWorkspace);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Workspace
        </label>
        <select
          value={selectedWorkspace || ""}
          onChange={(e) => setSelectedWorkspace(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          {workspaces.map(ws => (
            <option key={ws._id} value={ws._id}>
              {ws.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-black">
            Tasks in {workspace?.name}
          </h3>
          <p className="text-gray-700 mt-1">{tasks.length} task(s)</p>
        </div>
        <button
          onClick={() => setShowCreateTask(true)}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
        >
          + Create Task
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-700">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-300">
            <p className="text-gray-700 text-lg">No tasks yet</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task._id}
              className="bg-white rounded-lg border border-gray-300 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-700 text-sm mt-2">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status === "PENDING"
                      ? "Pending"
                      : task.status === "IN_PROGRESS"
                        ? "In Progress"
                        : "Completed"}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-gray-700 hover:text-black font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Assigned To</p>
                  <select
                    value={task.assignedTo?._id || ""}
                    onChange={(e) =>
                      handleAssignTask(task._id, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleUpdateStatus(task._id, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Assigned User</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {task.assignedTo?.name || "Unassigned"}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600">
                Created by {task.createdBy?.name || "Unknown"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          users={users}
          onCreate={handleCreateTask}
          onClose={() => setShowCreateTask(false)}
        />
      )}
    </div>
  );
}
