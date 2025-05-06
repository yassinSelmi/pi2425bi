import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mortality',
  templateUrl: './mortality.component.html',
  styleUrls: ['./mortality.component.css']
})
export class MortalityComponent {
  formData: any = {};
  predictionResult: any = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  submitForm() {
    this.predictionResult = null;
    this.errorMessage = null;

    this.http.post<{ prediction: { probability: string, class: string } }>(
      'http://192.168.162.199:5010/predict',
      this.formData
    ).subscribe({
      next: (response) => {
        this.predictionResult = response.prediction;
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Erreur lors de la prédiction.';
      }
    });
  }
}
