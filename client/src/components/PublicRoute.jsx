import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-200">Checking auth...</p>
      </div>
    );
  }

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
