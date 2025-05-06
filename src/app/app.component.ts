import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router, public authService: AuthService) {}

  isHomeOrLogin(): boolean {
    return this.router.url === '/' || this.router.url === '/login';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}