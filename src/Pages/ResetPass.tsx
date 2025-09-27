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
      setMessage("We sent you a reset link. Please check your email.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-500 text-white">
      <form
        onSubmit={handleReset}
        className="bg-yellow-600/90 p-8 rounded-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        <p className="text-sm text-center text-white/80 mt-2">
          Enter your email to receive a reset link.
        </p>

        <input
          type="email"
          className="mt-4 w-full px-3 py-2 rounded bg-yellow-700 placeholder-yellow-300 focus:outline-none"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-2 rounded bg-white text-yellow-600 font-semibold hover:opacity-95 disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
