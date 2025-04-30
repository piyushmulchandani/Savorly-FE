import { DateTime } from 'luxon';

export interface Restaurant {
    id: number;
    name: string;
    status: RestaurantStatus;
    openTime: DateTime;
    closeTime: DateTime;
    cuisineType: CuisineType;
    description?: string;
    address: AddressErrors;
    phone?: string;
    country: string;
    imageUrl?: string;
    ownershipProofUrl: string;
    rejectionMessage?: string;
}

export interface RestaurantCreation {
    name: string;
    openTime: DateTime;
    closeTime: DateTime;
    cuisineType: CuisineType;
    description?: string;
    address: string;
    phone?: string;
    city: string;
    country: string;
}

export interface RestaurantModification {
    status?: RestaurantStatus;
    openTime?: DateTime;
    closeTime?: DateTime;
    cuisineType?: CuisineType;
    description?: string;
    address?: string;
    phone?: string;
    city?: string;
    country?: string;
    rejectionMessage?: string;
}

export interface RestaurantSearch {
    name?: string;
    status?: RestaurantStatus;
    cuisineType?: CuisineType;
    city?: string;
    dateTime?: DateTime;
    numPeople?: number;
}

export enum CuisineType {
    ITALIAN = 'ITALIAN',
    INDIAN = 'INDIAN',
    MEXICAN = 'MEXICAN',
    SPANISH = 'SPANISH',
    CHINESE = 'CHINESE',
    JAPANESE = 'JAPANESE',
    THAI = 'THAI',
    FRENCH = 'FRENCH',
    AMERICAN = 'AMERICAN'
}

export enum RestaurantStatus {
    REQUESTED = 'REQUESTED',
    REJECTED = 'REJECTED',
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC'
}