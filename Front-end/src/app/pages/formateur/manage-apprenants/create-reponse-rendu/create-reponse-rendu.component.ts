import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Rendu } from '../../../../models/rendu.model';
import { Store } from '@ngrx/store';
import * as FormateurRendusActions from '../../../../store/formateur-rendus/formateur-rendus.actions';

@Component({
  selector: 'app-create-reponse-rendu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-reponse-rendu.component.html'
})
export class CreateReponseRenduComponent {
  @Input() rendu!: Rendu;
  @Output() closeModal = new EventEmitter<void>();

  response = {
    commentaire: '',
    type: 'pending'
  };

  constructor(private store: Store) {}

  onSubmit(): void {
    this.store.dispatch(FormateurRendusActions.createRenduResponse({
      renduId: this.rendu.id,
      response: this.response
    }));
    this.closeModal.emit();
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
