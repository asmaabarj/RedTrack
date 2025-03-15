import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div class="max-w-lg w-full text-center">
        <h1 class="text-9xl font-bold text-red-600 mb-4">404</h1>
        <p class="text-2xl text-white mb-8">Page non trouvée</p>
        <p class="text-gray-400 mb-8">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        <button 
          (click)="goBack()" 
          class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center mx-auto space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Retour</span>
        </button>
      </div>
    </div>
  `
})
export class NotFoundComponent {
  constructor(
    private location: Location,
    private router: Router,
    private storageService: StorageService
  ) {}

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      const authData = this.storageService.getAuth();
      if (authData?.role) {
        switch (authData.role) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;
          case 'APPRENANT':
            this.router.navigate(['/apprenant']);
            break;
          case 'FORMATEUR':
            this.router.navigate(['/formateur']);
            break;
          default:
            this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
} 