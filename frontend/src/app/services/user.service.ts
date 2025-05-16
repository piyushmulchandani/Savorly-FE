import { Injectable } from '@angular/core';
import { SavorlyRole, SavorlyUser, UserSearch } from '../interfaces/user.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private apiUrl = 'http://localhost:8080/api/v1/users';
	public userProfile: SavorlyUser | undefined;

	constructor(private _http: HttpClient) {}

	addWorker(username: string, restaurantId: number) {
		let params = new HttpParams();
		params = params.append('restaurantId', restaurantId);

		const URL = `${this.apiUrl}/add-worker/${username}?${params.toString()}`;

		return this._http.patch(URL, null);
	}

	removeWorker(username: string, restaurantId: number) {
		let params = new HttpParams();
		params = params.append('restaurantId', restaurantId);

		const URL = `${this.apiUrl}/remove-worker/${username}?${params.toString()}`;

		return this._http.patch(URL, null);
	}

	getProfile(): Observable<SavorlyUser> {
		if (this.userProfile) {
			return of(this.userProfile);
		}

		return this._http.get<SavorlyUser>(`${this.apiUrl}/me`).pipe(tap((userProfile: SavorlyUser) => (this.userProfile = userProfile)));
	}

	getUsers(request: UserSearch) {
		let params = new HttpParams();
		if (request.username) params = params.append('username', request.username);
		if (request.restaurantId !== undefined && !isNaN(request.restaurantId)) params = params.append('restaurantId', request.restaurantId);
		if (request.role) params = params.append('role', request.role);

		const URL = `${this.apiUrl}?${params.toString()}`;

		return this._http.get<SavorlyUser[]>(URL, { observe: 'response' });
	}

	hasRole(role: SavorlyRole): boolean {
		if (!this.userProfile) {
			return false;
		}
		return this.userProfile.role === role;
	}
}
