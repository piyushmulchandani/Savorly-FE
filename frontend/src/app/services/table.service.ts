import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Table, TableCreation, TableSearch } from '../interfaces/table.interface';
import { map, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TableService {
	private apiUrl = 'http://localhost:8080/api/v1/restaurants/tables';

	constructor(private _http: HttpClient) {}

	addTable(table: TableCreation) {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		});

		return this._http.post(this.apiUrl, table, { headers });
	}

	getTableById(id: number): Observable<Table> {
		const URL = `${this.apiUrl}/${id}`;
		return this._http.get<Table>(URL);
	}

	getTables(request: TableSearch) {
		let params = new HttpParams();
		params = params.append('restaurantId', request.restaurantId);
		if (request.tableNumber) params = params.append('tableNumber', request.tableNumber);
		if (request.occupied != null) params = params.append('occupied', request.occupied);
		if (request.numPeople) params = params.append('numPeople', request.numPeople);

		const URL = `${this.apiUrl}?${params.toString()}`;

		return this._http.get<Table[]>(URL, { observe: 'response' });
	}

	occupyTable(id: number) {
		const URL = `${this.apiUrl}/occupy/${id}`;

		return this._http.patch(URL, null);
	}

	completeTableService(id: number): Observable<void> {
		const URL = `${this.apiUrl}/complete/${id}`;

		return this._http.patch(URL, null, { responseType: 'blob' }).pipe(
			map(blob => {
				// Create download link and trigger it
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `receipt-${id}.pdf`;
				link.click();
				window.URL.revokeObjectURL(url);
			})
		);
	}

	removeTable(restaurantId: number) {
		const URL = `${this.apiUrl}/${restaurantId}`;

		return this._http.delete(URL);
	}
}
