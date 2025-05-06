import { Component } from '@angular/core';
import { HeartPredictionService } from '../heart-prediction.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css'] // si ce n’est pas déjà lié
})
export class PredictionComponent {
  // Liste des champs pour le formulaire dynamique
  fields = [
    { name: 'Age', label: 'Age' },
    { name: 'Sex', label: 'Sex', options: [
      { label: 'Male', value: 1 },
      { label: 'Female', value: 0 }
    ]},
    { name: 'ChestPain', label: 'Chest Pain Type', options: [
      { label: 'Typical Angina', value: 0 },
      { label: 'Atypical Angina', value: 1 },
      { label: 'Non-anginal Pain', value: 2 },
      { label: 'Asymptomatic', value: 3 }
    ]},
    { name: 'RestingBloodPressure', label: 'Resting Blood Pressure' },
    { name: 'Cholesterol', label: 'Cholesterol' },
    { name: 'FastingBloodSugar', label: 'Fasting Blood Sugar', options: [
      { label: 'Yes (> 120 mg/dl)', value: 1 },
      { label: 'No (<= 120 mg/dl)', value: 0 }
    ]},
    { name: 'RestingECG', label: 'Resting ECG', options: [
      { label: 'Normal', value: 0 },
      { label: 'ST-T wave abnormality', value: 1 },
      { label: 'Left ventricular hypertrophy', value: 2 }
    ]},
    { name: 'MaxHeartRate', label: 'Max Heart Rate' },
    { name: 'ExcerciseAngina', label: 'Exercise Induced Angina', options: [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 0 }
    ]},
    { name: 'OldPeak', label: 'Old Peak' },
    { name: 'STSlope', label: 'ST Slope', options: [
      { label: 'Up', value: 0 },
      { label: 'Flat', value: 1 },
      { label: 'Down', value: 2 }
    ]},
    { name: 'nMajorVessels', label: 'Number of Major Vessels', options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 }
    ]},
    { name: 'Thalium', label: 'Thalium Stress Test Result', options: [
      { label: 'Normal', value: 1 },
      { label: 'Fixed Defect', value: 2 },
      { label: 'Reversible Defect', value: 3 }
    ]}
  ];
  

  // Données du formulaire
  formData: { [key: string]: number | null } = {};

  // États pour affichage
  predictionResult: string | null = null;
  error: string | null = null;
  isLoading = false;

  constructor(private predictionService: HeartPredictionService) {
    this.resetForm(); // Initialise formData avec des valeurs nulles
  }

  // Soumission du formulaire
  onSubmit() {
    if (!this.validateForm()) {
      this.error = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.predictionResult = null;

    this.predictionService.predictHeartDisease(this.formData).subscribe({
      next: (response) => {
        this.predictionResult = response.message || 'Prédiction réussie.';
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.error = this.handleError(err);
        console.error('Erreur détectée:', err);
      }
    });
  }

  // Validation simple : tous les champs doivent être remplis
  private validateForm(): boolean {
    return Object.values(this.formData).every(
      value => value !== null && !isNaN(Number(value))
    );
  }

  // Traitement des erreurs côté client/serveur
  private handleError(err: HttpErrorResponse): string {
    if (err.error instanceof ErrorEvent) {
      return `Erreur côté client: ${err.error.message}`;
    }

    switch (err.status) {
      case 0:
        return 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
      case 400:
        return 'Données invalides: ' + (err.error?.message || 'Vérifiez les valeurs saisies.');
      case 415:
        return 'Format de données non supporté.';
      default:
        return err.error?.message || 'Une erreur inattendue est survenue.';
    }
  }

  // Réinitialise le formulaire et les messages
  resetForm() {
    this.fields.forEach(field => {
      this.formData[field.name] = null;
    });
    this.predictionResult = null;
    this.error = null;
  }
}
