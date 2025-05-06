import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrainStrokeComponent } from './brain-stroke/brain-stroke.component';
import { RespiratoryDiseaseComponent } from './respiratory-disease/respiratory-disease.component';
import { ReportComponent } from './report/report.component';
import { MortalityComponent } from './mortality/mortality.component';
import { FormsModule } from '@angular/forms';
import { WikiSearchComponent } from './wiki-search/wiki-search.component';
import { PredictionComponent } from './prediction/prediction.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AuthService } from './auth.service';
import { DeepmedicamentComponent } from './deepmedicament/deepmedicament.component'; // Importez le AuthService

@NgModule({
  declarations: [
    AppComponent,
    BrainStrokeComponent,
    RespiratoryDiseaseComponent,
    ReportComponent,
    MortalityComponent,
    WikiSearchComponent,
    PredictionComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    DoctorComponent,
    DeepmedicamentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    AuthService // Ajoutez AuthService aux providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }