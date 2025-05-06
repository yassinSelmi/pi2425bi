import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-brain-stroke',
  templateUrl: './brain-stroke.component.html',
  styleUrls: ['./brain-stroke.component.css']
})
export class BrainStrokeComponent {
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  prediction: string = '';
  isLoading: boolean = false;
  isDragOver: boolean = false;
  confidence: number = 0;
  isHighRisk: boolean = false;
  patientPhoneNumber: string = '';

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
    if (!file.type.match('image.*') && !file.name.endsWith('.dcm')) {
      alert('Seuls les fichiers image (JPG, PNG) ou DICOM (.dcm) sont acceptés');
      return;
    }

    this.selectedFile = file;
    this.prediction = '';
    this.isHighRisk = false;
    this.confidence = 0;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submitImage(): void {
    if (!this.selectedFile || this.isLoading) return;

    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('phone_number', this.patientPhoneNumber);


    this.http.post<any>('http://192.168.162.199:5009/predict', formData).subscribe({
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
    return lowerPred.includes('avc') || 
           lowerPred.includes('stroke') || 
           lowerPred.includes('hémorragie') || 
           (confidence > 0.7 && lowerPred.includes('anomal'));
  }

  clearSelection(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.prediction = '';
    this.isHighRisk = false;
    this.confidence = 0;
  }

  // Pour la démo - à retirer en production
  simulateAnalysis(): void {
    if (!this.selectedFile) return;
    
    this.isLoading = true;
    setTimeout(() => {
      this.prediction = "Détection d'anomalies cérébrovasculaires modérées";
      this.confidence = 0.78;
      this.isHighRisk = true;
      this.isLoading = false;
    }, 2000);
  }
}