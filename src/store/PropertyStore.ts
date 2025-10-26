import { axiosInstance } from "@/lib/axios";
import type { PropertyStore } from "@/types/types";
import type { AxiosError } from "axios";
import { create } from "zustand";

export const propertyStore = create<PropertyStore>((set) => ({
    isLoading: false,
    error: null,
    property: null,
    properties: [],
    
    fetchProperties: async () => {
        console.log("Fetching properties...");
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/property');
            set({ properties: response.data });
            console.log("Properties data fetched.");
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            set({ error: err.response?.data.message || "Failed to fetch properties." });
            console.log(err);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchPropertyById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/property/${id}`);
            set({ property: response.data });
            console.log("Property fetched by ID.");
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            set({ error: err.response?.data.message || "Failed to fetch property." });
            console.log(err);
        } finally {
            set({ isLoading: false });
        }
    },

    updateProperty: async (propertyType: FormData) => {
        console.log("Updating property...");
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put(`/property/${propertyType.get('id')}`, propertyType);
            set({ property: response.data });
            console.log("Property updated.");
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            set({ error: err.response?.data.message || "Failed to update property." });
            throw new Error(err.message);
        } finally {
            set({ isLoading: false });
        }
    },

    deleteProperty: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.delete(`/property/${id}`);
            if (response.status === 204) console.log("Property deleted successfully.");
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            set({ error: err.response?.data.message || "Failed to delete property." });
            console.log(err);
        } finally {
            set({ isLoading: false });
        }
    },

    createProperty: async (propertyType: FormData) => {
        console.log("Creating property...");
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/property', propertyType);
            if (response.status === 201) {
                console.log("Property created.");
            }
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            set({ error: err.response?.data.message || "Failed to create property." });
            throw new Error(err.message);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchPropertyByUniqueCode: async (uniqueCode: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/property/getbycode/${uniqueCode}`);
            set({ property: response.data });
            console.log("Property fetched by unique code.");
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            set({ error: err.response?.data.message || "Failed to fetch property." });
            console.log(err);
        } finally {
            set({ isLoading: false });
        }
    },
}))