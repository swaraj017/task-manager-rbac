import { useState, useEffect } from "react";
import { taskAPI } from "../services/api.js";

export default function UserDashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskAPI.getUserTasks();
      setTasks(res.data);
    } catch (err) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      setTasks(
        tasks.map(t =>
          t._id === taskId ? { ...t, status: newStatus } : t
        )
      );
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

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "PENDING").length,
    inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
    completed: tasks.filter(t => t.status === "COMPLETED").length
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-64 bg-gray-100 border-r border-gray-300 flex flex-col">
        <div className="p-6 border-b border-gray-300">
          <h1 className="text-xl font-bold text-black">Task Manager</h1>
          <p className="text-sm text-gray-600 mt-1">User Dashboard</p>
          <p className="text-sm text-gray-700 mt-3">Welcome, {user.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            <div
              onClick={() => setFilter("all")}
              className={`p-4 rounded-lg cursor-pointer transition ${
                filter === "all"
                  ? "bg-gray-400 text-white border-l-4 border-black"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <p className="text-sm font-medium">Total Tasks</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>

            <div
              onClick={() => setFilter("PENDING")}
              className={`p-4 rounded-lg cursor-pointer transition ${
                filter === "PENDING"
                  ? "bg-gray-400 text-white border-l-4 border-black"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <p className="text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold">
                {stats.pending}
              </p>
            </div>

            <div
              onClick={() => setFilter("IN_PROGRESS")}
              className={`p-4 rounded-lg cursor-pointer transition ${
                filter === "IN_PROGRESS"
                  ? "bg-gray-400 text-white border-l-4 border-black"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <p className="text-sm font-medium">In Progress</p>
              <p className="text-2xl font-bold">
                {stats.inProgress}
              </p>
            </div>

            <div
              onClick={() => setFilter("COMPLETED")}
              className={`p-4 rounded-lg cursor-pointer transition ${
                filter === "COMPLETED"
                  ? "bg-gray-400 text-white border-l-4 border-black"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <p className="text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-300">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-300 px-8 py-6">
          <h2 className="text-2xl font-bold text-black">My Tasks</h2>
          <p className="text-gray-700 mt-1">
            You have {filteredTasks.length} task(s)
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-700">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 text-lg">No tasks assigned yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(task => (
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
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>
                      {task.workspace?.name || "Unknown Workspace"}
                    </span>
                    <span>
                      Created by {task.createdBy?.name || "Unknown"}
                    </span>
                  </div>

                  {task.status !== "COMPLETED" && (
                    <div className="flex gap-2">
                      {task.status !== "IN_PROGRESS" && (
                        <button
                          onClick={() =>
                            handleStatusChange(task._id, "IN_PROGRESS")
                          }
                          className="flex-1 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition"
                        >
                          Start Task
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleStatusChange(task._id, "COMPLETED")
                        }
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
                      >
                        Mark Complete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
