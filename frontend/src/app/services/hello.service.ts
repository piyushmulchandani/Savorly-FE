import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelloService {
  private apiUrl = 'http://localhost:8080/api/v1/helloAdmin';

  constructor(private http: HttpClient) { }

  getHello(name : string): Observable<string> {
    const params = new HttpParams().set('name', name);

    return this.http.get<string>(this.apiUrl, { params, withCredentials: true, responseType: 'text' as 'json' });
  }
}
