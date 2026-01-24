import { useState, useEffect } from "react";
import { workspaceAPI } from "../services/api.js";
import WorkspaceDetails from "./WorkspaceDetails.jsx";

export default function WorkspaceList({
  workspaces,
  selectedWorkspace,
  onSelect,
  onDelete
}) {
  const [showDetails, setShowDetails] = useState(false);

  if (workspaces.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700 text-lg">No workspaces yet</p>
        <p className="text-gray-600 mt-2">Create your first workspace to get started</p>
      </div>
    );
  }

  const current = workspaces.find(w => w._id === selectedWorkspace);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        {workspaces.map(workspace => (
          <div
            key={workspace._id}
            onClick={() => onSelect(workspace._id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition ${
              selectedWorkspace === workspace._id
                ? "border-black bg-gray-100"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {workspace.name}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Created on{" "}
                  {new Date(workspace.createdAt).toLocaleDateString()}
                </p>
              </div>
              {selectedWorkspace === workspace._id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(workspace._id);
                  }}
                  className="text-gray-700 hover:text-black font-semibold"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {current && (
        <div className="col-span-1">
          <WorkspaceDetails workspace={current} />
        </div>
      )}
    </div>
  );
}
