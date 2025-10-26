import { axiosInstance } from "@/lib/axios";
import type { PropertyTypeStore, PropertytypeType} from "@/types/types";
import type { AxiosError } from "axios";
import { create } from "zustand";

export const propertyTypeStore = create<PropertyTypeStore>((set) => ({
    isLoading: false,
    error: null,
    propertyType: null,
    propertyTypes: [],

    fetchPropertyTypes: async () => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get("/propertytype");
            set({ propertyTypes: response.data });
        } catch (error) {
            set({ error: (error as AxiosError).message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchPropertyTypeById: async (id: number) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(`/propertytype/${id}`);
            set({ propertyType: response.data });
        } catch (error) {
            set({ error: (error as AxiosError).message });
        } finally {
            set({ isLoading: false });
        }
    },

    deletePropertyType: async (id: number) => {
        set({ isLoading: true });
        try {
            await axiosInstance.delete(`/propertytype/${id}`);
            set((state) => ({
                propertyTypes: state.propertyTypes.filter(pt => pt.id !== id)
            }));
        } catch (error) {
            set({ error: (error as AxiosError).message });
        } finally {
            set({ isLoading: false });
        }
    },

    createPropertyType: async (propertyType: PropertytypeType) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post("/propertytype", propertyType);
            set((state) => ({
                propertyTypes: [...state.propertyTypes, response.data]
            }));
        } catch (error) {
            set({ error: (error as AxiosError).message });
        } finally {
            set({ isLoading: false });
        }
    },

    updatePropertyType: async (propertyType: PropertytypeType) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.put(`/propertytype/${propertyType.id}`, propertyType);
            set((state) => ({
                propertyTypes: state.propertyTypes.map(pt => pt.id === propertyType.id ? response.data : pt)
            }));
        } catch (error) {
            set({ error: (error as AxiosError).message });
        } finally {
            set({ isLoading: false });
        }
    },


}));