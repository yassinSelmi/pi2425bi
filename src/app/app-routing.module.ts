import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrainStrokeComponent } from './brain-stroke/brain-stroke.component';
import { RespiratoryDiseaseComponent } from './respiratory-disease/respiratory-disease.component';
import { ReportComponent } from './report/report.component';
import { MortalityComponent } from './mortality/mortality.component';
import { WikiSearchComponent } from './wiki-search/wiki-search.component';
import { PredictionComponent } from './prediction/prediction.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { DoctorComponent } from './doctor/doctor.component';
import { DeepmedicamentComponent } from './deepmedicament/deepmedicament.component';





const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '', redirectTo: '/brain', pathMatch: 'full' },
  { path: 'brain', component: BrainStrokeComponent },
  {path: 'deepmedicament', component: DeepmedicamentComponent},
  { path: 'resp', component: RespiratoryDiseaseComponent },
  { path: 'report', component: ReportComponent },
  { path: 'mortality', component: MortalityComponent },
  { path: 'chatbot', component: WikiSearchComponent },
  { path: 'heartattack', component: PredictionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'doctor', component: DoctorComponent }
  

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
