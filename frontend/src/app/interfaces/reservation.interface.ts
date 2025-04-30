export interface Reservation {
    id: number;
    reservationTime: Date;
    numPeople: number;
    username: string;
    restaurantName: string;
    tableNumber: number;
}

export interface ReservationCreation {
    dateTime: Date;
    restaurantId: number;
    username: string;
    numPeople: number;
}

export interface ReservationSearch {
    restaurantId: number;
    date?: string;
    numPeople?: number;
    username?: string;
}