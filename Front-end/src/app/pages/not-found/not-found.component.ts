import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-72 md:w-96 h-72 md:h-96 -top-48 -left-48 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute w-72 md:w-96 h-72 md:h-96 -bottom-48 -right-48 bg-red-700/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <!-- Main content -->
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-md md:max-w-2xl bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 md:p-12 shadow-2xl border border-gray-700/50 mx-4">
          <div class="text-center space-y-6 md:space-y-8">
            <!-- Logo -->
            <div class="mb-6 md:mb-10">
              <img src="assets/images/redtrack-logo-white.png" alt="RedTrack" 
                   class="h-10 md:h-14 mx-auto transform hover:scale-105 transition-transform duration-300"/>
            </div>
            
            <!-- 404 Section -->
            <div class="relative">
              <h1 class="text-[120px] md:text-[180px] font-black text-red-600/30 leading-none animate-pulse">
                404
              </h1>
              <h2 class="text-2xl md:text-4xl font-bold text-white absolute top-1/2 left-1/2 
                         transform -translate-x-1/2 -translate-y-1/2
                         text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300
                         whitespace-nowrap">
                Page non trouvée
              </h2>
            </div>
            
            <!-- Error Message -->
            <div class="max-w-lg mx-auto px-4">
              <p class="text-gray-400 text-sm md:text-base">
                Vérifiez l'URL ou utilisez le bouton ci-dessous pour revenir en lieu sûr.
              </p>
            </div>

            <!-- Action Button -->
            <div class="mt-8 md:mt-12">
              <button 
                (click)="goBack()" 
                class="group relative px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-red-600 to-red-700 
                       text-white rounded-xl overflow-hidden transition-all duration-300
                       hover:from-red-700 hover:to-red-800 
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                       focus:ring-offset-gray-900
                       w-auto md:w-auto">
                <div class="relative flex items-center justify-center space-x-2 md:space-x-3">
                  <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-700 
                              transform scale-x-0 group-hover:scale-x-100 transition-transform 
                              origin-left duration-300"></span>
                  <svg 
                    class="w-4 h-4 md:w-5 md:h-5 transform group-hover:-translate-x-1 transition-transform 
                           duration-300 relative z-10" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24">
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  <span class="font-semibold relative z-10 text-xs md:text-sm">
                    Retour à la sécurité
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative elements -->
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent 
                  via-red-500/50 to-transparent"></div>
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