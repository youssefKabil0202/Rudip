import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { EventsComponent } from './events/events.component';
import { EventDetailsComponent } from './event-details/event-details';
import { SendInvitationComponent } from './send-invitation/send-invitation.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'events', component: EventsComponent },
  { path: 'events/:id', component: EventDetailsComponent },
  { path: 'events/:id/invite', component: SendInvitationComponent }, // Add this
  { path: 'scan-qr', component: QrScannerComponent }, // Add this
  { path: '**', redirectTo: '' }
];
