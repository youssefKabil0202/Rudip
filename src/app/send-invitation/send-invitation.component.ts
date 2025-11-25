import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationService, CreateInvitationRequest } from '../invitation.service';
import { EventService, EventResponse } from '../event.service';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-send-invitation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-invitation.component.html',
  styleUrl: './send-invitation.component.css'
})
export class SendInvitationComponent implements OnInit {
  eventId: string = '';
  event!: EventResponse;
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  isSending: boolean = false;
  selectedCount: number = 0;

  // New properties for custom emails
  customEmail: string = '';
  customEmails: string[] = [];
  showCustomEmailInput: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invitationService: InvitationService,
    private eventService: EventService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    if (this.eventId) {
      this.loadEventDetails();
      this.loadUsers();
    } else {
      console.error('No event ID found in route');
      this.router.navigate(['/events']);
    }
  }

  loadEventDetails() {
    this.isLoading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.isLoading = false;
        alert('Erreur lors du chargement de l\'événement');
      }
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...this.users];
      },
      error: (error) => {
        console.error('Error loading users:', error);
        alert('Erreur lors du chargement des utilisateurs');
        this.users = [];
        this.filteredUsers = [];
      }
    });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }

  toggleUserSelection(user: User) {
    user.selected = !user.selected;
    this.updateSelectedCount();
  }

  updateSelectedCount() {
    this.selectedCount = this.users.filter(user => user.selected).length;
  }

  selectAll() {
    this.users.forEach(user => user.selected = true);
    this.filteredUsers.forEach(user => user.selected = true);
    this.updateSelectedCount();
  }

  deselectAll() {
    this.users.forEach(user => user.selected = false);
    this.filteredUsers.forEach(user => user.selected = false);
    this.updateSelectedCount();
  }

  // Custom email methods
  toggleCustomEmailInput() {
    this.showCustomEmailInput = !this.showCustomEmailInput;
  }

  addCustomEmail() {
    if (this.customEmail && this.isValidEmail(this.customEmail)) {
      if (!this.customEmails.includes(this.customEmail)) {
        this.customEmails.push(this.customEmail);
        this.customEmail = '';
      }
    } else {
      alert('Please enter a valid email address');
    }
  }

  removeCustomEmail(email: string) {
    this.customEmails = this.customEmails.filter(e => e !== email);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sendInvitations() {
    const selectedUserIds = this.users
      .filter(user => user.selected)
      .map(user => user.id);

    if (selectedUserIds.length === 0 && this.customEmails.length === 0) {
      alert('Veuillez sélectionner au moins un utilisateur ou ajouter des emails');
      return;
    }

    this.isSending = true;
    const request: CreateInvitationRequest = {
      eventId: this.eventId,
      userIds: selectedUserIds
    };

    this.invitationService.createInvitations(request).subscribe({
      next: (invitations) => {
        this.isSending = false;

        let message = `${invitations.length} invitations envoyées avec succès!`;
        if (this.customEmails.length > 0) {
          message += `\n\nNote: ${this.customEmails.length} email(s) personnalisé(s) ajoutés (nécessitent une implémentation backend).`;
        }

        const shouldNavigate = confirm(message + '\n\nCliquez sur OK pour retourner aux événements.');
        if (shouldNavigate) {
          this.router.navigate(['/events', this.eventId]);
        }
      },
      error: (error) => {
        this.isSending = false;
        console.error('Error sending invitations:', error);
        alert('Erreur lors de l\'envoi des invitations: ' + error.message);
      }
    });
  }

  getSelectedUsers(): User[] {
    return this.users.filter(user => user.selected);
  }

  cancel() {
    this.router.navigate(['/events', this.eventId]);
  }
}
