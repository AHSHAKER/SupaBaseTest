import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileContextType } from "../Interfaces/UseAuthI";

interface AuthStore extends ProfileContextType {
  setProfile: (profile: ProfileContextType) => void;
  clearProfile: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user_id: "",
      full_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      plan: null,
      setProfile: (profile: ProfileContextType) => set({ ...profile }),
      clearProfile: () =>
        set({
          user_id: "",
          full_name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "",
          plan: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
