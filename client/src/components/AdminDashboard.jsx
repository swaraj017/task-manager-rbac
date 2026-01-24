import { useState, useEffect } from "react";
import { workspaceAPI, userAPI, taskAPI } from "../services/api.js";
import WorkspaceList from "./WorkspaceList.jsx";
import CreateWorkspaceModal from "./CreateWorkspaceModal.jsx";
import ManageTasks from "./ManageTasks.jsx";

export default function AdminDashboard({ user }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("workspaces");

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const res = await workspaceAPI.getMyWorkspaces();
      setWorkspaces(res.data);
      if (res.data.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(res.data[0]._id);
      }
    } catch (err) {
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (name) => {
    try {
      await workspaceAPI.create({ name });
      setShowCreateWorkspace(false);
      fetchWorkspaces();
    } catch (err) {
      setShowCreateWorkspace(false);
    }
  };

  const handleDeleteWorkspace = async (id) => {
    if (confirm("Delete this workspace and all its tasks?")) {
      try {
        await workspaceAPI.delete(id);
        setSelectedWorkspace(null);
        fetchWorkspaces();
      } catch (err) {
        alert("Failed to delete workspace");
      }
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-64 bg-gray-100 border-r border-gray-300 flex flex-col">
        <div className="p-6 border-b border-gray-300">
          <h1 className="text-xl font-bold text-black">Task Manager</h1>
          <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
          <p className="text-sm text-gray-700 mt-3">Welcome, {user.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("workspaces")}
              className={`w-full text-left px-4 py-2 rounded transition ${
                activeTab === "workspaces"
                  ? "bg-gray-300 text-black font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Workspaces
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`w-full text-left px-4 py-2 rounded transition ${
                activeTab === "tasks"
                  ? "bg-gray-300 text-black font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tasks
            </button>
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
        <div className="bg-gray-50 border-b border-gray-300 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">
            {activeTab === "workspaces" ? "Manage Workspaces" : "Manage Tasks"}
          </h2>
          {activeTab === "workspaces" && (
            <button
              onClick={() => setShowCreateWorkspace(true)}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
            >
              + Create Workspace
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-700">Loading...</p>
            </div>
          ) : activeTab === "workspaces" ? (
            <>
              <WorkspaceList
                workspaces={workspaces}
                selectedWorkspace={selectedWorkspace}
                onSelect={setSelectedWorkspace}
                onDelete={handleDeleteWorkspace}
              />
            </>
          ) : (
            <ManageTasks workspaces={workspaces} />
          )}
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateWorkspace && (
        <CreateWorkspaceModal
          onCreate={handleCreateWorkspace}
          onClose={() => setShowCreateWorkspace(false)}
        />
      )}
    </div>
  );
}
