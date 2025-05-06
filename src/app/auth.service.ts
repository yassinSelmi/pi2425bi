// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserRole: string | null = null;
  private apiUrl = 'http://192.168.162.199:5000/api/login'; 

  constructor(private http: HttpClient, private router: Router) {
    // Charger le rôle depuis localStorage au démarrage
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      this.currentUserRole = savedRole;
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password }).pipe(
      tap((response: any) => {
        this.currentUserRole = response.role;
        localStorage.setItem('userRole', response.role); // Sauvegarde
      })
    );
  }

  logout(): void {
    this.currentUserRole = null;
    localStorage.removeItem('userRole'); // Nettoyage
    this.router.navigate(['/login']);
  }

  getCurrentUserRole(): string | null {
    return this.currentUserRole;
  }

  isAdmin(): boolean {
    return this.currentUserRole === 'administrateur';
  }

  isDoctor(): boolean {
    return this.currentUserRole === 'medecin';
  }

  isAuthenticated(): boolean {
    return this.currentUserRole !== null;
  }
}
