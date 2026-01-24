import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { userAPI } from "../services/api.js";
import AdminDashboard from "../components/AdminDashboard.jsx";
import UserDashboard from "../components/UserDashboard.jsx";

export default function Dashboard() {
  const { role } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userAPI.getProfile();
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if role matches user's actual role
  if ((role === "admin" && user.role !== "admin") || (role === "user" && user.role !== "user")) {
    return <Navigate to={`/dashboard/${user.role}`} />;
  }

  return (
    <>
      {user.role === "admin" ? (
        <AdminDashboard user={user} />
      ) : (
        <UserDashboard user={user} />
      )}
    </>
  );
}
