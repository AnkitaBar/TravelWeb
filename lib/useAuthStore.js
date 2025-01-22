import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export const useAuthStore = create((set) => ({
  userRole: null, // 'admin' or 'user'
  userId: null,
  setUserRole: (role) => set({ userRole: role }),
  setUserId: (id) => set({ userId: id }),
  clearUserRole: () => set({ userRole: null, userId: null }),
  isAuthenticated: false,

  // Fetch user role after login
  fetchUserRole: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error.message);
        return;
      }

      if (data?.role) {
        set({ userRole: data.role });
      } else {
        console.warn("No role found for the user.");
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  },


  
}));
