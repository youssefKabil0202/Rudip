import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface InvitationDTO {
  id: string;
  eventId: string;
  eventTitle: string;
  invitedUserId: string;
  invitedUserEmail: string;
  invitedUserName: string;
  status: string;
  qrCode: string;
  sentAt: string;
  respondedAt?: string;
}

export interface CreateInvitationRequest {
  eventId: string;
  userIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private apiUrl = 'http://localhost:8080/api/invitations';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Create invitations for multiple users
  createInvitations(request: CreateInvitationRequest): Observable<InvitationDTO[]> {
    const headers = this.getAuthHeaders();
    return this.http.post<InvitationDTO[]>(this.apiUrl, request, { headers }).pipe(
      catchError(error => {
        console.error('Error creating invitations:', error);
        return of([]);
      })
    );
  }

  // Get invitations for a specific event
  getEventInvitations(eventId: string): Observable<InvitationDTO[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<InvitationDTO[]>(`${this.apiUrl}/event/${eventId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching event invitations:', error);
        return of([]);
      })
    );
  }

  // Get invitations for current user
  getUserInvitations(): Observable<InvitationDTO[]> {
    const headers = this.getAuthHeaders();
    // You might need to adjust this endpoint based on your backend
    return this.http.get<InvitationDTO[]>(`${this.apiUrl}/user/me`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user invitations:', error);
        return of([]);
      })
    );
  }

  // Update invitation status (ACCEPTED, DECLINED, etc.)
  updateInvitationStatus(invitationId: string, status: string): Observable<InvitationDTO> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('status', status);

    return this.http.put<InvitationDTO>(`${this.apiUrl}/${invitationId}/status`, null, {
      headers,
      params
    }).pipe(
      catchError(error => {
        console.error('Error updating invitation status:', error);
        throw error;
      })
    );
  }

  // Validate QR code (for scanning)
  validateQRCode(qrContent: string): Observable<InvitationDTO> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('qrContent', qrContent);

    return this.http.post<InvitationDTO>(`${this.apiUrl}/scan-qr`, null, {
      headers,
      params
    });
  }

  // Mark invitation as attended
  markAsAttended(invitationId: string): Observable<InvitationDTO> {
    const headers = this.getAuthHeaders();
    return this.http.post<InvitationDTO>(`${this.apiUrl}/${invitationId}/attend`, null, { headers });
  }

  // Get invitation by ID
  getInvitationById(invitationId: string): Observable<InvitationDTO> {
    const headers = this.getAuthHeaders();
    return this.http.get<InvitationDTO>(`${this.apiUrl}/${invitationId}`, { headers });
  }
}
