import { axiosInstance } from "@/lib/axios";
import type { SaleTypeStore, SaletypeType } from "@/types/types";
import type { AxiosError } from "axios";
import { create } from "zustand";

export const saleTypeStore = create<SaleTypeStore>((set) => ({
  saleTypes: [],
  saleType: null,
  isLoading: false,
  error: null,

  // Obtener todos los tipos de venta
  fetchSaleTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/saletype");
      set({ 
        saleTypes: response.data,
        isLoading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{message: string}>;
      set({ 
        error: axiosError.response?.data?.message || "Failed to fetch sale types",
        isLoading: false 
      });
    }
  },

  // Obtener tipo de venta por ID
  fetchSaleTypeById: async (id: string | number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/saletype/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{message: string}>;
      set({ 
        error: axiosError.response?.data?.message || "Failed to fetch sale type",
        isLoading: false 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Crear nuevo tipo de venta
  createSaleType: async (saleType: Omit<SaletypeType, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/saletype", saleType);
      set((state) => ({
        saleTypes: [...state.saleTypes, response.data],
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{message: string}>;
      set({ 
        error: axiosError.response?.data?.message || "Failed to create sale type",
        isLoading: false 
      });
      throw error;
    }
  },

  // Actualizar tipo de venta
  updateSaleType: async (saleType: Partial<SaletypeType>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(`/saletype/${saleType.id}`, saleType);
      set((state) => ({
        saleTypes: state.saleTypes.map(st => 
          st.id === saleType.id ? response.data : st
        ),
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{message: string}>;
      set({ 
        error: axiosError.response?.data?.message || "Failed to update sale type",
        isLoading: false 
      });
      throw error;
    }
  },

  // Eliminar tipo de venta
  deleteSaleType: async (id: string | number) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/saletype/${id}`);
      set((state) => ({
        saleTypes: state.saleTypes.filter(st => st.id !== id),
        isLoading: false
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{message: string}>;
      set({ 
        error: axiosError.response?.data?.message || "Failed to delete sale type",
        isLoading: false 
      });
      throw error;
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),

  // Reset del store
  reset: () => set({ 
    saleTypes: [], 
    isLoading: false, 
    error: null 
  })
}));

export default saleTypeStore;

