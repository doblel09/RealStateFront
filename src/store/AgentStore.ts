import { axiosInstance } from "@/lib/axios";
import type { AgentStore} from "@/types/types";
import type { AxiosError } from "axios";
import { create } from "zustand";

export const agentStore = create<AgentStore>((set) => ({
    isLoading: false,
    error: null,
    agent: null,
    agents: [],
    listings: [],
    fetchAgents: async () => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get("/agent");
            set({ agents: response.data });
        } catch (error) {
            set({ error: (error as AxiosError).message });
        } finally {
            set({ isLoading: false });
        }
    },
    fetchAgentById: async (id: string) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(`/agent/${id}`);
            set({ agent: response.data });
        } catch (error) {
            set({ error: (error as AxiosError).message });
        } finally {
            set({ isLoading: false });
        }
    },
    fetchAgentProperties: async (id: string) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(`/agent/${id}/properties`);
            set((state) => state.agent ? { agent: { ...state.agent, properties: response.data } } : { agent: state.agent });
        } catch (error) {
            set({ error: (error as AxiosError).message });
        } finally {
            set({ isLoading: false });
        }
    },
    fetchAgentListings: async (id: string) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(`/agent/${id}/properties`);
            set({ listings: response.data });
        } catch (error) {
            set({ error: (error as AxiosError).message });
        } finally {
            set({ isLoading: false });
        }
    },
    deleteAgentListing: async (id: number) => {
        set({ isLoading: true });
        try {
            await axiosInstance.delete(`/property/${id}`);
            set((state) => ({
                listings: state.listings.filter(listing => listing.id !== id)
            }));
        } catch (error) {
            set({ error: (error as AxiosError).message });
        } finally {
            set({ isLoading: false });
        }
    }
}));
