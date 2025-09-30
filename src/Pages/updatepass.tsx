import { useState } from "react";
import supabase from "../SupabaseUsers";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function UpdatePass() {
  const Nav = useNavigate();
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (formData: PasswordForm) => {
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: formData.password });
      if (error) throw error;
      setMessage("Password updated successfully.");
      reset();
      setTimeout(() => Nav("/sign-in"), 1200);
    } catch (err: any) {
      setMessage(err?.message ?? "Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 items-center justify-center font-sans">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md sm:bg-white p-8 sm:rounded-2xl sm:shadow-lg sm:border border-slate-200"
        noValidate
      >
        <h1 className="text-2xl font-bold text-slate-800 text-center">Update Password</h1>
        <p className="text-sm text-center text-slate-500 mt-2">
          Enter your new password below.
        </p>

        <input
          type="password"
          {...register("password")}
          minLength={6}
          required
          className={`mt-4 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.password ? "border-red-400" : ""}`}
          placeholder="New password"
        />
        {errors.password && (
          <span className="text-xs text-red-600 mt-1 block">{errors.password.message}</span>
        )}

        <input
          type="password"
          {...register("confirm")}
          minLength={6}
          required
          className={`mt-4 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.confirm ? "border-red-400" : ""}`}
          placeholder="Confirm password"
        />
        {errors.confirm && (
          <span className="text-xs text-red-600 mt-1 block">{errors.confirm.message}</span>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-slate-500">{message}</p>
        )}
      </form>
    </div>
  );
}