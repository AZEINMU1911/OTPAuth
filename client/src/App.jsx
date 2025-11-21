import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import LoginOtp from "./pages/LoginOtp";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { accessToken, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-700">
        <nav className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex gap-3">
            <Link to="/" className="font-semibold text-emerald-400">
              Auth Demo
            </Link>
            <Link
              to="/register"
              className="text-sm text-slate-300 hover:text-white"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="text-sm text-slate-300 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/login-otp"
              className="text-sm text-slate-300 hover:text-white"
            >
              Login via OTP
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {accessToken && (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-slate-300 hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<p>Welcome. Pick a flow above.</p>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login-otp" element={<LoginOtp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
