import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { accessToken } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching /me", err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  if (loading) {
    return <p className="text-slate-300">Loading dashboard...</p>;
  }

  if (!user) {
    return <p className="text-slate-300">No user data. Are you logged in?</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard (Protected)</h1>
      <p className="mb-2 text-slate-200">Welcome, {user.email}</p>
      <p className="text-xs text-slate-400">
        User ID: {user.id} | Joined: {new Date(user.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
