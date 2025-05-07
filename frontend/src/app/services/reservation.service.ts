import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation, ReservationCreation, ReservationSearch } from '../interfaces/reservation.interface';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ReservationService {
	private apiUrl = 'http://localhost:8080/api/v1/restaurants/reservations';

	constructor(private _http: HttpClient) {}

	getAvailableTimes(restaurantId: number, date: string, people: number) {
		const params = new HttpParams().set('restaurantId', restaurantId.toString()).set('date', date).set('numPeople', people.toString());

		const URL = `${this.apiUrl}/available-times?${params.toString()}`;
		return this._http.get<string[]>(URL, { observe: 'body' });
	}

	createReservation(reservation: ReservationCreation): Observable<Reservation> {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		});

		if (reservation.date && reservation.time) {
			const dt = DateTime.fromJSDate(reservation.date).toFormat('yyyy-MM-dd');
			const cleanTime = reservation.time.replace(/\s(AM|PM)/i, '');
			reservation.dateTime = `${dt}T${cleanTime}`;
			reservation.date = undefined;
			reservation.time = undefined;
		}

		return this._http.post<Reservation>(this.apiUrl, reservation, { headers });
	}

	getReservations(request: ReservationSearch) {
		let params = new HttpParams();
		if (request.restaurantId !== undefined && !isNaN(request.restaurantId)) params = params.append('restaurantId', request.restaurantId);
		if (request.username) params = params.append('username', request.username);
		if (request.date) params = params.append('date', request.date);

		const URL = `${this.apiUrl}?${params.toString()}`;

		return this._http.get<Reservation[]>(URL, { observe: 'response' });
	}

	cancelReservation(id: number) {
		const URL = `${this.apiUrl}/${id}`;
		return this._http.delete(URL);
	}
}
