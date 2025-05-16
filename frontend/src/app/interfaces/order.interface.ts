import { Product } from './product.interface';

export interface Order {
	id: number;
	orderTime: Date;
	type: OrderType;
	completed: boolean;
	tableNumber: number;
	products: Product[];
}

export interface OrderCreation {
	restaurantId: number;
	tableNumber: number;
	type: OrderType;
	productIds: number[];
}

export interface OrderSearch {
	restaurantId: number;
	orderType?: OrderType;
	completed?: boolean;
	tableId?: number;
}

export enum OrderType {
	RESTAURANT = 'RESTAURANT',
	DELIVERY = 'DELIVERY',
}
