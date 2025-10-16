import type { User } from "@/hooks/useAuth";


export type SaleTypeStore = {
    isLoading: boolean,
    error: string | null,
    saleType: SaletypeType | null;
    saleTypes: SaletypeType[];
    fetchSaleTypes: () => Promise<void>;
    fetchSaleTypeById: (id: number) => Promise<void>;
    deleteSaleType: (id: number) => Promise<void>;
    createSaleType: (saleType: SaletypeType) => Promise<void>;
    updateSaleType: (saleType: SaletypeType) => Promise<void>;
}

export type SaletypeType = {
    id: number;
    name: string;
    description: string;
}

export type PropertyStore = {
    isLoading: boolean;
    error: string | null;
    property: PropertyType | null;
    properties: PropertyType[];
    fetchProperties: () => Promise<void>;
    fetchPropertyById: (id: number) => Promise<void>;
    updateProperty: (propertyType: FormData) => Promise<void>;
    deleteProperty: (id: number) => Promise<void>;
    createProperty: (propertyType: FormData) => Promise<void>;
    fetchPropertyByUniqueCode: (uniqueCode: string) => Promise<void>;
}

export type PropertyType = {
    id: number;
    uniqueCode: string;
    price: number;
    sizeInSquareMeters: number;
    roomCount: number;
    bathroomCount: number;
    description: string;
    images: string[];
    isAvailable: boolean;
    propertyType: PropertytypeType | null;
    saleType: SaletypeType | null;
    offers: OfferType[] | null;
    improvements: ImprovementType[] | null;
    agentId: string;
}

export type PropertyUpdateType = {
    id: number;
    uniqueCode?: string;
    price?: number;
    sizeInSquareMeters?: number;
    roomCount?: number;
    bathroomCount?: number;
    description?: string;
    images?: string[];
    isAvailable?: boolean;
    propertyTypeId?: number;
    saleTypeId?: number;
    improvementsIds?: number[];
    agentId?: string;
    deletedImages?: string[];
}

export type PropertytypeType = {
    id: number;
    name: string;
    description: string;
}

export type PropertyTypeStore = {
    isLoading: boolean;
    error: string | null;
    propertyType: PropertytypeType | null;
    propertyTypes: PropertytypeType[];
    fetchPropertyTypes: () => Promise<void>;
    fetchPropertyTypeById: (id: number) => Promise<void>;
    deletePropertyType: (id: number) => Promise<void>;
    createPropertyType: (propertyType: PropertytypeType) => Promise<void>;
    updatePropertyType: (propertyType: PropertytypeType) => Promise<void>;
}

export type ImprovementType = {
    id: number;
    name: string;
    description: string;
}

export type ImprovementStore = {
    isLoading: boolean;
    error: string | null;
    improvement: ImprovementType | null;
    improvements: ImprovementType[];
    fetchImprovements: () => Promise<void>;
    fetchImprovementById: (id: number) => Promise<void>;
    deleteImprovement: (id: number) => Promise<void>;
    createImprovement: (improvement: ImprovementType) => Promise<void>;
    updateImprovement: (improvement: ImprovementType) => Promise<void>;
}

export type OfferType = {
    id: number;
    amount: number;
    date: Date;
    status: number;
    propertyId: number;
    property: PropertyType | null;
    clientId: string;
    clientName: string;
    agentId: string;
}

export type OfferStore = {
    isLoading: boolean;
    error: string | null;
    offer: OfferType | null;
    offers: OfferType[];
    fetchOffers: () => Promise<void>;
    fetchOffersByPropertyId: (id: number) => Promise<void>;
    fetchOfferById: (id: number) => Promise<void>;
    deleteOffer: (offer: OfferType) => Promise<void>;
    createOffer: (offer: OfferType) => Promise<void>;
    updateOffer: (offer: OfferType) => Promise<void>;
}

export type FavoriteType = {
    id: number;
    clientId: string;
    propertyId: number;
}

export type FavoriteStore = {
    isLoading: boolean;
    error: string | null;
    favorite: FavoriteType | null;
    favorites: FavoriteType[];
    fetchFavoritesByClientId: (clientId: string) => Promise<void>;
    deleteFavorite: (id: number) => Promise<void>;
    createFavorite: (favorite: FavoriteType) => Promise<void>;
}

export type AgentType = {
    id: string;
    firstName: string;
    lastName: string;
    propertyCount: number;
    email: string;
    phone: string;
    profilePicture: string | null;
    properties?: PropertyType[];
}

export type ListingType = {
  id: number;
  description: string;
  isAvailable: boolean;
  offers: OfferType[];
};

export type AgentStore = {
    isLoading: boolean;
    error: string | null;
    agent: AgentType | null;
    listings: ListingType[];
    agents: AgentType[];
    fetchAgents: () => Promise<void>;
    fetchAgentById: (id: string) => Promise<void>;
    fetchAgentProperties: (id: string) => Promise<void>;
    fetchAgentListings: (id: string) => Promise<void>;
    deleteAgentListing: (id: number) => Promise<void>;
}

export type UserType = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string | null;
    confirmPassword: string | null;
    phone: string;
    profilePicture: string | null;
    cedula: string | null;
    userType: 'Customer' | 'Agent';
}

export type UserStore = {
    isLoading: boolean;
    error: string | null;
    updateUser: (form: FormData) => Promise<User>;
}
