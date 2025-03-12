import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Etape } from '../../../../models/etape.model';

@Component({
  selector: 'app-etape-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-bold mb-4">{{ etape.titre }}</h3>
          <div class="mb-4">
            <p class="text-gray-600 whitespace-pre-wrap">{{ etape.description }}</p>
          </div>
          <div class="text-sm text-gray-500 mb-4">
            <p>Date limite: {{ etape.deadline | date:'dd/MM/yyyy' }}</p>
            <p>Créé le: {{ etape.createdAt | date:'dd/MM/yyyy' }}</p>
          </div>
          <div class="flex justify-end">
            <button 
              (click)="closeModal.emit()"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
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