// src/app/services/flask-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlaskApiService {
  private apiUrl = 'http://192.168.162.199:5012'; // Ajustez selon votre configuration

  constructor(private http: HttpClient) { }

  predictSpecialty(sampleName: string, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/predict`, {
      sample_name: sampleName,
      description: description
    });
  }
}