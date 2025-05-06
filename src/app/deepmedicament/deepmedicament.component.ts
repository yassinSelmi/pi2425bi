// src/app/components/deepmedicament/deepmedicament.component.ts
import { Component } from '@angular/core';
import { FlaskApiService } from '../flask-api.service';

@Component({
  selector: 'app-deepmedicament',
  templateUrl: './deepmedicament.component.html',
  styleUrls: ['./deepmedicament.component.css']
})
export class DeepmedicamentComponent {
  sampleName = '';
  description = '';
  prediction = '';
  isLoading = false;

  constructor(private flaskApi: FlaskApiService) {}

  onSubmit() {
    this.isLoading = true;
    this.flaskApi.predictSpecialty(this.sampleName, this.description)
      .subscribe({
        next: (response) => {
          this.prediction = response.specialty;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.isLoading = false;
          // Affichez un message à l'utilisateur
          alert(`API Error: ${err.message || 'Server unavailable'}`);
        }
      });
  }
}