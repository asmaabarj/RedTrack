import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EtapeAvecRendus, RenduDTO } from '../../../models/rendu.model';
import * as RendusActions from '../../../store/apprenant-rendus/apprenant-rendus.actions';

@Component({
  selector: 'app-create-rendu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-rendu.component.html'
})
export class CreateRenduComponent {
  @Input() etape!: EtapeAvecRendus;
  @Output() closeModal = new EventEmitter<void>();

  rendu: RenduDTO = {
    livrable: '',
    commentaire: '',
    etapeId: ''
  };

  constructor(private store: Store) {}

  ngOnInit() {
    if (this.etape) {
      this.rendu.etapeId = this.etape.id;
    }
  }

  onSubmit(): void {
    this.store.dispatch(RendusActions.createRendu({ rendu: this.rendu }));
    this.closeModal.emit();
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
