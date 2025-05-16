export interface Table {
	id: number;
	tableNumber: number;
	occupied: boolean;
	currentCost: number;
	minPeople: number;
	maxPeople: number;
}

export interface TableCreation {
	restaurantId: number;
	minPeople: number;
	maxPeople: number;
}

export interface TableSearch {
	restaurantId: number;
	tableNumber?: number;
	occupied?: boolean;
	numPeople?: number;
}
