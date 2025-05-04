import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Restaurant, RestaurantModification, RestaurantSearch } from '../interfaces/restaurant.interface';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RestaurantService {
	private apiUrl = 'http://localhost:8080/api/v1/restaurants';

	constructor(private _http: HttpClient) {}

	acceptRestaurant(id: number) {
		const URL = `${this.apiUrl}/accept/${id}`;
	}

	rejectRestaurant(id: number) {
		const URL = `${this.apiUrl}/reject/${id}`;
	}

	updateRestaurant(request: RestaurantModification) {
		throw new Error('Method not implemented.');
	}

	getRestaurantById(id: number): Observable<Restaurant> {
		const URL = `${this.apiUrl}/${id}`;
		return this._http.get<Restaurant>(URL);
	}

	getRestaurants(request: RestaurantSearch) {
		const headers = new HttpHeaders({
			Accept: 'application/json',
			'Access-Control-Expose-Headers': 'Authorization, X-Custom',
		});

		let params = new HttpParams();
		if (request.name) params = params.append('name', request.name);
		if (request.status) params = params.append('status', request.status);
		if (request.cuisineType) params = params.append('cuisineType', request.cuisineType);
		if (request.city) params = params.append('city', request.city);
		if (request.date && request.time) {
			const dt = DateTime.fromJSDate(request.date).toFormat('yyyy-MM-dd');
			const cleanTime = request.time.replace(/\s(AM|PM)/i, '');
			params = params.append('dateTime', `${dt}T${cleanTime}`);
		}
		if (request.numPeople) params = params.append('numPeople', request.numPeople);

		const URL = `${this.apiUrl}?${params.toString()}`;

		return this._http.get<Restaurant[]>(URL, { headers, observe: 'response' });
	}
}
