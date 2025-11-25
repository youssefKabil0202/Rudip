import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  user = { email: '', password: '' };
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      email: this.user.email,
      password: this.user.password
    };

    // Store the email before making the request
    localStorage.setItem('lastLoginEmail', this.user.email);

    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Échec de la connexion';
        // Remove the stored email on error
        localStorage.removeItem('lastLoginEmail');
      }
    });
  }
}
