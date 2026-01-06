import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { EventsComponent } from './events/events.component';
import { EventDetailsComponent } from './event-details/event-details';
import { SendInvitationComponent } from './send-invitation/send-invitation.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events',
    component: EventsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events/:id',
    component: EventDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events/:id/invite',
    component: SendInvitationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'scan-qr',
    component: QrScannerComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
