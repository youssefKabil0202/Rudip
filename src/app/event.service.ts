// event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface EventResponse {
  id: string;
  coverImage?: string;  // Make optional with ?
  logoImage?: string;   // Make optional with ?
  coverimage?: string;  // Add lowercase variant
  logoimage?: string;   // Add lowercase variant
  title: string;
  description: string;
  eventType: EventType;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  maxParticipants: number;
  price: number;
  organizer: UserDto;
  participantCount: number;
  viewCount: number;
}

export interface EventType {
  id: string;
  name: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
}




export interface EventsPage {
  events: EventResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;      // Changed from 'number' to 'currentPage'
  pageSize: number;         // Changed from 'size' to 'pageSize'
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllEvents(page: number = 0, size: number = 20): Observable<EventsPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', 'startDate')
      .set('sortDirection', 'ASC');

    const headers = this.getAuthHeaders();

    return this.http.get<EventsPage>(this.apiUrl, { params, headers }).pipe(
      catchError(error => {
        console.error('Error fetching events:', error);
        // Return empty page on error
        return of({
          events: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: page,
          pageSize: size
        });
      })
    );
  }

  getMyEvents(page: number = 0, size: number = 20): Observable<EventsPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    const headers = this.getAuthHeaders();

    return this.http.get<EventsPage>(`${this.apiUrl}/organizer/my-events`, { params, headers }).pipe(
      catchError(error => {
        console.error('Error fetching my events:', error);
        return of({
          events: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: page,
          pageSize: size
        });
      })
    );
  }

  getEventById(eventId: string): Observable<EventResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<EventResponse>(`${this.apiUrl}/${eventId}`, { headers });
  }
}
