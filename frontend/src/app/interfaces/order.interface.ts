import { DateTime } from "luxon";
import { Product } from "./product.interface";

export interface Order {
    id: number;
    orderTime: DateTime;
    type: OrderType;
    completed: boolean;
    tableNumber: number;
    products: Product[];
}

export interface OrderCreation {
    tableId: number;
    type: OrderType;
    productIds: number[];
}

export interface OrderSearch {
    restaurantId: number;
    orderYpe?: OrderType;
    completed?: boolean;
    tableId?: number;
}

export enum OrderType {
    RESTAURANT= 'RESTAURANT',
    DELIVERY = 'DELIVERY'
}