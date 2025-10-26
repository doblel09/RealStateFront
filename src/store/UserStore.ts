import { axiosInstance } from "@/lib/axios";
import type { AxiosError } from "axios";
import type { UserStore } from "@/types/types";
import type { User } from "@/hooks/useAuth";
import { create } from "zustand";

export const userStore = create<UserStore>((set) => ({
    isLoading: false,
    error: null,
    updateUser: async (form: FormData): Promise<User> => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.put("account/update-user", form);
            return response.data as User;
        } catch (error) {
            const axiosError = error as AxiosError<{message: string}>;
            set({ error: axiosError.response?.data?.message || "Failed to update user" });
        } finally {
            set({ isLoading: false });
        }
        return {} as User;
    },
}));