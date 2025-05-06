import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MortalityService {

  private apiUrl = 'http://192.168.162.199:5000/predict'; 

  constructor(private http: HttpClient) { }

  predictMortality(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
