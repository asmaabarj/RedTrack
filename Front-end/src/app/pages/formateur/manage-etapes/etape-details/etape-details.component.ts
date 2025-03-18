import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Etape } from '../../../../models/etape.model';

@Component({
  selector: 'app-etape-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
      <div class="relative mx-auto p-8 w-full max-w-2xl shadow-2xl rounded-2xl bg-white max-h-[90vh] flex flex-col">
        <!-- Header - Make it sticky -->
        <div class="sticky top-0 bg-white z-10">
          <div class="relative pb-6 mb-6 border-b border-gray-100">
            <h3 class="text-2xl font-bold text-gray-900 flex items-center">
              <i class="fas fa-tasks mr-3 text-red-600"></i>
              {{ etape.titre }}
            </h3>
          </div>
        </div>

        <!-- Scrollable Content Section -->
        <div class="flex-1 overflow-y-auto space-y-6">
          <!-- Description Card -->
          <div class="bg-gray-50 rounded-xl p-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <i class="fas fa-align-left mr-2 text-blue-600"></i>
              Description
            </h4>
            <p class="text-gray-600 whitespace-pre-wrap leading-relaxed">{{ etape.description }}</p>
          </div>

          <!-- Timeline Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Deadline Card -->
              <div class=" ml-4 flex items-start space-x-3">
                <div>
                  <h4 class="text-sm font-semibold text-gray-700">Date limite</h4>
                  <p class="text-sm text-gray-600">{{ etape.deadline | date:'dd MMMM yyyy' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions - Make it sticky -->
        <div class="sticky bottom-0 bg-white pt-6 mt-6 border-t border-gray-100">
          <div class="flex justify-end">
            <button 
              (click)="closeModal.emit()"
              class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 
                     bg-white border border-gray-300 hover:bg-gray-50 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                     transition-all duration-200"
            >
              <i class="fas fa-times mr-2"></i>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EtapeDetailsComponent {
  @Input() etape!: Etape;
  @Output() closeModal = new EventEmitter<void>();
} 