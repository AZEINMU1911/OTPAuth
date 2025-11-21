import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginOtp() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRequestLoginOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/login-otp/request", { email });
      toast.success(res.data.message || "Login OTP sent");
      setStep(2);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to request login OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/login-otp/verify", { email, otp });

      const { accessToken, user } = res.data;

      if (!accessToken) {
        toast.error("No access token returned");
        return;
      }

      login(accessToken, user || null);
      toast.success("Logged in via OTP");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to verify login OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-lg">
      <h1 className="text-xl font-semibold mb-4">
        {step === 1
          ? "Login via OTP - Step 1 (Email)"
          : "Login via OTP - Step 2 (OTP)"}
      </h1>

      {step === 1 && (
        <form onSubmit={handleRequestLoginOtp} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-medium py-2 text-sm disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send Login OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              value={email}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm mb-1">OTP</label>
            <input
              type="text"
              className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-medium py-2 text-sm disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full mt-2 rounded border border-slate-600 text-slate-200 py-2 text-xs hover:bg-slate-700"
          >
            Back to step 1
          </button>
        </form>
      )}
    </div>
  );
}
