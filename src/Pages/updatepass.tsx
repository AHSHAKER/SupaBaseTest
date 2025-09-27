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
<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-sm">
<h2 className="text-2xl font-semibold mb-4">Update Password</h2>
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
<div>
    <label className="block text-sm font-medium mb-1">New password</label>
    <input
    type="password"
    {...register("password")}
    minLength={6}
    required
    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? "border-red-400" : ""}`}
    />
    {errors.password && (
    <span className="text-xs text-red-600 mt-1">{errors.password.message}</span>
    )}
</div>
<div>
    <label className="block text-sm font-medium mb-1">Confirm password</label>
    <input
    type="password"
    {...register("confirm")}
    minLength={6}
    required
    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.confirm ? "border-red-400" : ""}`}
    />
    {errors.confirm && (
    <span className="text-xs text-red-600 mt-1">{errors.confirm.message}</span>
    )}
</div>
<button
    type="submit"
    disabled={isSubmitting}
    className="inline-flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
>
    {isSubmitting ? "Updating..." : "Update password"}
</button>
</form>
{message && <div className="mt-4 text-green-600">{message}</div>}
</div>
);
}