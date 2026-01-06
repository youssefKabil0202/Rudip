import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../auth.service';
import { EventService, EventResponse } from '../event.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: EventResponse[] = [];
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAllEvents().subscribe({
      next: (page) => {
        this.events = page.events;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(event: EventResponse): string {
    // Use the same logic as in event-details.ts
    let imageName = event.coverImage || event.coverimage;

    if (!imageName || imageName === 'null' || imageName === 'undefined') {
      return '/assets/images/event1-cover.png';
    }

    if (imageName.startsWith('http')) {
      return imageName;
    }

    return `/assets/images/${imageName}`;
  }

  handleImageError(event: any): void {
    event.target.src = '/assets/images/event1-cover.png';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'DRAFT': 'Brouillon',
      'PUBLISHED': 'Publié',
      'ONGOING': 'En cours',
      'COMPLETED': 'Terminé',
      'CANCELLED': 'Annulé'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'DRAFT': 'status-draft',
      'PUBLISHED': 'status-published',
      'ONGOING': 'status-ongoing',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return classMap[status] || 'status-default';
  }

  createNewEvent(): void {
    // Navigate to create event page
    // If you don't have create page yet, you can show a message
    alert('Fonctionnalité de création d\'événement à venir');
    // this.router.navigate(['/events/create']);
  }

  logout(): void {
    this.authService.logout();
  }
truncate(text: string, length: number = 100): string {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
}
