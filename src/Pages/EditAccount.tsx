import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { updateAccount } from "../hooks/useProfile";
import type { AccountForm } from "../hooks/useProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAccountSchema } from "../Schema/SignUpSchema";
import useAuthStore from "../Store/authStore";

const EditAccount: React.FC = () => {
  const profile = useAuthStore((state) => state);
  const setProfile = useAuthStore((state) => state.setProfile); // <-- get setProfile
  const Nav = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountForm>({
    resolver: zodResolver(updateAccountSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (formData: AccountForm) => {
    try {
      const { error } = await updateAccount(formData);
      if (error) {
        const message =
          typeof error === "string" ? error : (error?.message ?? JSON.stringify(error));
        alert(message);
        return;
      }
      setProfile({
        ...profile,
        full_name: formData.full_name ?? undefined,
        phone: formData.phone ?? undefined,
        address: formData.address ?? undefined,
        city: formData.city ?? undefined,
        country: formData.country ?? undefined,
      });
      alert("Account updated!");
      Nav("/");
    } catch (err) {
      console.error("Failed to update account:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-200"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Edit Account</h2>
        <label className="block mb-4">
          <span className="text-sm text-slate-700">Full Name</span>
          <input
            {...register("full_name")}
            className={`mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.full_name ? "border-red-400" : ""}`}
            placeholder="Full Name"
          />
          {errors.full_name && (
            <span className="text-xs text-red-600 mt-1">{errors.full_name.message}</span>
          )}
        </label>
        <label className="block mb-4">
          <span className="text-sm text-slate-700">Phone</span>
          <input
            {...register("phone")}
            className={`mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.phone ? "border-red-400" : ""}`}
            placeholder="Phone"
          />
          {errors.phone && (
            <span className="text-xs text-red-600 mt-1">{errors.phone.message}</span>
          )}
        </label>
        <label className="block mb-4">
          <span className="text-sm text-slate-700">Address</span>
          <input
            {...register("address")}
            className={`mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.address ? "border-red-400" : ""}`}
            placeholder="Address"
          />
          {errors.address && (
            <span className="text-xs text-red-600 mt-1">{errors.address.message}</span>
          )}
        </label>
        <label className="block mb-4">
          <span className="text-sm text-slate-700">City</span>
          <input
            {...register("city")}
            className={`mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.city ? "border-red-400" : ""}`}
            placeholder="City"
          />
          {errors.city && (
            <span className="text-xs text-red-600 mt-1">{errors.city.message}</span>
          )}
        </label>
        <label className="block mb-4">
          <span className="text-sm text-slate-700">Country</span>
          <input
            {...register("country")}
            className={`mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.country ? "border-red-400" : ""}`}
            placeholder="Country"
          />
          {errors.country && (
            <span className="text-xs text-red-600 mt-1">{errors.country.message}</span>
          )}
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditAccount;