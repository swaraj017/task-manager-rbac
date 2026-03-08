
import { useState, useEffect } from "react";
import { workspaceAPI } from "../services/api.js";

export default function WorkspaceDetails({ workspace }) {
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskCount();
  }, [workspace._id]);

  const fetchTaskCount = async () => {
    try {
      setLoading(true);
      const res = await workspaceAPI.getTasks(workspace._id);
      setTaskCount(res.data.length);
    } catch (err) {
      setTaskCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 sticky top-0">
      <h3 className="font-semibold text-black mb-4">Workspace Details</h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Name</p>
          <p className="font-semibold text-black">{workspace.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Created</p>
          <p className="font-semibold text-black">
            {new Date(workspace.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="font-semibold">
            <span className="inline-block px-3 py-1 rounded-full bg-gray-300 text-gray-800 text-sm">
              Active
            </span>
          </p>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-800">
            {loading ? "-" : taskCount}
          </p>
        </div>
      </div>
    </div>
  );
}
