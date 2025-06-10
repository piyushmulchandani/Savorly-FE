import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Restaurant, RestaurantCreation, RestaurantModification, RestaurantSearch } from '../interfaces/restaurant.interface';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RestaurantService {
	private apiUrl = 'http://localhost:8080/api/v1/restaurants';

	constructor(private _http: HttpClient) {}

	createRestaurant(restaurantData: RestaurantCreation, file: File) {
		const formData: FormData = new FormData();

		const restaurantBlob = new Blob([JSON.stringify(restaurantData)], {
			type: 'application/json',
		});

		formData.append('restaurant', restaurantBlob);
		formData.append('file', file);

		return this._http.post(this.apiUrl, formData);
	}

	uploadImage(id: number, image: File) {
		const formData = new FormData();
		formData.append('file', image);

		return this._http.post<void>(`${this.apiUrl}/upload-image/${id}`, formData);
	}

	acceptRestaurant(id: number) {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		});

		const URL = `${this.apiUrl}/accept/${id}`;
		return this._http.post(URL, headers);
	}

	rejectRestaurant(id: number, reason: string) {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		});

		const URL = `${this.apiUrl}/reject/${id}`;
		return this._http.post(URL, reason, { headers });
	}

	getRestaurantById(id: number): Observable<Restaurant> {
		const URL = `${this.apiUrl}/${id}`;
		return this._http.get<Restaurant>(URL);
	}

	getRestaurants(request: RestaurantSearch) {
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

		return this._http.get<Restaurant[]>(URL, { observe: 'response' });
	}

	updateRestaurant(id: number, request: RestaurantModification) {
		return this._http.patch<Restaurant>(`${this.apiUrl}/${id}`, request, {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	deleteRestaurant(id: number) {
		const URL = `${this.apiUrl}/${id}`;
		return this._http.delete(URL);
	}
}
