import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  selected?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // CHANGE TO THE NEW BASIC ENDPOINT
  private apiUrl = 'http://localhost:8080/api/users/basic';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();

    console.log('Making API call to:', this.apiUrl);

    return this.http.get<User[]>(this.apiUrl, { headers }).pipe(
      map(users => {
        console.log('Users loaded successfully:', users);
        return users;
      }),
      catchError(error => {
        console.error('Error loading users:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        throw error;
      })
    );
  }
}
