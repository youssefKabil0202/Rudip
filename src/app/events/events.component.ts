import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EventService, EventResponse, EventsPage } from '../event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: EventResponse[] = [];
  filteredEvents: EventResponse[] = [];

  searchTerm: string = '';
  selectedType: string = '';
  selectedStatus: string = '';
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.getAllEvents().subscribe({
      next: (response: EventsPage) => {  // Use EventsPage, not EventsResponseWrapper
        this.events = response.events;   // Access 'events' instead of 'content'
        this.filteredEvents = [...this.events];
        this.isLoading = false;
        console.log('Events loaded:', this.events);
        console.log('Pagination info:', {
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          pageSize: response.pageSize
        });
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(event: EventResponse): string {
    console.log('🔍 Image Debug for:', event.title);
    console.log('   - coverImage (camelCase):', event.coverImage);
    console.log('   - coverimage (lowercase):', event.coverimage);

    // ✅ FIX: Use either camelCase or lowercase field
    let imageName = event.coverImage || event.coverimage;

    if (!imageName || imageName === 'null') {
      console.log('   🟡 Using default image');
      return '/assets/images/event1-cover.png';
    }

    // Fix typos
    if (imageName === 'events2-cover.jpg') {
      imageName = 'event2-cover.jpg';
      console.log('   🔧 Fixed typo:', 'events2-cover.jpg → event2-cover.jpg');
    }
    if (imageName === 'events1-cover.png') {
      imageName = 'event1-cover.png';
      console.log('   🔧 Fixed typo:', 'events1-cover.png → event1-cover.png');
    }
    if (imageName === 'events3-cover.jpg') {
      imageName = 'event3-cover.jpg';
      console.log('   🔧 Fixed typo:', 'events3-cover.jpg → event3-cover.jpg');
    }

    if (imageName.startsWith('http')) {
      console.log('   🔗 Using external URL');
      return imageName;
    }

    const imageUrl = `/assets/images/${imageName}`;
    console.log('    Final image URL:', imageUrl);
    return imageUrl;
  }

  handleImageError(event: any) {
    console.log(' Image failed to load:', event.target.src);
    event.target.src = '/assets/images/event1-cover.png';
  }

  formatPrice(price: number): string {
    return price === 0 ? 'Gratuit' : `${price} MAD`;
  }

  // Remove the loadMockEvents method since we're using real data
  // private loadMockEvents() { ... }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = !this.searchTerm ||
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = !this.selectedType ||
        event.eventType.name === this.selectedType;

      const matchesStatus = !this.selectedStatus ||
        event.status === this.selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  getTypeBadgeClass(type: string | undefined): string {
    if (!type) {
      return 'bg-light text-dark border';
    }

    const badgeClasses: { [key: string]: string } = {
      'CONFERENCE': 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25',
      'MEETUP': 'bg-success bg-opacity-10 text-success border border-success border-opacity-25',
      'WEBINAR': 'bg-info bg-opacity-10 text-info border border-info border-opacity-25',
      'WORKSHOP': 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25',
      'OTHER': 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25'
    };

    return badgeClasses[type] || 'bg-light text-dark border';
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  viewEvent(id: string) {
    this.router.navigate(['/events', id]);
  }

  editEvent(id: string) {
    console.log('Modifier événement:', id);
  }

  deleteEvent(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      console.log('Supprimer événement:', id);
    }
  }
}
