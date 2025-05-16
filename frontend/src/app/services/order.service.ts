import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order, OrderCreation, OrderSearch } from '../interfaces/order.interface';

@Injectable({
	providedIn: 'root',
})
export class OrderService {
	private apiUrl = 'http://localhost:8080/api/v1/restaurants/orders';

	constructor(private _http: HttpClient) {}

	createOrder(order: OrderCreation) {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		});

		return this._http.post(this.apiUrl, order, { headers });
	}

	confirmOrder(id: number) {
		const URL = `${this.apiUrl}/confirm/${id}`;

		return this._http.patch(URL, null);
	}

	getOrders(request: OrderSearch) {
		let params = new HttpParams();
		params = params.append('restaurantId', request.restaurantId);
		if (request.orderType) params = params.append('orderType', request.orderType);
		if (request.completed != null) params = params.append('completed', request.completed);
		if (request.tableId != null) params = params.append('tableId', request.tableId);

		const URL = `${this.apiUrl}?${params.toString()}`;

		return this._http.get<Order[]>(URL, { observe: 'response' });
	}

	cancelOrder(id: number) {
		const URL = `${this.apiUrl}/cancel/${id}`;

		return this._http.delete(URL);
	}
}
