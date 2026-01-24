import { Link, Navigate } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // If already logged in, redirect to appropriate dashboard
  if (token && user) {
    const userData = JSON.parse(user);
    return <Navigate to={`/dashboard/${userData.role}`} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
         
        <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
          <div className="text-6xl mb-6">✓</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600 mb-8">
            Manage workspaces, assign tasks, and track progress
          </p>

          <div className="space-y-3">
            <Link
              to="/login"
              className="block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="block bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
            >
              Create Account
            </Link>
          </div>
        </div>

    
        <div className="mt-12 grid grid-cols-3 gap-4 text-white">
          <div className="text-center">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm font-semibold">User Roles</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm font-semibold">Task Tracking</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm font-semibold">Workspace Mgmt</p>
          </div>
        </div>
      </div>
    </div>
  );
}
