import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductCreation, ProductSearch } from '../interfaces/product.interface';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	private apiUrl = 'http://localhost:8080/api/v1/restaurants/products';

	constructor(private _http: HttpClient) {}

	getProducts(request: ProductSearch) {
		const headers = new HttpHeaders({
			Accept: 'application/json',
			'Access-Control-Expose-Headers': 'Authorization, X-Custom',
		});

		let params = new HttpParams();
		console.log(request.restaurantId);
		params = params.append('restaurantId', request.restaurantId);
		if (request.category) params = params.append('category', request.category);
		if (request.name) params = params.append('name', request.name);

		const URL = `${this.apiUrl}?${params.toString()}`;

		return this._http.get<Product[]>(URL, { headers, observe: 'response' });
	}

	createProduct(product: ProductCreation): Observable<Product> {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		});

		return this._http.post<Product>(this.apiUrl, product, { headers });
	}
}
