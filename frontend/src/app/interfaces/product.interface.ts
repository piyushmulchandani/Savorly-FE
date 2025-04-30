export interface Product {
    id: number;
    name: string;
    category: ProductCategory;
    price: number;
}

export interface ProductCreation {
    restaurantId: number;
    name: string;
    category: ProductCategory;
    price: number;
}

export interface ProductSearch {
    restaurantId: number;
    name?: string;
    category?: ProductCategory;
}


export enum ProductCategory {
    DRINK = 'DRINK',
    APPETIZER = 'APPETIZER',
    MAIN_COURSE = 'MAIN_COURSE',
    SIDE = 'SIDE',
    DESSERT = 'DESSERT'
}