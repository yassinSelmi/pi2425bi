import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeartPredictionService {
  private apiUrl = 'http://192.168.162.199:5003/heart'; // Adaptez l'URL selon votre configuration

  constructor(private http: HttpClient) {}

  predictHeartDisease(data: any): Observable<any> {
    // Convertir toutes les valeurs en nombres
    const formattedData = {
      Age: Number(data.Age),
      Sex: Number(data.Sex),
      ChestPain: Number(data.ChestPain),
      RestingBloodPressure: Number(data.RestingBloodPressure),
      Cholesterol: Number(data.Cholesterol),
      FastingBloodSugar: Number(data.FastingBloodSugar),
      RestingECG: Number(data.RestingECG),
      MaxHeartRate: Number(data.MaxHeartRate),
      ExcerciseAngina: Number(data.ExcerciseAngina),
      OldPeak: Number(data.OldPeak),
      STSlope: Number(data.STSlope),
      nMajorVessels: Number(data.nMajorVessels),
      Thalium: Number(data.Thalium)
    };

    return this.http.post(this.apiUrl, formattedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}