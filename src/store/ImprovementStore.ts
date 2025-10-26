import { axiosInstance } from "@/lib/axios";
import type { ImprovementStore, ImprovementType } from "@/types/types";
import type { AxiosError } from "axios";
import { create } from "zustand";

export const improvementStore = create<ImprovementStore>((set) => ({
  improvements: [],
  improvement: null,
  isLoading: false,
  error: null,

  // Obtener todas las mejoras
  fetchImprovements: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/improvement");
      set({ 
        improvements: response.data,
        isLoading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({ 
        error: axiosError.response?.data?.message || "Failed to fetch improvements",
        isLoading: false 
      });
    }
  },

  // Obtener mejora por ID
  fetchImprovementById: async (id: string | number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/improvement/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({ 
        error: axiosError.response?.data?.message || "Failed to fetch improvement",
        isLoading: false 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Crear nueva mejora
  createImprovement: async (improvement: Omit<ImprovementType, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/improvement", improvement);
      set((state) => ({
        improvements: [...state.improvements, response.data],
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({ 
        error: axiosError.response?.data?.message || "Failed to create improvement",
        isLoading: false 
      });
      throw error;
    }
  },

  // Actualizar mejora
    updateImprovement: async (improvement: ImprovementType) => {
        set({ isLoading: true });
        try {
        const response = await axiosInstance.put(`/improvement/${improvement.id}`, improvement);
        set((state) => ({
            improvements: state.improvements.map(imp => imp.id === improvement.id ? response.data : imp)
        }));
        } catch (error) {
        set({ error: (error as AxiosError).message });
        } finally {
        set({ isLoading: false });
        }
    }, 

  // Eliminar mejora
  deleteImprovement: async (id: string | number) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/improvement/${id}`);
      set((state) => ({
        improvements: state.improvements.filter(imp => imp.id !== id),
        isLoading: false
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      set({ 
        error: axiosError.response?.data?.message ?? "Failed to delete improvement",
        isLoading: false 
      });
      throw error;
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),

  // Reset del store
  reset: () => set({ 
    improvements: [], 
    isLoading: false, 
    error: null 
  })
}));

export default improvementStore;