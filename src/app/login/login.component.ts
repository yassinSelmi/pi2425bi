import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  role: string = '';
  resetEmail: string = '';
  showForgotPasswordModal: boolean = false;
  isLoading: boolean = false;
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  selectRole(selectedRole: string): void {
    this.role = selectedRole;
    this.errorMessage = ''; // Reset error message when role changes
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  showForgotPassword(): void {
    this.showForgotPasswordModal = true;
  }

  closeForgotPassword(): void {
    this.showForgotPasswordModal = false;
    this.resetEmail = '';
  }

  sendResetLink(): void {
    if (!this.resetEmail) {
      alert('Veuillez entrer votre email');
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.showForgotPasswordModal = false;
      alert(`Un lien de réinitialisation a été envoyé à ${this.resetEmail}`);
      this.resetEmail = '';
    }, 1500);
  }

  validateCredentials(): boolean {
    if (this.role === 'admin') {
      return this.username === 'admin' && this.password === 'admin123';
    } else if (this.role === 'doctor') {
      return this.username === 'doctor' && this.password === 'doctor123';
    }
    return false;
  }

 /* onSubmit(): void {
    this.errorMessage = '';

    if (!this.username || !this.password || !this.role) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      if (this.authService.login(this.username, this.password, this.role)) {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/report']);
        } else if (this.authService.isDoctor()) {
          this.router.navigate(['/brain']);
        }
      } else {
        if (this.role === 'admin') {
          this.errorMessage = 'Identifiants admin incorrects. Utilisez admin/admin123';
        } else if (this.role === 'doctor') {
          this.errorMessage = 'Identifiants docteur incorrects. Utilisez doctor/doctor123';
        }
      }
      this.isLoading = false;
    }, 1500);
  }*/
    onSubmit(): void {
      this.errorMessage = '';
    
      if (!this.username || !this.password) {
        this.errorMessage = 'Veuillez remplir tous les champs';
        return;
      }
    
      this.isLoading = true;
    
      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          const role = response.role;
          if (role === 'administrateur') {
            this.router.navigate(['/report']);
          } else if (role === 'medecin') {
            this.router.navigate(['/brain']);
          } else {
            this.errorMessage = "Rôle non reconnu.";
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error.message || "Erreur de connexion.";
          this.isLoading = false;
        }
      });
    }
    
}