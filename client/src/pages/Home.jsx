import { Link, Navigate } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    const userData = JSON.parse(user);
    return <Navigate to={`/dashboard/${userData.role}`} />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-300">
          <h1 className="text-4xl font-bold text-black mb-2">
            Task Manager
          </h1>
          <p className="text-gray-700 mb-8">
            Manage workspaces, assign tasks, and track progress securely with role-based access.
          </p>

          <div className="space-y-3">
            <Link
              to="/login"
              className="block bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="block bg-gray-200 hover:bg-gray-300 text-black font-semibold py-3 px-6 rounded-lg transition"
            >
              Create account
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4 text-black">
           <div className="text-center">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm font-semibold">User roles</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm font-semibold">Task tracking</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm font-semibold">Workspace mgmt</p>
          </div>
        </div>
      </div>
    </div>
  );
}
