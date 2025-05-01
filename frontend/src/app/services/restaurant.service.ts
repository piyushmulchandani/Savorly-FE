import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Restaurant, RestaurantSearch } from '../interfaces/restaurant.interface';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = "http://localhost:8080/api/v1/restaurants";

  constructor(private _http: HttpClient) { }

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
		if (request.dateTime) params = params.append('dateTime', request.dateTime.toFormat('yyy-MM-dd'));
		if (request.numPeople) params = params.append('numPeople', request.numPeople);

		const URL = `${this.apiUrl}?${params.toString()}`;

		return this._http.get<Restaurant[]>(URL, { headers, observe: 'response' });
	}
}
