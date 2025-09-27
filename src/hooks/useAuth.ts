import supabase from "../SupabaseUsers";
import type { SignUpValues, SignInValues }  from "../Interfaces/UseAuthI";
import useAuthStore from "../Store/authStore";

export async function signUp(formData: SignUpValues) {
  return await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
        data: {
        full_name: formData.full_name ?? null,
        phone: formData.phone ?? null,
        address: formData.address ?? null,
        city: formData.city ?? null,
        country: formData.country ?? null,
      },
    },
  });
}

export async function signIn(formData: SignInValues) {
    return await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
    });
}

export async function signOut() {
  const result = await supabase.auth.signOut();
  useAuthStore.getState().clearProfile();
  return result;
}