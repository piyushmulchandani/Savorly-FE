import { Restaurant } from "./restaurant.interface";

export interface SavorlyUser {
    username: string;
    role: SavorlyRole;
    restaurant?: Restaurant;
    lastLogonDate?: Date;
}

export interface UserModification {
    username: string;
    role?: SavorlyRole;
    restaurantName?: string;
}

export interface UserSearch {
    username?: string;
    role?: SavorlyRole;
    restaurantName?: string;
}

export enum SavorlyRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    RESTAURANT_ADMIN = 'RESTAURANT_ADMIN',
    RESTAURANT_WORKER = 'RESTAURANT_WORKER'
}