import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://192.168.162.199:5002/api/chat'; // Adaptez selon votre URL

  constructor(private http: HttpClient) { }

  askQuestion(query: string): Observable<any> {
    return this.http.post(this.apiUrl, { query });
  }
}