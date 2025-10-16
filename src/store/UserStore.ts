import { axiosInstance } from "@/lib/axios";
import type { AxiosError } from "axios";
import type { UserStore } from "@/type/types";
import { create } from "zustand";

export const userStore = create<UserStore>((set) => ({
    isLoading: false,
    error: null,
    updateUser: async (form: FormData) => {
        set({ isLoading: true });
        try {
            await axiosInstance.put("account/update-user", form);
        } catch (error) {
            const axiosError = error as AxiosError<{message: string}>;
            set({ error: axiosError.response?.data?.message || "Failed to update user" });
        } finally {
            set({ isLoading: false });
        }
    },
}));