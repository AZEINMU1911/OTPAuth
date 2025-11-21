import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/request-otp", { email });
      toast.success(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to request OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1) verify OTP and get emailVerifiedToken
      const verifyRes = await api.post("/verify-otp", { email, otp });
      const emailVerifiedToken = verifyRes.data.emailVerifiedToken;
      if (!emailVerifiedToken) {
        toast.error("No verification token returned");
        return;
      }

      toast.success("OTP verified");

      // 2) register with email, password, emailVerifiedToken
      const registerRes = await api.post("/register", {
        email,
        password,
        emailVerifiedToken,
      });

      toast.success(registerRes.data.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to verify/register";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-lg">
      <h1 className="text-xl font-semibold mb-4">
        {step === 1
          ? "Register - Step 1 (Email)"
          : "Register - Step 2 (OTP & Password)"}
      </h1>

      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
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
            {loading ? "Requesting OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyAndRegister} className="space-y-4">
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

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-medium py-2 text-sm disabled:opacity-60"
          >
            {loading ? "Verifying & Registering..." : "Verify OTP & Register"}
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
