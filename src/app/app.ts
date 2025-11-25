import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="app-container d-flex vh-100">
      <!-- Bootstrap Sidebar -->
      <div class="sidebar bg-primary text-white d-flex flex-column" style="width: 280px;">
        <!-- Sidebar Header -->
        <div class="sidebar-header border-bottom border-white border-opacity-25 p-4">
          <div class="logo d-flex align-items-center gap-3">
            <div class="logo-icon bg-white bg-opacity-10 rounded-3 p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
              <mat-icon class="text-white fs-5">admin_panel_settings</mat-icon>
            </div>
            <div class="logo-text d-flex flex-column">
              <span class="fw-bold fs-5">AdminPanel</span>
              <span class="text-white text-opacity-75 small">Dashboard</span>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="sidebar-nav flex-grow-1 p-3 overflow-auto">
          <!-- Main Menu Section -->
          <div class="nav-section mb-4">
            <span class="nav-section-title text-white text-opacity-50 small fw-semibold text-uppercase mb-2 d-block">MAIN MENU</span>

            <a class="nav-item d-flex align-items-center text-white text-decoration-none py-2 px-3 rounded-3 mb-2"
               routerLink="/dashboard" routerLinkActive="active">
              <div class="nav-icon me-3">
                <mat-icon class="fs-6">dashboard</mat-icon>
              </div>
              <span class="nav-label flex-grow-1">Tableau de Bord</span>
              <div class="nav-indicator bg-success rounded-circle" style="width: 6px; height: 6px;"></div>
            </a>

            <a class="nav-item d-flex align-items-center text-white text-decoration-none py-2 px-3 rounded-3 mb-2"
               routerLink="/users" routerLinkActive="active">
              <div class="nav-icon me-3">
                <mat-icon class="fs-6">people</mat-icon>
              </div>
              <span class="nav-label flex-grow-1">Utilisateurs</span>
            </a>

            <a class="nav-item d-flex align-items-center text-white text-decoration-none py-2 px-3 rounded-3 mb-2"
               routerLink="/events" routerLinkActive="active">
              <div class="nav-icon me-3">
                <mat-icon class="fs-6">event</mat-icon>
              </div>
              <span class="nav-label flex-grow-1">Événements</span>
            </a>
          </div>

          <!-- Analytics Section -->
          <div class="nav-section mb-4">
            <span class="nav-section-title text-white text-opacity-50 small fw-semibold text-uppercase mb-2 d-block">ANALYTICS</span>

            <a class="nav-item d-flex align-items-center text-white text-decoration-none py-2 px-3 rounded-3 mb-2">
              <div class="nav-icon me-3">
                <mat-icon class="fs-6">bar_chart</mat-icon>
              </div>
              <span class="nav-label flex-grow-1">Analytics</span>
            </a>

            <a class="nav-item d-flex align-items-center text-white text-decoration-none py-2 px-3 rounded-3 mb-2">
              <div class="nav-icon me-3">
                <mat-icon class="fs-6">shopping_cart</mat-icon>
              </div>
              <span class="nav-label flex-grow-1">Commandes</span>
              <span class="nav-badge bg-danger rounded-pill px-2 py-1 small ms-2">12</span>
            </a>

            <a class="nav-item d-flex align-items-center text-white text-decoration-none py-2 px-3 rounded-3 mb-2">
              <div class="nav-icon me-3">
                <mat-icon class="fs-6">inventory</mat-icon>
              </div>
              <span class="nav-label flex-grow-1">Produits</span>
            </a>
          </div>

          <!-- System Section -->
          <div class="nav-section mb-4">
            <span class="nav-section-title text-white text-opacity-50 small fw-semibold text-uppercase mb-2 d-block">SYSTEM</span>

            <a class="nav-item d-flex align-items-center text-white text-decoration-none py-2 px-3 rounded-3 mb-2">
              <div class="nav-icon me-3">
                <mat-icon class="fs-6">settings</mat-icon>
              </div>
              <span class="nav-label flex-grow-1">Paramètres</span>
            </a>

            <a class="nav-item d-flex align-items-center text-white text-decoration-none py-2 px-3 rounded-3 mb-2">
              <div class="nav-icon me-3">
                <mat-icon class="fs-6">help</mat-icon>
              </div>
              <span class="nav-label flex-grow-1">Support</span>
            </a>
          </div>
        </nav>

        <!-- User Profile Section -->
        <div class="sidebar-footer border-top border-white border-opacity-25 p-3">
          <div class="user-profile d-flex align-items-center gap-3">
            <div class="user-avatar bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
              <mat-icon class="text-white text-opacity-75">account_circle</mat-icon>
            </div>
            <div class="user-details flex-grow-1">
              <div class="user-name fw-semibold small">Administrateur</div>
              <div class="user-role text-white text-opacity-75 small">Super Admin</div>
            </div>
            <button class="btn btn-link p-0 text-white text-opacity-50">
              <mat-icon class="fs-6">more_vert</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="main-content flex-grow-1 overflow-auto bg-light">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Sidebar Styles */
    .sidebar {
      background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%) !important;
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
    }

    /* Navigation Item Styles */
    .nav-item {
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
      border-left-color: rgba(255, 255, 255, 0.3);
    }

    .nav-item.active {
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%) !important;
      border-left-color: #3b82f6;
      font-weight: 500;
    }

    /* Logo Icon */
    .logo-icon {
      backdrop-filter: blur(10px);
    }

    /* Scrollbar Styling */
    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    /* Badge Styles */
    .nav-badge {
      font-size: 0.7rem;
      min-width: 20px;
      text-align: center;
    }

    /* User Avatar */
    .user-avatar {
      backdrop-filter: blur(10px);
    }
  `]
})
export class AppComponent {
  title = 'projectAngular';
}
