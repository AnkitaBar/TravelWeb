import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export const useAuthStore = create((set) => ({
  userId: null,
  userRole: typeof window !== "undefined" ? localStorage.getItem("userRole") || null : null,

  setUserId: (id) => set({ userId: id }),

  setUserRole: (role) => {
    set({ userRole: role });
    localStorage.setItem("userRole", role); // Persist role in localStorage
  },

  fetchUserRole: async (userId) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();
    
    if (error) {
      console.error("Error fetching user role:", error);
    } else {
      set({ userRole: data?.role });
      localStorage.setItem("userRole", data?.role); // Save to localStorage
    }
  },

  clearAuth: () => {
    set({ userId: null, userRole: null });
    localStorage.removeItem("userRole"); // Clear role on logout
  },
}));
