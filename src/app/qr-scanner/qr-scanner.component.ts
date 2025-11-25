import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvitationService, InvitationDTO } from '../invitation.service';
import { Html5QrcodeScanner } from 'html5-qrcode';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.css'
})
export class QrScannerComponent implements OnInit, OnDestroy {
  scanner: any;
  isScanning: boolean = false;
  scanResult: string = '';
  currentInvitation?: InvitationDTO;
  scanError: string = '';
  isProcessing: boolean = false;
  hasCameraPermission: boolean = true;

  constructor(
    private invitationService: InvitationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeScanner();
  }

  initializeScanner() {
    this.scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: []
      },
      false
    );
  }

  async startScanning() {
    try {
      this.isScanning = true;
      this.scanError = '';
      this.currentInvitation = undefined;
      this.hasCameraPermission = true;

      this.scanner.render(
        (decodedText: string) => this.onScanSuccess(decodedText),
        (error: string) => this.onScanError(error)
      );
    } catch (error) {
      console.error('Error starting scanner:', error);
      this.scanError = 'Impossible d\'accéder à la caméra';
      this.hasCameraPermission = false;
    }
  }

  stopScanning() {
    if (this.scanner) {
      try {
        this.scanner.clear();
        this.isScanning = false;
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  }

  onScanSuccess(decodedText: string) {
    this.scanResult = decodedText;
    this.isProcessing = true;
    this.scanError = '';

    console.log('QR Code scanned:', decodedText);

    this.invitationService.validateQRCode(decodedText).subscribe({
      next: (invitation) => {
        this.isProcessing = false;
        this.currentInvitation = invitation;
        this.stopScanning();

        console.log('Invitation validated:', invitation);
      },
      error: (error) => {
        this.isProcessing = false;
        this.scanError = 'QR code invalide ou invitation non valide';
        console.error('Scan validation error:', error);

        setTimeout(() => {
          if (this.isScanning) {
            this.scanError = '';
          }
        }, 3000);
      }
    });
  }

  onScanError(error: string) {
    if (!error.includes('NotFoundException') && !error.includes('NoMultiFormatReaders')) {
      console.warn('Scan error:', error);
    }
  }

  markAsAttended() {
    if (!this.currentInvitation) return;

    this.invitationService.markAsAttended(this.currentInvitation.id).subscribe({
      next: (invitation) => {
        this.currentInvitation = invitation;
        alert(`✅ Présence confirmée pour: ${invitation.invitedUserName}`);
      },
      error: (error) => {
        console.error('Error marking as attended:', error);
        alert('Erreur lors de la confirmation de présence');
      }
    });
  }

  scanAgain() {
    this.scanResult = '';
    this.currentInvitation = undefined;
    this.scanError = '';
    this.startScanning();
  }

  goBack() {
    this.router.navigate(['/events']);
  }

  // ADD THESE HELPER METHODS:
  getStatusBadgeClass(status: string): string {
    const badgeClasses: { [key: string]: string } = {
      'PENDING': 'bg-status-pending text-white',
      'ACCEPTED': 'bg-status-accepted text-white',
      'DECLINED': 'bg-status-declined text-white',
      'ATTENDED': 'bg-status-attended text-white'
    };

    return badgeClasses[status] || 'bg-secondary text-white';
  }

  getStatusText(status: string): string {
    const statusText: { [key: string]: string } = {
      'PENDING': 'En attente',
      'ACCEPTED': 'Acceptée',
      'DECLINED': 'Refusée',
      'ATTENDED': 'Présence confirmée'
    };

    return statusText[status] || status;
  }

  ngOnDestroy() {
    this.stopScanning();
  }
}
