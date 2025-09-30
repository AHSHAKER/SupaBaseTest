import React, { useState } from "react";
import supabase from "../SupabaseUsers";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password",
    });

    if (error) {
      setMessage(error.message);
    } else {
      const { data } = await supabase.from("accounts").select("*").eq("email", email).maybeSingle();
      if (!data) {
        setMessage("No account found with that email.");
      } else {
        setMessage("We sent you a reset link. Please check your email.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 items-center justify-center font-sans">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md sm:bg-white p-8 sm:rounded-2xl sm:shadow-lg sm:border border-slate-200"
      >
        <h1 className="text-2xl font-bold text-slate-800 text-center">Reset Password</h1>
        <p className="text-sm text-center text-slate-500 mt-2">
          Enter your email to receive a reset link.
        </p>

        <input
          type="email"
          className="mt-4 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-slate-500">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;