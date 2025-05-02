import { Injectable } from '@angular/core';
import { SavorlyRole, SavorlyUser } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private apiUrl = 'http://localhost:8080/api/v1/users';
	public userProfile: SavorlyUser | undefined;

	constructor(private _http: HttpClient) {}

	getProfile(): Observable<SavorlyUser> {
		if (this.userProfile) {
			return of(this.userProfile);
		}

		return this._http.get<SavorlyUser>(`${this.apiUrl}/me`).pipe(tap((userProfile: SavorlyUser) => (this.userProfile = userProfile)));
	}

	hasRole(role: SavorlyRole): boolean {
		if (!this.userProfile) {
			return false;
		}
		return this.userProfile.role === role;
	}
}
