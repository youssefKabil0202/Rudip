import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // Only one import line

// Add these Material imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

// Import the event service
import { EventService, EventResponse, EventsPage } from '../event.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    RouterLink, // Add this
    RouterLinkActive, // Add this
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ]
})
export class DashboardComponent implements OnInit {
  username: string = '';
  userRole: string = '';
  userEmail: string = '';
  events: EventResponse[] = [];
  loading: boolean = false;
  totalEvents: number = 0;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.loadEvents();
  }

  // ... rest of your existing methods remain the same
  getUserInfo(): void {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const storedEmail = this.getEmailFromStorage();

      if (storedEmail === 'admin@example.com') {
        this.username = 'Administrateur';
        this.userRole = 'ADMIN';
        this.userEmail = storedEmail;
      } else if (storedEmail === 'user@example.com') {
        this.username = 'Utilisateur';
        this.userRole = 'USER';
        this.userEmail = storedEmail;
      } else {
        const emailPrefix = storedEmail.split('@')[0];
        this.username = this.capitalizeFirstLetter(emailPrefix);
        this.userRole = 'Utilisateur';
        this.userEmail = storedEmail;
      }
    }
  }

  loadEvents() {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (response: EventsPage) => {
        this.events = response.events;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Date non définie';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date invalide';
    }
  }

  getEventStatusColor(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'primary';
      case 'DRAFT': return 'warn';
      case 'CANCELLED': return 'warn';
      case 'COMPLETED': return 'accent';
      default: return 'primary';
    }
  }

  getDefaultImage(): string {
    return '/assets/default-event.jpg';
  }

  private getEmailFromStorage(): string {
    return localStorage.getItem('lastLoginEmail') || 'admin@admin';
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  logout(): void {
    console.log('Logging out...');
    this.authService.logout();
  }
}
