import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService, EventResponse } from '../event.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetailsComponent implements OnInit {
  event: EventResponse | null = null;
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventDetails(eventId);
    } else {
      this.error = 'ID d\'événement non trouvé';
      this.isLoading = false;
    }
  }

  loadEventDetails(eventId: string) {
    this.isLoading = true;
    this.eventService.getEventById(eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event details:', error);
        this.error = 'Erreur lors du chargement des détails de l\'événement';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/events']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusText(status: string): string {
    const statusText: { [key: string]: string } = {
      'DRAFT': 'Brouillon',
      'PUBLISHED': 'Publié',
      'ONGOING': 'En cours',
      'COMPLETED': 'Terminé',
      'CANCELLED': 'Annulé'
    };
    return statusText[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const badgeClasses: { [key: string]: string } = {
      'DRAFT': 'bg-secondary',
      'PUBLISHED': 'bg-success',
      'ONGOING': 'bg-primary',
      'COMPLETED': 'bg-info',
      'CANCELLED': 'bg-danger'
    };
    return badgeClasses[status] || 'bg-light text-dark';
  }

  getMapImageUrl(): string {
    if (!this.event) return '';

    // Use coordinates if available, otherwise use address
    let locationParam = '';

    if (this.event.latitude && this.event.longitude) {
      locationParam = `${this.event.latitude},${this.event.longitude}`;
    } else {
      locationParam = `${this.event.address}, ${this.event.city}, ${this.event.country}`.replace(/ /g, '+');
    }

    // Using OpenStreetMap as fallback (no API key required)
    return `https://www.openstreetmap.org/export/embed.html?bbox=-0.5,40.5,10.5,51.5&layer=mapnik&marker=${locationParam}`;
  }

  getGoogleMapsUrl(): string {
    if (!this.event) return '';

    let locationParam = '';

    if (this.event.latitude && this.event.longitude) {
      locationParam = `${this.event.latitude},${this.event.longitude}`;
    } else {
      locationParam = `${this.event.address}, ${this.event.city}, ${this.event.country}`.replace(/ /g, '+');
    }

    return `https://www.google.com/maps/search/?api=1&query=${locationParam}`;
  }

  // ADD THESE IMAGE METHODS:
  getImageUrl(event: EventResponse | null): string {
    if (!event) {
      return '/assets/images/event1-cover.png';
    }

    console.log('🔍 Image Debug for:', event.title);
    console.log('   - coverImage:', event.coverImage);
    console.log('   - coverimage:', event.coverimage);

    let imageName = event.coverImage || event.coverimage;

    if (!imageName || imageName === 'null' || imageName === 'undefined') {
      console.log('   🟡 Using default image');
      return '/assets/images/event1-cover.png';
    }

    // Fix typos
    const typoFixes: {[key: string]: string} = {
      'events2-cover.jpg': 'event2-cover.jpg',
      'events1-cover.png': 'event1-cover.png',
      'events3-cover.jpg': 'event3-cover.jpg'
    };

    if (typoFixes[imageName]) {
      imageName = typoFixes[imageName];
      console.log('   🔧 Fixed typo:', imageName);
    }

    if (imageName.startsWith('http')) {
      console.log('   🔗 Using external URL');
      return imageName;
    }

    const imageUrl = `/assets/images/${imageName}`;
    console.log('   📁 Final image URL:', imageUrl);
    return imageUrl;
  }

  handleImageError(event: any) {
    console.log('❌ Image failed to load:', event.target.src);
    event.target.src = '/assets/images/event1-cover.png';
  }
}
