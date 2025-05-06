import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-respiratory-disease',
  templateUrl: './respiratory-disease.component.html',
  styleUrls: ['./respiratory-disease.component.css']
})
export class RespiratoryDiseaseComponent {
  selectedFile: File | null = null;
  audioPreview: string | null = null;
  prediction: string = '';
  isLoading: boolean = false;
  isDragOver: boolean = false;
  confidence: number = 0;
  isHighRisk: boolean = false;
  showInfoModal: boolean = false;

  // Données pour la démo
  soundTypes = [
    { icon: '🌬️', label: 'Respiration normale' },
    { icon: '🎵', label: 'Sibilances' },
    { icon: '🌀', label: 'Râles crépitants' },
    { icon: '📯', label: 'Stridor' }
  ];

  criticalSymptoms = [
    'Essoufflement au repos',
    'Lèvres ou ongles bleutés',
    'Confusion ou difficulté à parler',
    'Pouls très rapide',
    'Douleur thoracique intense'
  ];

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.isDragOver = false;
    const file = event.target.files[0];
    this.processFile(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  private processFile(file: File): void {
    if (!file.type.match('audio.*')) {
      alert('Seuls les fichiers audio sont acceptés');
      return;
    }

    this.selectedFile = file;
    this.prediction = '';
    this.isHighRisk = false;
    this.confidence = 0;

    const reader = new FileReader();
    reader.onload = () => {
      this.audioPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submitAudio(): void {
    if (!this.selectedFile || this.isLoading) return;

    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>('http://192.168.162.199:5008/predict', formData).subscribe({
      next: (res) => {
        this.prediction = res.prediction || 'Résultat non disponible';
        this.confidence = res.confidence ? parseFloat(res.confidence) : 0.85;
        this.isHighRisk = this.determineRiskLevel(this.prediction, this.confidence);
        this.isLoading = false;
      },
      error: (err) => {
        this.prediction = "Erreur lors de l'analyse. Veuillez réessayer.";
        this.isHighRisk = false;
        this.confidence = 0;
        this.isLoading = false;
        console.error('Erreur API:', err);
      }
    });
  }

  private determineRiskLevel(prediction: string, confidence: number): boolean {
    const lowerPred = prediction.toLowerCase();
    return lowerPred.includes('copd') || 
           lowerPred.includes('asthme') || 
           lowerPred.includes('fibrose') || 
           (confidence > 0.7 && (lowerPred.includes('bronchite') || lowerPred.includes('pneumonie')));
  }

  clearSelection(): void {
    this.selectedFile = null;
    this.audioPreview = null;
    this.prediction = '';
    this.isHighRisk = false;
    this.confidence = 0;
  }

  // Pour la visualisation des ondes sonores (démo)
  getRandomWaveHeight(): number {
    return Math.floor(Math.random() * 30) + 10;
  }
}